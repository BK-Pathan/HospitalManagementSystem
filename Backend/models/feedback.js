const mongoose = require("mongoose");


const feedbackSchema = new mongoose.Schema({

    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },


    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        required:true
    },


    appointment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true
    },


    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },


    comment:{
        type:String,
        required:true
    }


},{
    timestamps:true
});


module.exports = mongoose.model(
"Feedback",
feedbackSchema
);