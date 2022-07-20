
const { ObjectId } = require('mongodb');
const adminModel = require('../../models/adminModel.js');
const response = require("../../utility/httpResponseMessage");
const statusCode = require("../../utility/httpResponseCode");
const { query, body, check, oneOf, validationResult } = require('express-validator');
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
    return `${location}[${param}]: ${msg}`;
};
module.exports = {


   

    //=========================================Get Static Content=========================================//
    getPrivacyContent: async (req, res) => {

        try {
            return response.responseHandlerWithData(res, 200, 'privacy policy', "http://13.59.90.211/HBstatic/privacy.html");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, 'internal server error');
        }

    },

    //=========================================Get Static Content=========================================//
    getAboutUsContent: async (req, res) => {

        try {
            return response.responseHandlerWithData(res, 200, 'About Us', "http://13.59.90.211/HBstatic/aboutUs.html");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, 'internal server error');
        }

    },

    //=========================================Get Static Content=========================================//
    getTermsContent: async (req, res) => {

        try {
            return response.responseHandlerWithData(res, 200, 'privacy policy', "http://13.59.90.211/HBstatic/terms.html");
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, 'internal server error');
        }

    },

    //=========================================Get Static Content=========================================//
    contactUs: async (req, res) => {

        try {
            // contactDetails = {
            //     email: "admin@gmail.com",
            //     phone: "8700999988",
            //     address: "Maniya testing location ",
            //     officialWebsite: "www.B2BE-commerce.com"
            // }

            let adminData = await adminModel.find().select('email countryCode phone address officialWebsite')

            console.log('=========contactDetails=================', adminData)
            return response.responseHandlerWithData(res, 200, 'contact us details', adminData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, 500, 'internal server error');
        }
    },
    //===========================================Forgot Password================================================//
    forgotPassword: async (req, res) => {
        try {

            let adminData = await adminModel.find().select('email countryCode phone')
            return response.responseHandlerWithData(res, statusCode.SUCCESS, "please contact admin to change the login credentials", adminData);
        } catch (error) {
            response.log("Error is=========>", error);
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },



}
