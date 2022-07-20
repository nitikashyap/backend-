const mongoose = require('mongoose')
let Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const Game = mongoose.Schema({

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    name: {
        type: String
    },
    startDate: {
        type: Date
    },
    startTime: {
        type: String
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Live', 'Completed'],
        default: 'Scheduled'
    },
    endTime: {
        type: String
    },
    joinedUserUd: {
        type: Schema.Types.ObjectId,
        ref: "users"
    }
}, {
    timestamps: true
})

Game.plugin(mongoosePaginate);
Game.plugin(mongooseAggregatePaginate);

const GameModel = mongoose.model('game', Game);
module.exports = GameModel