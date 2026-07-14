const jwt = require("jsonwebtoken");


const authMiddleware = (req,res,next)=>{

     console.log(req.cookies);
    const token = req.cookies.token;


    console.log("TOKEN:", token);
    if(!token){
        return res.status(401).json({
            message:"Please login first"
        });
    }


    try{

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = decoded;

        next();


    }catch(error){

        return res.status(401).json({
            message:"Invalid Token"
        });

    }

};


module.exports = authMiddleware;