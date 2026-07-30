const User = require('../models/user')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        // Required fields check
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        // Email format check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format"
            });
        }

      // Password Security Check

if(password.length < 8){

    return res.status(400).json({
        message:"Password must be at least 8 characters"
    });

}


// Uppercase check

if(!/[A-Z]/.test(password)){

    return res.status(400).json({
        message:"Password must contain at least one uppercase letter"
    });

}


// Lowercase check

if(!/[a-z]/.test(password)){

    return res.status(400).json({
        message:"Password must contain at least one lowercase letter"
    });

}


// Number check

if(!/[0-9]/.test(password)){

    return res.status(400).json({
        message:"Password must contain at least one number"
    });

}


        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }


        // Role validation
        const allowedRoles = ["patient", "doctor", "admin"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });


        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });


    } catch (error) {


        // MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }


        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }

};

exports.login = async (req, res) => {

try {


// console.log("LOGIN BODY:", req.body);



let {
email,
password,
role
}=req.body;



// ==========================
// Prevent Mongo Injection
// ==========================

if(
typeof email !== "string" ||
typeof password !== "string" ||
typeof role !== "string"
){

return res.status(400).json({

message:"Invalid input"

});

}


// Detect Mongo operators inside string

if(
email.includes("$") ||
email.includes("{") ||
email.includes("}") ||
password.includes("$") ||
password.includes("{") ||
password.includes("}")
){

return res.status(400).json({

message:"Invalid characters"

});

}




email = email
.trim()
.toLowerCase();




// ==========================
// Email Validation
// ==========================

const emailRegex =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;


if(!emailRegex.test(email)){


return res.status(400).json({

message:"Invalid email format"

});


}





// ==========================
// Role Validation
// ==========================

const allowedRoles=[
"patient",
"doctor",
"admin"
];


if(!allowedRoles.includes(role)){


return res.status(400).json({

message:"Invalid role"

});

}




// ==========================
// Find User
// ==========================

const user = await User.findOne({

email:email

});



if(!user){


return res.status(401).json({

message:"Invalid credentials"

});


}




// ==========================
// Role Check
// ==========================

if(user.role !== role){


return res.status(401).json({

message:"Invalid credentials"

});

}




// ==========================
// Password
// ==========================

const match =
await bcrypt.compare(
password,
user.password
);



if(!match){


return res.status(401).json({

message:"Invalid credentials"

});


}





// ==========================
// JWT
// ==========================

const token = jwt.sign(

{
id:user._id,
role:user.role
},

process.env.JWT_SECRET,

{
expiresIn:"1d"
}

);





res.cookie(
"token",
token,
{

httpOnly:true,

secure:false,

sameSite:"strict",

maxAge:86400000

}

);





res.status(200).json({

message:"Login successful",

user:{

id:user._id,

name:user.name,

email:user.email,

role:user.role

}

});



}
catch(error){

console.log(
"LOGIN ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}


};

exports.logout = (req,res)=>{

    res.clearCookie("token");

    res.json({
        message:"Logout successful"
    });

};


// Get Logged In User Profile

exports.getProfile = async(req,res)=>{

try{

const user = await User.findById(req.user.id)
.select("-password");


res.status(200).json(user);


}catch(error){

res.status(500).json({
message:error.message
});

}

};




// Update Profile

exports.updateProfile = async(req,res)=>{

try{


const user = await User.findByIdAndUpdate(

req.user.id,

{
name:req.body.name,
email:req.body.email
},

{
new:true
}

)
.select("-password");



res.status(200).json({

message:"Profile Updated",

user

});


}catch(error){

res.status(500).json({
message:error.message
});

}

};  


// Change Password

exports.changePassword = async(req,res)=>{

try{


const {
oldPassword,
newPassword
}=req.body;



// Find user

const user = await User.findById(req.user.id);



if(!user){

return res.status(404).json({

message:"User not found"

});

}




// Check old password

const match = await bcrypt.compare(
oldPassword,
user.password
);



if(!match){

return res.status(400).json({

message:"Old password is incorrect"

});

}




// Password validation

if(newPassword.length < 8){

return res.status(400).json({

message:"Password must be at least 8 characters"

});

}


if(!/[A-Z]/.test(newPassword)){

return res.status(400).json({

message:"Password must contain uppercase letter"

});

}


if(!/[a-z]/.test(newPassword)){

return res.status(400).json({

message:"Password must contain lowercase letter"

});

}


if(!/[0-9]/.test(newPassword)){

return res.status(400).json({

message:"Password must contain number"

});

}




// Hash new password

const hashedPassword = await bcrypt.hash(
newPassword,
10
);



// Update DB

user.password = hashedPassword;


await user.save();



res.status(200).json({

message:"Password changed successfully"

});



}
catch(error){

window.notify(
"CHANGE PASSWORD ERROR:",
error
);


res.status(500).json({

message:"Server error"

});


}


};