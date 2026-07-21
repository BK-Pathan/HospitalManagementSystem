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
rescheduleStatus:{
    type:String,
    enum:[
        "pending",
        "approved",
        "rejected"
    ],
    default:"pending"
},

rescheduledDateTime:{
    type:Date
},

rescheduleRequested:{
    type:Boolean,
    default:false
},

rescheduleHistory:[
{
    oldDateTime:{
        type:Date
    },

    newDateTime:{
        type:Date
    },

    status:{
        type:String,
        enum:[
            "pending",
            "approved",
            "rejected"
        ]
    },

    doctorReply:{
        type:String,
        default:""
    },

    createdAt:{
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