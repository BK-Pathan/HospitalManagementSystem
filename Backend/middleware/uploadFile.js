const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");


const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {

        folder: "hospital_profiles",

        allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "webp"
        ],

        public_id: (req, file) => {

            return `profile_${Date.now()}`;

        }

    }

});



const upload = multer({

    storage: storage,


    limits: {

        fileSize: 2 * 1024 * 1024 // 2MB

    },


    fileFilter: (req, file, cb) => {


        const allowedTypes = [

            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"

        ];



        if(allowedTypes.includes(file.mimetype)){

            cb(null,true);

        }
        else{

            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
                ),
                false
            );

        }


    }


});


module.exports = upload;