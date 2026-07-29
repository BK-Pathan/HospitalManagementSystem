const Prescription = require("../models/prescription");
const Doctor = require("../models/doctor");
const Patient = require("../models/patient");
const Appointment = require("../models/appointment");
const Notification = require("../models/notification");
const xss = require("xss");
const validator = require("validator");



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




const {
appointment,
medicines,
instructions,
notes

}=req.body;




// ======================
// Required Validation
// ======================

if(
!appointment ||
!medicines
){

return res.status(400).json({

message:"Appointment and medicines are required"

});

}





// ======================
// Sanitize Input
// ======================


const cleanMedicines = Array.isArray(medicines)

?

medicines.map(item=>({

name:xss(item.name || ""),

dosage:xss(item.dosage || ""),

duration:xss(item.duration || "")

}))

:

[];




const cleanInstructions =
instructions
?
xss(instructions)
:
"";



const cleanNotes =
notes
?
xss(notes)
:
"";






// ======================
// Check Appointment
// ======================


const appointmentData =
await Appointment.findById(appointment);



if(!appointmentData){

return res.status(404).json({

message:"Appointment not found"

});

}




// ======================
// Authorization Check
// Doctor only own appointment
// ======================


if(
appointmentData.doctor.toString()
!== doctor._id.toString()

){

return res.status(403).json({

message:"You cannot create prescription for this appointment"

});

}





const prescription = await Prescription.create({

patient:appointmentData.patient,

doctor:doctor._id,

appointment:appointmentData._id,

medicines:cleanMedicines,

instructions:cleanInstructions,

notes:cleanNotes

});






// Notification

const patient = await Patient.findById(
appointmentData.patient
)
.populate("user");



const doctorData = await Doctor.findById(
doctor._id
)
.populate("user");




if(patient?.user && doctorData?.user){



await Notification.create({

user:patient.user._id,

sender:req.user.id,

appointment:appointmentData._id,

type:"prescription",

title:"New Prescription Added",

message:
`Dr. ${doctorData.user.name} added a new prescription for you`,

redirectUrl:"/patient/prescriptions"

});




if(global.io){


global.io
.to(
patient.user._id.toString()
)
.emit(
"notification",
{

title:"New Prescription Added",

message:
`Dr. ${doctorData.user.name} added a new prescription for you`,

type:"prescription",

redirectUrl:"/patient/prescriptions"

}

);


}


}





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


const doctor = await Doctor.findOne({

user:req.user.id

});


if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}



const prescriptions = await Prescription.find({

patient:req.params.patientId,

doctor:doctor._id

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


exports.getPatientAllPrescriptions = async(req,res)=>{

try{


const patient = await Patient.findOne({

user:req.user.id

});


if(!patient){

return res.status(404).json({

message:"Patient not found"

});

}



const prescriptions = await Prescription.find({

patient:patient._id

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



res.json(prescriptions);



}
catch(error){

res.status(500).json({

message:error.message

});

}


};