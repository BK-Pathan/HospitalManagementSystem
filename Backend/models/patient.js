// const mongoose = require('mongoose');

// const patientSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   age: {
//     type: Number,
//     required: true
//   },
//   gender: {
//     type: String,
//     required: true
//   },
//   contactInformation: {
//     type: String,
//     required: true
//   },
//   medicalHistory: {
//     type: String,
//     required: true
//   },
//   insuranceDetails: {
//     type: String,
//     required: true
//   }
// });

// const Patient = mongoose.model('Patient', patientSchema);

// module.exports = Patient;

const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },

    age:{
        type:Number,
        required:true
    },

    gender:{
        type:String,
        required:true
    },

    contactInformation:{
        type:String,
        required:true
    },

    medicalHistory:{
        type:String,
        required:true
    },
    DescribeYourProblem:{
      type:String,
        required:true
    },
    insuranceDetails:{
        type:String,
        required:true
    },
    profilecompleted:{
        type:Boolean,
        required:true,
        default:false
    }


},{timestamps:true});


module.exports = mongoose.model("Patient",patientSchema);