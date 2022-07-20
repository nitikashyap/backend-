
const { ObjectId } = require('mongodb');
const Customer = require('../../models/userModel.js');
const response = require("../../utility/httpResponseMessage");
const statusCode = require("../../utility/httpResponseCode");
const { body, validationResult } = require('express-validator');
const errorFormatter = ({ location, msg, param }) => {
    return `${location}[${param}]: ${msg}`;
};

module.exports = {

    //========================================Customer Module=================================================//

    customersList: async (req, res) => {
        try {
            var pageNo = req.body.pageNumber ? Number(req.body.pageNumber) : 1;
            var recordPerPage = req.body.recordPerPage ? Number(req.body.recordPerPage) : 10;
            var search = {}
            if (req.body.search) {
                search.$or = [{
                    "fullName": {
                        $regex: "^" + req.body.search,
                        $options: 'i'
                    }
                },
                {
                    "city": {
                        $regex: "^" + req.body.search,
                        $options: 'i'
                    }
                },
                {
                    "email": {
                        $regex: "^" + req.body.search,
                        $options: 'i'
                    }
                },
                ]
            }
            const limit = parseInt(recordPerPage);
            let options = { page: pageNo, limit: limit };
            let aggregate = Customer.aggregate([

                {
                    $match: search,
                },
                {
                    $sort: {
                        createdAt: 1
                    }
                },

            ])
            let result = await Customer.aggregatePaginate(aggregate, options);
            if (result.docs.length == 0) {
                return response.responseHandlerWithMessage(res, statusCode.DATAMISSING, "Customer Data Not Found");
            } else {
                return response.responseHandlerWithData(res, statusCode.SUCCESS, "Customer Data fetched successfully", result);
            }
        } catch (error) {
            console.log(`error is ${error}`)
            return response.responseHandlerWithMessage(res, 500, error);
        }

    },

    customerDetails: async (req, res) => {
        try {
            await body('customerId').not().isEmpty().run(req);
            const errors = validationResult(req).formatWith(errorFormatter);;
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }
            response.log("query is===>", req.body)
            let result = await Customer.aggregate([
                {
                    $match:
                    {
                        "_id": ObjectId(req.body.customerId)
                    }
                },
            ])
            response.log("Customer have successfully fetched ", result)
            return response.responseHandlerWithData(res, statusCode.SUCCESS, "Customer Data fetched successfully", result);
        } catch (error) {
            response.log("Error is============>", error)
            return response.responseHandlerWithMessage(res, statusCode.ERROR, "Internal server error");
        }
    },

    changeStatus: async (req, res) => {
        try {
            await body('customerId').not().isEmpty().run(req);
            await body('status').not().isEmpty().run(req);
            const errors = validationResult(req).formatWith(errorFormatter);;
            if (!errors.isEmpty()) {
                return response.responseHandlerWithData(res, statusCode.DATAMISSING, "Please check your request", errors.array());
            }
            var updateStatus = "";
            if (req.body.status) {
                updateStatus = req.body.status
            }
            let customerDetails = await Customer.findOneAndUpdate({ _id: ObjectId(req.body.customerId) },
                {
                    $set:
                    {
                        status: updateStatus
                    }
                }
            )
            console.log('===========>>>>customerDetails', customerDetails)
            return response.responseHandlerWithMessage(res, 200, 'Customer Status Changed Successfully');
        } catch (error) {
            console.log(`error is ${error}`)
            return response.responseHandlerWithMessage(res, 500, error);
        }

    },


}
