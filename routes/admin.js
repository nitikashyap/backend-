const express = require('express')
const router = express.Router();
const authCtrl = require('../controllers/admin/authCtrl.js');
const authHandler = require('../authHandler/auth.js');
const multipart = require('connect-multiparty');
const customerCtrl = require('../controllers/admin/customerCtrl');



router.post('/login', authCtrl.adminLogin);
router.post('/sendMail', authCtrl.sendMail);
router.post('/forgetPassword', authCtrl.forgetPassword);

router.use(authHandler.authAdmin);
router.get('/adminDetails', authCtrl.adminDetails);
router.post('/changePassword', authCtrl.changePassword);
router.put('/updateAdmin', authCtrl.updateAdmin);
router.get('/adminLogout', authCtrl.adminLogout);

//CUSTOMERS MANAGEMENT
router.post('/customersList', customerCtrl.customersList);
router.post('/customerDetails', customerCtrl.customerDetails);
router.post('/customerStatus', customerCtrl.changeStatus);

module.exports = router;