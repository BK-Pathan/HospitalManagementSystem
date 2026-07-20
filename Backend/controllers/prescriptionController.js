const Prescription = require("../models/prescription");
const Doctor = require("../models/doctor");




// CREATE PRESCRIPTION


exports.createPrescription = async(req,res)=>{


try{


console.log(
"========== CREATE PRESCRIPTION =========="
);



console.log(
"Logged User:",
req.user
);



console.log(
"Request Body:",
req.body
);





const doctor = await Doctor.findOne({

user:req.user.id

});



console.log(
"Doctor Found:",
doctor
);




if(!doctor){


return res.status(404).json({

message:"Doctor not found"

});


}





const prescription = await Prescription.create({


patient:req.body.patient,


doctor:doctor._id,


appointment:req.body.appointment,


medicines:req.body.medicines,


instructions:req.body.instructions,


notes:req.body.notes


});





console.log(
"Created Prescription:",
prescription
);





res.status(201).json({

message:"Prescription created successfully",

prescription

});



}
catch(error){


console.log(
"CREATE PRESCRIPTION ERROR:",
error
);



res.status(500).json({

message:error.message

});


}


};







// GET PRESCRIPTIONS


exports.getPatientPrescriptions = async(req,res)=>{


try{


console.log(
"========== GET PRESCRIPTIONS =========="
);



console.log(
"Patient ID:",
req.params.patientId
);



const prescriptions = await Prescription.find({

patient:req.params.patientId

})

.populate({

path:"doctor",

populate:{

path:"user",

select:"name email"

}

})

.populate({

path:"patient",

populate:{

path:"user",

select:"name email"

}

})


.sort({

createdAt:-1

});




console.log(
"Prescriptions Found:",
prescriptions
);



res.json(prescriptions);



}
catch(error){


console.log(
"GET PRESCRIPTION ERROR:",
error
);



res.status(500).json({

message:error.message

});


}


};