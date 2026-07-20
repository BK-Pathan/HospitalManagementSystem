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
},

// ========================
// Reschedule
// ========================

previousDateTime:{
type:Date
},

rescheduledDateTime:{
type:Date
},

rescheduleReason:{
type:String,
default:""
},

rescheduleStatus:{
type:String,
enum:[
"pending",
"approved",
"rejected"
],
default:null
},

doctorReply:{
type:String,
default:""
},

repliedAt:{
type:Date
},
rescheduleHistory:[
{
 oldDate:{
  type:Date
 },

 newDate:{
  type:Date
 },

 reason:{
  type:String
 },

 status:{
  type:String,
  enum:[
   "approved",
   "rejected"
  ]
 },

 updatedAt:{
  type:Date,
  default:Date.now
 }

}
]

},{
timestamps:true
});

module.exports = mongoose.model(
"Appointment",
appointmentSchema
);