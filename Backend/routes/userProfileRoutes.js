const express = require("express");

const router = express.Router();


const auth = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadFile");


const {

uploadProfileImage,
removeProfileImage

} = require("../controllers/userProfileController");





router.post(

"/profile-image",

auth,


(req,res,next)=>{


upload.single("image")(req,res,(err)=>{


if(err){


if(err.code === "LIMIT_FILE_SIZE"){


return res.status(400).json({

message:"Image size must be less than 2MB"

});


}



return res.status(400).json({

message:err.message

});


}



next();


});


},


uploadProfileImage


);







router.delete(

"/profile-image",

auth,

removeProfileImage

);




module.exports = router;