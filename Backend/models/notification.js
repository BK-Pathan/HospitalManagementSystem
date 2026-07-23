const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },


    title:{
        type:String,
        required:true
    },


    message:{
        type:String,
        required:true
    },


    type:{
        type:String,
        enum:[
            "appointment",
            "prescription",
            "reschedule",
            "system"
        ],
        default:"system"
    },


    isRead:{
        type:Boolean,
        default:false
    },
    sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},


appointment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Appointment"
},


redirectUrl:{
    type:String
}


},
{
    timestamps:true
});


module.exports = mongoose.model(
    "Notification",
    notificationSchema
);