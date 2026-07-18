const Feedback = require("../models/feedback");
const Patient = require("../models/patient");


exports.createFeedback = async(req,res)=>{

try{


const patient = await Patient.findOne({
    user:req.user.id
});


if(!patient){

return res.status(404).json({
message:"Patient profile not found"
});

}



const feedback = await Feedback.create({

doctor:req.body.doctor,

patient:patient._id,

appointment:req.body.appointment,

rating:req.body.rating,

comment:req.body.comment

});



res.status(201).json({

message:"Feedback submitted successfully",

feedback

});


}
catch(error){

console.log(error);

res.status(500).json({

message:error.message

});

}


};