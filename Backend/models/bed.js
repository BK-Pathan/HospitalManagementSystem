const mongoose = require("mongoose");


const bedSchema = new mongoose.Schema({


    bedNumber:{
        type:String,
        required:true
    },


    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Room",
        required:true
    },


    status:{
        type:String,
        enum:[
            "available",
            "occupied"
        ],
        default:"available"
    }


},{
    timestamps:true
});


module.exports = mongoose.model("Bed",bedSchema);