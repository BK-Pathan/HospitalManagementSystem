const Appointment = require('../models/appointment');
const Doctor = require("../models/doctor");
// const Appointment = require("../models/appointment");
const Notification = require("../models/notification");
const Patient = require("../models/patient");

exports.getMyAppointments = async(req,res)=>{

try{


// logged in doctor ka profile find karo

const doctor = await Doctor.findOne({
    user:req.user.id
});


if(!doctor){

return res.status(404).json({
message:"Doctor profile not found"
});

}




const appointments = await Appointment.find({

doctor: doctor._id

})

.populate({

path:"patient",

populate:{
    path:"user",
    select:"name email"
}

})

.sort({

appointmentDateTime:1

});



// Remove broken patient references

const validAppointments = appointments.filter(
(item)=> item.patient !== null
);



console.log(
"Doctor Appointments:",
validAppointments
);



res.json(validAppointments);



}catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}

};

exports.updateAppointmentStatus = async(req,res)=>{


try{


const appointment = await Appointment.findById(
    req.params.id
);


if(!appointment){

return res.status(404).json({

message:"Appointment not found"

});

}



// update status

appointment.status = req.body.status;


await appointment.save();




// ===============================
// SEND NOTIFICATION TO PATIENT
// ===============================


// patient profile find

const patient = await Patient.findById(
    appointment.patient
);



if(patient){


await Notification.create({

user: patient.user,

title:
`Appointment ${req.body.status}`,

message:
`Doctor has ${req.body.status} your appointment request`,

type:"appointment"


});





// realtime notification

if(global.io){


global.io
.to(patient.user.toString())
.emit(

"notification",

{

title:
`Appointment ${req.body.status}`,

message:
`Doctor has ${req.body.status} your appointment request`

}

);


}



}




res.json({

message:"Status updated",

appointment

});



}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}


};

// ===============================
// HANDLE RESCHEDULE REQUEST
// ===============================

exports.handleReschedule = async(req,res)=>{

try{


const appointment = await Appointment.findById(
req.params.id
);



if(!appointment){

return res.status(404).json({

message:"Appointment not found"

});

}



const {
status
}=req.body;




// APPROVE RESCHEDULE

if(status==="approved"){


appointment.appointmentDateTime =
appointment.rescheduledDateTime;


appointment.rescheduleStatus =
"approved";


appointment.rescheduleRequested =
false;


}



// REJECT RESCHEDULE

if(status==="rejected"){


appointment.rescheduleStatus =
"rejected";


appointment.rescheduleRequested =
false;


}



await appointment.save();




// ===============================
// SEND NOTIFICATION TO PATIENT
// ===============================


const patient = await Patient.findById(
appointment.patient
);



if(patient){


const message =
status==="approved"
?
"Doctor approved your reschedule request"
:
"Doctor rejected your reschedule request";



await Notification.create({

user:patient.user,

title:
`Reschedule ${status}`,

message,

type:"reschedule"

});




// REAL TIME

if(global.io){


global.io
.to(patient.user.toString())
.emit(

"notification",

{

title:
`Reschedule ${status}`,

message

}

);


}


}




res.json({

message:"Reschedule updated successfully",

appointment

});


}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}


};