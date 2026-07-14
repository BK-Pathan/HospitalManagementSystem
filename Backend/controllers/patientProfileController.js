const Patient = require("../models/patient");


// create profile

exports.createProfile = async(req,res)=>{

try{


const patient = await Patient.create({

    name:req.body.name,
    age:req.body.age,
    gender:req.body.gender,
    contactInformation:req.body.contactInformation,
    medicalHistory:req.body.medicalHistory,
    insuranceDetails:req.body.insuranceDetails

});


res.status(201).json({

message:"Profile created",
patient

});


}catch(error){

res.status(500).json({
message:error.message
});

}


};