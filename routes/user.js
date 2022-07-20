const express = require('express')
const router = express.Router();

const authHandler = require('../authHandler/auth.js');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const authCtrl = require('../controllers/users/authCtrl.js');
const userCtrl = require('../controllers/users/userCtrl');
const gameCtrl = require('../controllers/users/gameCtrl');


router.post('/signup', authCtrl.userSignup);
router.post('/login', authCtrl.userLogin);
router.post('/forgotPassword', authCtrl.forgotPassword);
router.post('/sendMail', authCtrl.sendMail);
router.post('/verifyOtp', authCtrl.verifyOtp);

router.use(authHandler.authUser);

//USER MANAGEMENT
router.get('/userDetails', userCtrl.getUserDetails);
router.post('/userUpdateDetails', multipartMiddleware, userCtrl.userUpdateDetails);
router.post('/changePassword', userCtrl.changePassword);
router.get('/logout', authCtrl.userLogout);


//Game
router.post('/createGame', gameCtrl.createGame);
router.get('/gameList', gameCtrl.gameList);



module.exports = router;
