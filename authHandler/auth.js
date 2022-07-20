var jwt = require('jsonwebtoken');
const response = require("../utility/httpResponseMessage");
const statusCode = require("../utility/httpResponseCode");
const Admin = require('../models/adminModel')
const userModel = require('../models/userModel')


module.exports = {

    authAdmin: async (req, res, next) => {
        try {
            response.log("Token is admin==========>", req.headers.authorization)
            if (!req.headers.authorization) {
                response.log("Token is missing")
                return response.responseHandlerWithMessage(res, statusCode.DATAMISSING, "Something went wrong");
            }
            jwt.verify(req.headers.authorization, `sUpER@SecReT`, async (error, result) => {
                if (error) {
                    response.log("Invalid Token1")
                    return response.responseHandlerWithMessage(res, statusCode.TOKENEXPIRE, "Invalid Token");
                }
                console.log({ result })
                let checkAdmin = await Admin.findOne({ _id: result._id, jwtToken: req.headers.authorization })
                if (!checkAdmin) {
                    response.log("Invalid Token2")
                    return response.responseHandlerWithMessage(res, statusCode.TOKENEXPIRE, "Invalid Token");
                }
                checkAdmin.userType = 'Admin'
                // req.query = Object.assign(req.query,checkAdmin)
                req.query.tokenUser = checkAdmin
                response.log("Request is==========>", req.user)
                next();
            })
        } catch (error) {
            response.log("Error is============>", error)
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    authUser: async (req, res, next) => {

        try {
            response.log("Token is user==========>", req.headers.authorization)
            if (!req.headers.authorization) {
                response.log("Token is missing")
                return response.responseHandlerWithMessage(res, statusCode.DATAMISSING, "Something went wrong");
            }
            jwt.verify(req.headers.authorization, `sUpER@SecReT`, async (error, result) => {
                if (error) {
                    response.log("Invalid Token1")
                    return response.responseHandlerWithMessage(res, statusCode.TOKENEXPIRE, "Invalid Token");
                }
                console.log({ result })
                let checkUser = await userModel.findOne({ _id: result._id, jwtToken: req.headers.authorization })
                if (!checkUser) {
                    response.log("Invalid Token2")
                    return response.responseHandlerWithMessage(res, statusCode.TOKENEXPIRE, "Invalid Token");
                }
                checkUser.userType = 'User'

                req.query.tokenUser = checkUser
                response.log("Request is==========>", req.user)
                next();
            })
        } catch (error) {
            response.log("Error is============>", error)
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },
}