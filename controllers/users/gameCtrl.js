const { ObjectId } = require('mongodb');
const GAME = require('../../models/gameModel')
const response = require("../../utility/httpResponseMessage");
const statusCode = require("../../utility/httpResponseCode");
const { body, check, oneOf, validationResult } = require('express-validator');
const moment = require('moment');
const { log } = require('../../utility/httpResponseMessage');

module.exports = {

    createGame: async (req, res) => {
        try {
            let userId = req.query.tokenUser._id
            await body('name').not().isEmpty().run(req);
            await body('startDate').not().isEmpty().run(req);
            await body('startTime').not().isEmpty().run(req);
            await body('endDate').not().isEmpty().run(req);
            await body('endTime').not().isEmpty().run(req);

            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                response.log("Field is missing")
                return response.responseHandlerWithMessage(res, 503, 'internal server error')
            }
            // let checkEmail = await userModel.findOne({ email: req.body.email });
            // response.log("Email and Mobile already exist")
            // if (checkEmail) {
            //     return response.responseHandlerWithData(res, 409, "Email and Mobile already exist")
            // }
            let start = new Date(req.body.startDate)
            let end = new Date(req.body.endDate)
            let gameData = new GAME({
                createdBy: ObjectId(userId),
                name: req.body.name,
                startDate: start,
                startTime: req.body.startTime,
                endDate: end,
                endTime: req.body.endTime,
            })
            let data = await gameData.save()
            response.responseHandlerWithData(res, 200, "Game Created Successfully", data)
        } catch (error) {
            response.log("error>>>", error)
            return response.responseHandlerWithMessage(res, 500, 'internal server error')
        }
    },

    gameList: async (req, res) => {
        try {
            let userId = req.query.tokenUser._id
            let getGame = await GAME.aggregate([
                { $match: { createdBy: ObjectId(userId) } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$startDate" } },
                        list: { $push: "$$ROOT" },
                    }
                },
                {
                    $sort: {
                        createdAt: -1,
                    }
                }
            ])
            if (getGame) {
                return response.responseHandlerWithData(res, statusCode.SUCCESS, "Game List Fetch successfully", getGame);
            } else {
                return response.responseHandlerWithMessage(res, statusCode.ERROR, "Game Data Not Found");
            }
        } catch (error) {
            console.log(`error is ${error}`)
            return response.responseHandlerWithMessage(res, 500, error);
        }
    }
}