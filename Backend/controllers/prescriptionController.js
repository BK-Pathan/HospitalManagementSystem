const Prescription = require("../models/prescription");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");




// CREATE PRESCRIPTION

exports.createPrescription = async(req,res)=>{

try{


const doctor = await Doctor.findOne({

user:req.user.id

});


if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}



const appointment = await Appointment.findById(
req.body.appointment
);



if(!appointment){

return res.status(404).json({

message:"Appointment not found"

});

}



const prescription = await Prescription.create({

patient:appointment.patient,

doctor:doctor._id,

appointment:appointment._id,

medicines:req.body.medicines,

instructions:req.body.instructions,

notes:req.body.notes

});



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









// GET MY PRESCRIPTIONS (PATIENT)

exports.getMyPrescriptions = async(req,res)=>{

try{


console.log(
"========== GET MY PRESCRIPTIONS =========="
);



const patient = await Patient.findOne({

user:req.user.id

});



if(!patient){

return res.status(404).json({

message:"Patient profile not found"

});

}




const prescriptions = await Prescription.find({

patient:patient._id

})


.populate({

path:"patient",

populate:{

path:"user",

select:"name email"

}

})


.populate({

path:"doctor",

populate:{

path:"user",

select:"name email"

}

})


.populate({

path:"appointment",

select:"appointmentDateTime status"

})


.sort({

createdAt:-1

});





console.log(
JSON.stringify(prescriptions,null,2)
);



res.json(prescriptions);



}
catch(error){


console.log(
"GET MY PRESCRIPTION ERROR:",
error
);


res.status(500).json({

message:error.message

});


}

};







// GET PATIENT PRESCRIPTIONS (DOCTOR)

exports.getPatientPrescriptions = async(req,res)=>{


try{


const prescriptions = await Prescription.find({

patient:req.params.patientId

})


.populate({

path:"patient",

populate:{

path:"user",

select:"name email"

}

})


.populate({

path:"doctor",

populate:{

path:"user",

select:"name email"

}

})


.sort({

createdAt:-1

});



res.json(prescriptions);


}
catch(error){


res.status(500).json({

message:error.message

});


}


};

