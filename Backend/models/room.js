const mongoose = require("mongoose");


const roomSchema = new mongoose.Schema({

    roomNumber:{
        type:String,
        required:true,
        unique:true
    },

    type:{
        type:String,
        enum:[
            "General",
            "Private",
            "Semi Private",
            "ICU",
            "Emergency"
        ],
        required:true
    },


    floor:{
        type:String,
        default:"Ground Floor"
    },


    chargesPerDay:{
        type:Number,
        default:0
    },


    status:{
        type:String,
        enum:[
            "available",
            "occupied"
        ],
        default:"available"
    },
    totalBeds:{
    type:Number,
    default:0
}


},{
    timestamps:true
});


module.exports = mongoose.model("Room",roomSchema);