const Doctor = require("../models/doctor");


exports.getAllDoctors = async(req,res)=>{

const doctors = await Doctor.find()
.sort({
experience:-1
});

res.json(doctors);

};