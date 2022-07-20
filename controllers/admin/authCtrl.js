const { ObjectId } = require('mongodb');
//const sendMail          = require("../../utility/sendMail.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/adminModel.js')
const response = require("../../utility/httpResponseMessage");
const statusCode = require("../../utility/httpResponseCode");
const { body, check, oneOf, validationResult } = require('express-validator');
const sendMail = require("../../utility/sendMail.js");
const customerCtrl = require('./customerCtrl.js');
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
};
module.exports = {

    //========================================Admin Management=================================================//

    adminLogin: async (req, res) => {
        try {
            await body('email').not().isEmpty().run(req);
            await body('password').not().isEmpty().run(req);
            response.log("Request for Admin is=============>", req.body);

            const errors = validationResult(req).formatWith(errorFormatter);
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }

            let checkAdmin = await Admin.findOne({
                email: req.body.email
            })
            if (!checkAdmin) {
                response.log("Invalid Email");
                return response.responseHandlerWithMessage(res, statusCode.RESULTNOTFOUND, "Invalid Email");
            }

            let passVerify = await bcrypt.compare(req.body.password, checkAdmin.password);
            if (!passVerify) {
                response.log("Invalid Credentails");
                return response.responseHandlerWithMessage(res, statusCode.RESULTNOTFOUND, "Invalid Credentails");
            } else {
                var jwtToken = jwt.sign({
                    "_id": checkAdmin._id
                }, `sUpER@SecReT`);
                response.log("Jwt Token is=========>", jwtToken)
                let result = await Admin.findByIdAndUpdate({
                    _id: checkAdmin._id
                }, {
                    $set: {
                        jwtToken: jwtToken,
                        otp: ''
                    }
                }, {
                    new: true
                });
                return response.responseHandlerWithData(res, statusCode.SUCCESS, "You have successfully logged in ", result);
            }
        } catch (error) {
            response.log("Error is============>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    adminDetails: async (req, res) => {
        try {
            response.log("query is===>", req.body)
            let result = await Admin.aggregate([

                {
                    $match: { "_id": ObjectId(req.query.tokenUser._id) }
                },

            ])
            response.log("Admin details have successfully fetched ", result)
            return response.responseHandlerWithData(res, statusCode.SUCCESS, "Admin Data fetched successfully", result);
        } catch (error) {
            response.log("Error is============>", error)
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    changePassword: async (req, res) => {

        let userId = req.query.userId ? req.query.userId : req.query.tokenUser._id
        try {

            await body('newPassword').not().isEmpty().run(req);
            await body('oldPassword').not().isEmpty().run(req);

            const errors = validationResult(req).formatWith(errorFormatter);;
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }

            let checkUser = await Admin.findOne({ "_id": userId })
            if (!checkUser) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Invalid Token");
            }

            const match = await bcrypt.compare(req.body.oldPassword, req.query.tokenUser.password);
            if (match) {
                req.body.plainpassword = req.body.newPassword
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(req.body.newPassword, salt);
                let result = await Admin.findByIdAndUpdate({ "_id": userId }, { $set: { password: hash, plainpassword: req.body.newPassword } }, { new: true })
                response.log("Change Password successfully", result)
                return response.responseHandlerWithMessage(res, statusCode.SUCCESS, "Change Password successfully");

            } else {
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Invalid oldPassword");
            }

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    adminLogout: async (req, res) => {
        let userId = req.query.userId ? req.query.userId : req.query.tokenUser._id
        try {

            let checkUser = await Admin.findOne({ "_id": userId })
            if (!checkUser) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Invalid Token");
            }

            let result = await Admin.findByIdAndUpdate({ "_id": userId }, { $set: { jwtToken: "", deviceType: "", deviceToken: "", otp: "" } }, { new: true })
            response.log("Logout successfully", result)
            return response.responseHandlerWithMessage(res, statusCode.SUCCESS, "Logout successfully");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    updateAdmin: async (req, res) => {

        let userId = req.query.userId ? req.query.userId : req.query.tokenUser._id

        try {
            let adminUpdatableData = {
            }
            if (req.body.profilePic) {
                adminUpdatableData.profilePic = req.body.profilePic
            }
            if (req.body.firstName) {
                adminUpdatableData.firstName = req.body.firstName
            }
            if (req.body.lastName) {
                adminUpdatableData.lastName = req.body.lastName
            }
            let result = await Admin.findByIdAndUpdate({ _id: userId }, { $set: adminUpdatableData }, { new: true, lean: true })
            response.log("Profile has been updated successfully", result);
            return response.responseHandlerWithData(res, statusCode.SUCCESS, "Profile has been updated successfully", result);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    sendMail: async (req, res) => {
        try {
            await body('email').not().isEmpty().run(req);

            const errors = validationResult(req).formatWith(errorFormatter);;
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }

            let checkUser = await Admin.findOne({
                "email": req.body.email
            })
            if (!checkUser) {
                response.log("Invalid User email");
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Invalid email");
            }
            let Data = checkUser.username
            let sentMail = await sendMail.sendForgetPasswordLink(req.body.email, Data, 'Verification From Admin Panel');

            return response.responseHandlerWithMessage(res, statusCode.SUCCESS, "Verification Link Has Been Sent On Your Registered Email", {
                "email": req.body.email
            })
            // if (!sentMail) {
            //     return response.responseHandlerWithData(res, statusCode.ERROR, "Email Not Send Due to Internal Issue");
            // } else {
            //     return response.responseHandlerWithMessage(res, statusCode.SUCCESS, "Verification Link has been sent on your egistered email", {
            //         "email": req.body.email
            //     })
            // }
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    forgetPassword: async (req, res) => {
        try {
            await body('email').not().isEmpty().run(req);
            await body('newPassword').not().isEmpty().run(req);

            const errors = validationResult(req).formatWith(errorFormatter);;
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }

            let checkUser = await Admin.findOne({
                "email": req.body.email
            })
            if (!checkUser) {
                response.log("Invalid User email");
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Invalid email");
            }
            const salt = bcrypt.genSaltSync(10)
            const hash = await bcrypt.hash(req.body.newPassword, salt);
            console.log("============>>>>>", hash);

            let updatedData = {
                password: hash,
                plainPassword: req.body.newPassword
            }
            let result = await Admin.updateOne({
                "email": req.body.email
            }, {
                $set: updatedData
            })
            response.log("Password Reset successfully", result)
            return response.responseHandlerWithMessage(res, statusCode.SUCCESS, "Password Reset successfully");


        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }

    },

}
