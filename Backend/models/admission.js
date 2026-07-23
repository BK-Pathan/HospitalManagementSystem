const mongoose = require("mongoose");


const admissionSchema = new mongoose.Schema({


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


    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true
    },


    bed:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bed",
        required:true
    },


    reason:{
        type:String,
        required:true
    },


    admissionDate:{
        type:Date,
        default:Date.now
    },


    dischargeDate:{
        type:Date
    },


    status:{
        type:String,
        enum:[
            "admitted",
            "discharged"
        ],
        default:"admitted"
    }


},{
    timestamps:true
});


module.exports = mongoose.model("Admission",admissionSchema);