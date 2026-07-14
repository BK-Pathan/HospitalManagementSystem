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


        // Password length check
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
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

exports.login = async(req,res)=>{

    try{

        const {email,password,role}=req.body;


        const user = await User.findOne({email,role});

        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }


        const match = await bcrypt.compare(password,user.password);

        if(!match){
            return res.status(400).json({
                message:"Invalid password"
            });
        }


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


        res.cookie("token", token, {
            httpOnly:true,
            secure:false,
            maxAge:86400000
        });

res.json({

    message:"Login successful",

    user:{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role
    }

});


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

}

exports.logout = (req,res)=>{

    res.clearCookie("token");

    res.json({
        message:"Logout successful"
    });

};