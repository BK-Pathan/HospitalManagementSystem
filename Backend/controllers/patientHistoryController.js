const mongoose = require("mongoose");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const Prescription = require("../models/prescription");


exports.getPatientHistory = async(req,res)=>{

try{


const { patientId } = req.params;


// ================================
// Validate Patient ID
// ================================

if(!mongoose.Types.ObjectId.isValid(patientId)){

return res.status(400).json({

message:"Invalid patient id"

});

}



// ================================
// Logged In Doctor
// ================================

const doctor = await Doctor.findOne({

user:req.user.id

});


if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}



// ================================
// IDOR Protection
// Doctor must have appointment
// with this patient
// ================================

const hasAccess = await Appointment.findOne({

doctor:doctor._id,

patient:patientId

});


if(!hasAccess){

return res.status(403).json({

message:
"You are not authorized to view this patient's history"

});

}




// ================================
// Current Doctor Appointments
// ================================

const myAppointments = await Appointment.find({

patient:patientId,

doctor:doctor._id

})

.populate({
  path:"patient",
  populate:{
    path:"user",
    select:"name email profileImage"
  }
})

.populate({
  path:"doctor",
  populate:{
    path:"user",
    select:"name email profileImage"
  }
})

.sort({

appointmentDateTime:-1

});






// ================================
// Other Doctors History
// Completed Only
// ================================

const otherAppointments = await Appointment.find({

patient:patientId,

doctor:{
$ne:doctor._id
},

status:"completed"

})

.populate({
  path:"doctor",
  populate:{
    path:"user",
    select:"name email profileImage"
  }
})

.sort({

appointmentDateTime:-1

});







// ================================
// ALL Previous Prescriptions
// From Every Doctor
// ================================

const previousPrescriptions = await Prescription.find({

patient:patientId

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







res.status(200).json({

myAppointments,

otherAppointments,

previousPrescriptions

});



}
catch(error){


console.log(
"PATIENT HISTORY ERROR:",
error
);



res.status(500).json({

message:"Server error"

});


}

};