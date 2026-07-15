const mongoose = require("mongoose");


const doctorSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },


    name:{
        type:String,
        required:true
    },


    specialties:[{
        type:String
    }],


    qualifications:{
        type:String,
        required:true
    },


    experience:{
        type:String,
        required:true
    },


    contactInformation:{
        type:String,
        required:true
    },


    availability:[
        {
            day:{
                type:String
            },

            startTime:{
                type:String
            },

            endTime:{
                type:String
            }
        }
    ]


},{timestamps:true});



module.exports = mongoose.model(
"Doctor",
doctorSchema
);