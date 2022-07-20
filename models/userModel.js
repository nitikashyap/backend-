const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
const User = mongoose.Schema({

    userName: {
        type: String
    },
    userType: {
        type: String
    },
    city: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    plainPassword: {
        type: String
    },
    countryCode: {
        type: String
    },
    phone: {
        type: String
    },
    profilePic: {
        type: String,
        default:''
    },
    userType: {
        type: String,
        default: 'User'
    },
    address: {
        type: String
    },
    otp: {
        type: Number
    },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [{
            type: Number,
            createIndexes: true
        }],
    },
    otp: {
        type: String
    },
    jwtToken: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Block'],
        default: 'Active'
    },
    isEmailVerify: {
        type: Boolean,
        default: false
    },
    deviceToken: {
        type: String,
        default: ''
    },
    deviceType: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

User.plugin(mongoosePaginate);
User.plugin(mongooseAggregatePaginate);

const UserModel = mongoose.model('users', User, 'users');
module.exports = UserModel