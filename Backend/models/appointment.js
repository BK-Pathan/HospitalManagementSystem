const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema({

patient:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Patient",
    required:true
},

doctor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Doctor",
    required:true
},


appointmentDateTime:{
    type:Date,
    required:true
},


status:{
    type:String,
    enum:[
        "pending",
        "confirmed",
        "completed",
        "cancelled"
    ],
    default:"pending"
},
cancelReason:{
    type:String,
    default:""
}


},{timestamps:true});


module.exports = mongoose.model(
"Appointment",
appointmentSchema
);