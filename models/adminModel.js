const mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate');
let mongooseAggregatePaginate = require('mongoose-aggregate-paginate');
let Schema = mongoose.Schema;
var func = require('../utility/commonFun.js');
const Admin = mongoose.Schema({

    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    username: {
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
    profilePic: {
        type: String,
        default: "https://res.cloudinary.com/a2karya80559188/image/upload/v1584446275/admin_nke1cg.jpg"
    },
    age: {
        type: Number
    },
    dob: {
        type: String
    },
    idCard: {
        type: String
    },
    address: {
        type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        default: 'Male'
    },
    countryCode: {
        type: String
    },
    phone: {
        type: String
    },
    jwtToken: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
})

Admin.plugin(mongoosePaginate);
Admin.plugin(mongooseAggregatePaginate);


const AdminModel = mongoose.model('admins', Admin, 'admins');
module.exports = AdminModel
// AdminModel.findOne({}, (error, success) => {
//     if (error) {
//         console.log(error)
//     } else {
//         if (!success) {
//             func.bcrypt("admin123", (err, password) => {
//                 if (err)
//                     console.log("Error is=============>", err)
//                 else {
//                     new AdminModel({
//                         email: "admin@gmail.com",
//                         password: password,
//                         plainPassword: "admin123",
//                         username: "Hunting Admin",
//                         firstName: "Hunting",
//                         lastName: "Admin",
//                         countryCode: "+91",
//                         phone: "8700999988",
//                         officialWebsite: "https://www.b2be-commerce.com/",
//                         userType: "Admin",
//                         address: "Hunting testing location ",
//                         profilePic: "https://res.cloudinary.com/a2karya80559188/image/upload/v1584446275/admin_nke1cg.jpg"
//                     }).save((error, success) => {
//                         if (error) {
//                             console.log("Error in creating admin");
//                         }
//                         else {
//                             console.log("Admin created successfully");
//                             console.log("Admin data is==========>", success);
//                         }
//                     })
//                 }
//             })
//         }
//     }
// })
