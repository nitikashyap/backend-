
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../../models/userModel.js')
const response = require("../../utility/httpResponseMessage");
const statusCode = require("../../utility/httpResponseCode");
const sendMail = require("../../utility/sendMail.js");

const { body, param, check, oneOf, validationResult } = require('express-validator');
const UserModel = require('../../models/userModel.js');
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
};

module.exports = {

    userSignup: async (req, res) => {
        try {
            await body('email').isEmail().run(req);
            await body('password').not().isEmpty().run(req);
            await body('userName').not().isEmpty().run(req);
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, 'internal server error')
            }
            let checkEmail = await userModel.findOne({ email: req.body.email });
            response.log("Email and Mobile already exist")
            if (checkEmail) {
                return response.responseHandlerWithData(res, 409, "Email and Mobile already exist")
            }
            let hashedPassword = await bcrypt.hash(req.body.password, 10)
            let user = new userModel({
                userName: req.body.userName,
                email: (req.body.email).toLowerCase(),
                password: hashedPassword,
                plainPassword: req.body.password
            })
            let data = await user.save()
            response.responseHandlerWithMessage(res, 200, "SignUp successfully please verify your mail")
        } catch (error) {
            response.log("error>>>", error)
            return response.responseHandlerWithMessage(res, 500, 'internal server error')
        }
    },

    userLogin: async (req, res) => {
        try {
            await body('email').not().isEmpty().run(req);
            await body('password').not().isEmpty().run(req);
            await body('deviceToken').not().isEmpty().run(req);
            await body('deviceType').not().isEmpty().run(req);
            const errors = validationResult(req).formatWith(errorFormatter);;
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }
            let checkUser = await userModel.findOne({ email: req.body.email })
            if (!checkUser) {
                return response.responseHandlerWithMessage(res, statusCode.RESULTNOTFOUND, "It seems that you are not a regisster user");
            }

            //##########  VERIFY PASSWORD #########//
            response.log("Bcrypt Password is=======>", checkUser.password)
            let passVerify = bcrypt.compareSync(req.body.password, checkUser.password);
            if (!passVerify) {
                response.log("Invalid Credentails")
                return response.responseHandlerWithMessage(res, statusCode.RESULTNOTFOUND, "Invalid Credentails");
            }

            req.body.password = checkUser.password
            let query = { $and: [{ _id: checkUser._id }, { password: req.body.password }] }
            let checkPassword = await userModel.findOne(query)
            if (!checkPassword) {
                response.log("Invalid Credentails")
                return response.responseHandlerWithMessage(res, statusCode.RESULTNOTFOUND, "Invalid Credentails");
            }

            if (checkUser.status == 'Inactive') {
                response.log("You have Suspended by administrator")
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Your account have been disabled by administrator due to any suspicious activity");
            }
            if (checkUser.status == 'Block') {
                response.log("You have blocked by administrator")
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Your account have been disabled by administrator due to any suspicious activity");
            }

            let jwtToken = jwt.sign({ "_id": checkUser._id }, `sUpER@SecReT`);
            let result2 = await userModel.findByIdAndUpdate({ "_id": checkUser._id }, { $set: { "jwtToken": jwtToken, deviceToken: req.body.deviceToken, deviceType: req.body.deviceType } }, { new: true, lean: true }).select('-password -plainPassword')
            response.log("You have successfully logged in.", result2)
            return response.responseHandlerWithData(res, statusCode.SUCCESS, "You have successfully logged in", result2);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    userLogout: async (req, res) => {
        let userId = req.query.tokenUser._id

        try {
            let checkUser = await userModel.findOne({ "_id": userId })
            if (!checkUser) {
                response.log("Invalid User Id");
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Invalid Token");
            }
            let result = await userModel.findByIdAndUpdate({ "_id": userId }, { $set: { jwtToken: "", deviceType: '', deviceToken: '', otp: '' } }, { new: true })
            response.log("Logout successfully", result)
            return response.responseHandlerWithMessage(res, statusCode.SUCCESS, "Logout successfully");
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
            let checkUser = await UserModel.findOne({
                "email": req.body.email
            })
            if (!checkUser) {
                response.log("Invalid User email");
                return response.responseHandlerWithMessage(res, statusCode.INVALIDREQUEST, "Invalid email");
            }
            var otp = Math.floor(1000 + Math.random() * 9000);
            let Data = checkUser.userName
            let sentMail = await sendMail.sendOtp(req.body.email, Data, otp);
            let updateUser = await userModel.findOneAndUpdate({ email: req.body.email }, { $set: { otp: otp } })
            return response.responseHandlerWithData(res, statusCode.SUCCESS, "Verification Link Has Been Sent On Your Registered Email", {
                "otp": otp
            })
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    verifyOtp: async (req, res) => {
        try {
            await body('email').not().isEmpty().run(req);
            await body('otp').not().isEmpty().run(req);
            const errors = validationResult(req).formatWith(errorFormatter);;
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }
            let findUser = await UserModel.findOne({
                email: req.body.email
            })
            if (req.body.otp == findUser.otp) {
                let updateUser = await UserModel.findOneAndUpdate({ _id: findUser._id }, { $set: { otp: '', isEmailVerify: true } })
                return response.responseHandlerWithMessage(res, statusCode.SUCCESS, "Otp verify successfully...");
            } else {
                return response.responseHandlerWithMessage(res, statusCode.ERROR, "Enter correct otp...");
            }
        }
        catch (error) {
            response.log("error>>>", error)
            return response.responseHandlerWithMessage(res, 500, 'internal server error')
        }


    },

    forgotPassword: async (req, res) => {
        try {
            response.log("Request for forgot password is==============>", req.body)
            await body('email').not().isEmpty().run(req);
            await body('newPassword').not().isEmpty().run(req);
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, 'Field is missing')
            }
            let checkEmail = await userModel.findOne({ email: (req.body.email).toLowerCase() })
            if (!checkEmail) {
                return response.responseHandlerWithMessage(res, 503, "Your email address is invalid. Please enter a valid address.")
            }
            let userId = checkEmail._id;
            let newPasswor = await bcrypt.hash(req.body.newPassword, 10);
            let data = await userModel.findByIdAndUpdate({ _id: userId }, { $set: { password: newPasswor, plainPassword: req.body.newPassword } }, { new: true })
            return response.responseHandlerWithMessage(res, 200, 'password forgot successsfully...')
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");

        }

    },

}
