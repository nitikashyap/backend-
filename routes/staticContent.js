const express             = require('express')
const router              = express.Router();
// const multiparty = require('connect-multiparty');
// const multipartyM = multiparty();



const staticCtrl     = require('../controllers/common/commonCtrl.js');

router.get('/getPrivacyContent',staticCtrl.getPrivacyContent);
router.get('/getAboutUsContent',staticCtrl.getAboutUsContent);
router.get('/getTermsContent',staticCtrl.getTermsContent);
router.get('/contactUs',staticCtrl.contactUs);
router.get('/forgotPassword',staticCtrl.forgotPassword);



module.exports = router;