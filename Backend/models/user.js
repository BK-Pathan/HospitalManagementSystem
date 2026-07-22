const mongoose = require('mongoose');
const { Schema} = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
     password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["admin","doctor","patient"],
        default:"patient"
    },
profileImage:{
 type:String,
 default:""
},


profileImagePublicId:{
    type:String,
    default:""
}


}, { timestamps: true });

const User = mongoose.model('User' ,userSchema)

module.exports=User;