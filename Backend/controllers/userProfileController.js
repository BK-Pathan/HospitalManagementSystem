const User = require("../models/user");
const cloudinary = require("../config/cloudinary");



// Upload / Replace Image

exports.uploadProfileImage = async(req,res)=>{

try{


const userId = req.user.id;



if(!req.file){

return res.status(400).json({

message:"Image required"

});

}



const user = await User.findById(userId);



if(!user){

return res.status(404).json({

message:"User not found"

});

}




// Delete Old Image

if(user.profileImagePublicId){

await cloudinary.uploader.destroy(
    user.profileImagePublicId
);

}




// Save New Image

user.profileImage = req.file.path;

user.profileImagePublicId = req.file.filename;



await user.save();



res.status(200).json({

message:"Profile image updated successfully",

image:user.profileImage

});



}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}


};







// Remove Image

exports.removeProfileImage = async(req,res)=>{


try{


const user = await User.findById(
    req.user.id
);



if(!user){

return res.status(404).json({

message:"User not found"

});

}





if(user.profileImagePublicId){


await cloudinary.uploader.destroy(

user.profileImagePublicId

);


}





user.profileImage = "";

user.profileImagePublicId = "";



await user.save();



res.json({

message:"Profile image removed successfully"

});



}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}


};