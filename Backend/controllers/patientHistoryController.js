const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const Prescription = require("../models/prescription");


exports.getPatientHistory = async(req,res)=>{

try{


const { patientId } = req.params;



// Logged in doctor find

const doctor = await Doctor.findOne({

user:req.user.id

});



if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}



// =====================================
// Current Doctor Appointments
// =====================================


const myAppointments = await Appointment.find({

patient:patientId,

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

appointmentDateTime:-1

});






// =====================================
// Other Doctors History
// =====================================


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

appointmentDateTime:-1

});






// =====================================
// Previous Prescription By Same Doctor
// Same Patient
// =====================================


const previousPrescriptions = await Prescription.find({

patient:patientId,

doctor:doctor._id

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

.populate({

path:"appointment",

select:"appointmentDateTime status"

})

.sort({

createdAt:-1

});






console.log(
"MY APPOINTMENTS:",
myAppointments.length
);


console.log(
"OTHER APPOINTMENTS:",
otherAppointments.length
);


console.log(
"PREVIOUS PRESCRIPTIONS:",
previousPrescriptions.length
);





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

message:error.message

});


}


};
