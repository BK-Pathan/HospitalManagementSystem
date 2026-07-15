// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const appointmentSchema = new Schema({
//   doctor: {
//     type: String,
//     ref: 'Doctor',
//     required: true
//   },
//   patient: {
//     type: String,
//     ref: 'Patient',
//     required: true
//   },
//   appointmentDateTime: {
//     type: Date,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'confirmed', 'canceled'],
//     default: 'pending'
//   }
// });

// const Appointment = mongoose.model('Appointment', appointmentSchema);

// module.exports = Appointment;
const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema({

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


    appointmentDateTime:{
        type:Date,
        required:true
    },


    status:{
        type:String,
        enum:[
            "pending",
            "confirmed",
            "cancelled"
        ],
        default:"pending"
    }


},{timestamps:true});



module.exports = mongoose.model(
    "Appointment",
    appointmentSchema
);