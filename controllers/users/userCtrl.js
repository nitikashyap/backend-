const { ObjectId } = require('mongodb');
const userModel = require('../../models/userModel.js')
const response = require("../../utility/httpResponseMessage");
const statusCode = require("../../utility/httpResponseCode");
const { body, check, oneOf, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { use } = require('../../routes/user.js');




module.exports = {

    getUserDetails: async (req, res) => {
        try {

            let userId = req.query.userId ? req.query.userId : req.query.tokenUser._id

            let userData = await userModel.aggregate([
                {
                    $match: { _id: ObjectId(userId) }
                },
            ])

            return response.responseHandlerWithData(res, statusCode.SUCCESS, `Data found successfully`, userData);
        } catch (error) {
            response.log("Error is============>", error)
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    userUpdateDetails: async (req, res) => {

        try {
            let userId =req.query.tokenUser._id
            console.log(req.body)

            let userUpdatableData = {
            }
            if (req.body.profilePic) {
                userUpdatableData.profilePic = req.body.profilePic
            }
            if (req.body.userName) {
                userUpdatableData.userName = req.body.userName
            }
            if (req.body.email) {
                let checkEmail = await userModel.findOne({ email: req.body.email.toLowerCase(), _id: { $ne: userId } })
                if (checkEmail) {
                    response.log("Email already exist");
                    return response.responseHandlerWithMessage(res, statusCode.ERROR, "Email already exist");
                }
                userUpdatableData.email = req.body.email.toLowerCase()
                userUpdatableData.verifyEmail = "No"
            }
            if (req.body.phone) {
                let checkMobile = await userModel.findOne({ phone: req.body.phone, _id: { $ne: userId } })
                if (checkMobile) {
                    response.log("Phone already exist");
                    return response.responseHandlerWithMessage(res, statusCode.ERROR, "phone already exist");
                }
                userUpdatableData.phone = req.body.phone
                userUpdatableData.verifyPhone = "No"
            }
            let result = await userModel.findByIdAndUpdate({ _id: userId }, { $set: userUpdatableData }, { new: true, lean: true })
            let findUser=await userModel.findOne({_id:result._id})
            response.log("Profile has been updated successfully", findUser);
            return response.responseHandlerWithData(res, statusCode.SUCCESS, "Profile has been updated successfully", findUser);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    changePassword: async (req, res) => {
        try {
            let userId = req.query.tokenUser._id
            await body('oldPassword').not().isEmpty().run(req);
            await body('newPassword').not().isEmpty().run(req);
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, 'internal server error')
            }
            let checkUserid = await userModel.findOne({ _id: userId })
            if (!checkUserid) {
                return response.responseHandlerWithMessage(res, 503, "User does not exits...")
            }
            let checkPassword = await bcrypt.compare(req.body.oldPassword, checkUserid.password);
            if (!checkPassword) {
                return response.responseHandlerWithMessage(res, 503, "old password not matched...")
            }
            var newPasswords = await bcrypt.hash(req.body.newPassword, 10)
            let result = await userModel.findByIdAndUpdate({ _id: userId }, { $set: { password: newPasswords, plainPassword: req.body.newPassword } }, { new: true });
            response.responseHandlerWithData(res, 200, "Your password change successfull...", result);

        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, "Internal server error");

        }
    },
}