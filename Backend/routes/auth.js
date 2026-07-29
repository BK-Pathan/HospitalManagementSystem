const express = require('express');

const router = express.Router();


const {
register,
login,
logout,
getProfile,
updateProfile,
changePassword

} = require('../controllers/authController');


const authMiddleware = require("../middleware/authMiddleware");



router.post(
"/register",
register
);


router.post(
"/login",
login
);


router.post(
"/logout",
logout
);



router.get(
"/profile",
authMiddleware,
getProfile
);


router.put(
"/change-password",
authMiddleware,
changePassword
);

router.put(
"/profile",
authMiddleware,
updateProfile
);



module.exports = router;