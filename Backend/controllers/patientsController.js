const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Prescription = require("../models/prescription");
const Feedback = require("../models/feedback");
const Notification = require("../models/notification");

const { createAdminNotification } = require("../utils/sendNotification");


// ===============================
// Get All Doctors
// ===============================

exports.getDoctors = async(req,res)=>{


try{


const doctors = await Doctor.find();



res.json(doctors);



}catch(error){


res.status(500).json({

message:error.message

});


}


};






// ===============================
// Get Single Doctor
// ===============================

exports.getDoctorById = async(req,res)=>{


try{


const doctor = await Doctor.findById(
req.params.id
).populate(
"user",
"name email profileImage"
);



if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}



res.json(doctor);



}catch(error){


res.status(500).json({

message:error.message

});


}


};







// ===============================
// Book Appointment
// ===============================

exports.bookAppointment = async(req,res)=>{

console.log("🔥 BOOK APPOINTMENT API HIT");

try{


console.log("REQUEST BODY:", req.body);
console.log("REQUEST USER:", req.user);


const {doctor, appointmentDateTime} = req.body;


if(!doctor || !appointmentDateTime){

return res.status(400).json({
message:"Doctor and appointment time are required"
});

}


// ===============================
// Patient Check
// ===============================

console.log("Checking patient...");


const patient = await Patient.findOne({
    user:req.user.id
})
.populate({
    path:"user",
    select:"name email profileImage"
});


console.log("PATIENT:", patient);


if(!patient){

return res.status(400).json({
message:"Please complete profile first"
});

}


// ===============================
// Doctor Check
// ===============================

console.log("Checking doctor...");


const doctorData = await Doctor.findById(doctor);


console.log("DOCTOR:", doctorData);


if(!doctorData){

return res.status(404).json({
message:"Doctor not found"
});

}



// ===============================
// Date Convert
// ===============================


const selectedDate = new Date(appointmentDateTime);


console.log(
"SELECTED DATE:",
selectedDate
);


if(isNaN(selectedDate)){

return res.status(400).json({
message:"Invalid appointment date"
});

}



// ===============================
// Get Day
// ===============================


const dayName = selectedDate.toLocaleDateString(
"en-US",
{
weekday:"short"
}
);


console.log(
"DAY:",
dayName
);



// ===============================
// Get Time
// ===============================


let hours = selectedDate.getHours();

let minutes = selectedDate.getMinutes();


let ampm = hours >= 12 ? "PM" : "AM";


hours = hours % 12 || 12;


const selectedTime =
`${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")} ${ampm}`;



console.log(
"TIME:",
selectedTime
);




// ===============================
// Convert Time
// ===============================


const convertTimeToMinutes=(time)=>{


let [hourMinute,period] = time.trim().split(" ");


let [hour,minute] = hourMinute.split(":");


hour=parseInt(hour);
minute=parseInt(minute);



if(period==="PM" && hour!==12){

hour+=12;

}


if(period==="AM" && hour===12){

hour=0;

}


return hour*60 + minute;


};




// ===============================
// Availability Check
// ===============================


console.log(
"DOCTOR AVAILABILITY:",
doctorData.availability
);



const available = doctorData.availability.some(slot=>{


const slotDay =
slot.day.trim().toLowerCase();


const requestDay =
dayName.trim().toLowerCase();



return (

slotDay === requestDay

&&

convertTimeToMinutes(selectedTime)
>=
convertTimeToMinutes(slot.startTime)


&&

convertTimeToMinutes(selectedTime)
<=
convertTimeToMinutes(slot.endTime)

);


});



console.log(
"AVAILABLE:",
available
);



if(!available){


return res.status(400).json({

message:
`Doctor is not available on ${dayName} at ${selectedTime}`

});


}





// ===============================
// Already Booked Check
// ===============================


const existingAppointment =
await Appointment.findOne({

doctor:doctor,

appointmentDateTime:selectedDate

});



console.log(
"EXISTING:",
existingAppointment
);



if(existingAppointment){


return res.status(400).json({

message:"This slot is already booked"

});


}




// ===============================
// Create Appointment
// ===============================


console.log("Creating appointment...");


const appointment = await Appointment.create({

patient:patient._id,

doctor:doctor,

appointmentDateTime:selectedDate,

status:"pending"

});



console.log(
"APPOINTMENT CREATED:",
appointment
);




// ===============================
// Notifications
// ===============================


await createAdminNotification({

title:"New Appointment Request",

message:
`${patient.user.name} booked an appointment with Dr. ${doctorData.name}`,

type:"appointment",

appointment:appointment._id

});


if(doctorData.user){


const notification = await Notification.create({

user:doctorData.user._id,

sender:req.user.id,

appointment:appointment._id,

type:"appointment",

title:"New Appointment Request",

message:
`${patient.user.name} requested an appointment`,

redirectUrl:
`/doctor/appointments/${appointment._id}`

});



// ===============================
// REAL TIME SOCKET NOTIFICATION
// ===============================

if(global.io){


global.io
.to(
doctorData.user._id.toString()
)
.emit(
"notification",
{

title:"New Appointment Request",

message:
`${patient.user.name} requested an appointment`,

type:"appointment",

redirectUrl:
`/doctor/appointments/${appointment._id}`

}

);


console.log(
"Doctor notification emitted:",
doctorData.user._id.toString()
);


}



}




res.status(201).json({

message:"Appointment booked successfully",

appointment

});



}
catch(error){


console.log(
"BOOK APPOINTMENT ERROR:",
error
);


res.status(500).json({

message:error.message

});


}


};





// ===============================
// Patient Own Appointments
// ===============================

exports.getMyAppointments = async(req,res)=>{


try{


const patient = await Patient.findOne({

user:req.user.id

});



if(!patient){

return res.status(400).json({

message:"Profile not found"

});

}



const appointments = await Appointment.find({
    patient:patient._id
})
.populate({
    path:"doctor",
    select:"name department specialties availability user",
    populate:{
        path:"user",
        select:"profileImage name"
    }
})
.populate(
    "patient",
    "name email"
);





res.json({

appointments

});





}catch(error){


res.status(500).json({

message:error.message

});


}


};


exports.dashboardStatsOLD = async(req,res)=>{

try{

const doctors = await Doctor.countDocuments();


const patient = await Patient.findOne({
    user:req.user.id
});


if(!patient){

return res.status(400).json({
    message:"Profile not found"
});

}


const appointments = await Appointment.countDocuments({

    patient:patient._id

});


res.json({

    doctors,
    appointments

});


}catch(error){


res.status(500).json({

message:error.message

});


}

};

// ======================
// Patient Request Reschedule
// ======================

exports.requestReschedule = async(req,res)=>{

try{


const appointment = await Appointment.findById(
req.params.id
);


if(!appointment){

return res.status(404).json({

message:"Appointment not found"

});

}



// find patient profile

const patient = await Patient.findOne({

user:req.user.id

});



if(!patient){

return res.status(404).json({

message:"Patient profile not found"

});

}



// ownership check

if(
appointment.patient.toString() !== patient._id.toString()
){

return res.status(403).json({

message:"Not allowed"

});

}




appointment.rescheduleRequested = true;


appointment.rescheduleReason =
req.body.rescheduleReason;



appointment.rescheduledDateTime =
req.body.rescheduledDateTime;



appointment.rescheduleStatus =
"pending";



await appointment.save();

// ===============================
// SEND RESCHEDULE REQUEST TO DOCTOR
// ===============================


const doctorData = await Doctor.findById(
    appointment.doctor
);


if(doctorData){

await Notification.create({

user: doctorData.user,

sender:req.user.id,

appointment:appointment._id,

title:"Reschedule Request",

message:
`${patient.user.name} requested a reschedule`,

type:"reschedule",

redirectUrl:
`/doctor/appointments/${appointment._id}`

});




// realtime

if(global.io){

global.io
.to(doctorData.user.toString())
.emit(
"notification",
{

title:"Reschedule Request",

message:"Patient has requested to reschedule appointment"

}

);

}


}

res.json({

message:"Reschedule request sent successfully",

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
// PATIENT DASHBOARD
// ===============================

exports.getPatientDashboard = async(req,res)=>{

try{


// console.log(
// "========== PATIENT DASHBOARD =========="
// );


// console.log(
// "LOGIN USER FROM TOKEN:",
// req.user
// );



// console.log(
// "LOGIN USER ID:",
// req.user.id
// );




// Find Patient Profile

const patient = await Patient.findOne({

user:req.user.id

});



// console.log(
// "PATIENT PROFILE FOUND:",
// patient
// );




if(!patient){

return res.status(404).json({

message:"Patient profile not found"

});

}



// console.log(
// "PATIENT PROFILE ID:",
// patient._id
// );




// ===============================
// TOTAL APPOINTMENTS
// ===============================


const totalAppointments =
await Appointment.countDocuments({

patient:patient._id

});


// console.log(
// "TOTAL APPOINTMENTS:",
// totalAppointments
// );



// ===============================
// PENDING APPOINTMENTS
// ===============================

const pendingAppointments =
await Appointment.countDocuments({

patient:patient._id,

appointmentDateTime:{
    $gte:new Date()
},

$or:[
    {
        status:"pending"
    },
    {
        status:{
            $exists:false
        }
    }
]

});


// ===============================
// ALL APPOINTMENTS CHECK
// ===============================


const allAppointments = await Appointment.find({

patient:patient._id

});


// console.log(
// "ALL MY APPOINTMENTS:",
// allAppointments
// );




// ===============================
// UPCOMING APPOINTMENTS COUNT
// ===============================

const upcomingAppointments =
await Appointment.countDocuments({

patient:patient._id,

appointmentDateTime:{
    $gte:new Date()
},

status:{
    $nin:[
        "completed",
        "cancelled"
    ]
}

});


// console.log(
// "UPCOMING APPOINTMENTS:",
// upcomingAppointments
// );


// ===============================
// UPCOMING APPOINTMENTS LIST
// ===============================

const upcomingAppointmentList = await Appointment.find({

patient:patient._id,

appointmentDateTime:{
    $gte:new Date()
},

status:{
    $nin:[
        "completed",
        "cancelled"
    ]
}

})
.populate({

path:"doctor",

select:"name department specialties user",

populate:{
    path:"user",
    select:"name profileImage"
}

})
.sort({

appointmentDateTime:1

})
.limit(5);


// console.log(
// "UPCOMING LIST:",
// upcomingAppointmentList
// );

// ===============================
// COMPLETED
// ===============================


const completedAppointments =
await Appointment.countDocuments({

patient:patient._id,

status:"completed"

});



// console.log(
// "COMPLETED APPOINTMENTS:",
// completedAppointments
// );







// ===============================
// PRESCRIPTIONS
// ===============================


const prescriptions =
await Prescription.find({

patient:patient._id

});



// console.log(
// "MY PRESCRIPTIONS:",
// prescriptions
// );



const totalPrescriptions =
prescriptions.length;



// console.log(
// "TOTAL PRESCRIPTIONS:",
// totalPrescriptions
// );









// ===============================
// DOCTORS VISITED
// ===============================


const doctorsVisited =
await Appointment.distinct(

"doctor",

{

patient:patient._id,

status:"completed"

}

);



// console.log(
// "DOCTORS VISITED:",
// doctorsVisited
// );







// ===============================
// FEEDBACK
// ===============================


// const latestFeedback =
// await Feedback.findOne({

// patient:patient._id

// })

// .populate({

// path:"doctor",

// select:"name"

// })

// .sort({

// createdAt:-1

// });



// console.log(
// "LATEST FEEDBACK:",
// latestFeedback
// );







// FINAL RESPONSE


const response = {

totalAppointments,

pendingAppointments,

completedAppointments,

totalPrescriptions,

doctorsVisited:doctorsVisited.length,

upcomingAppointments,
upcomingAppointmentList

// latestFeedback

};



// console.log(
// "FINAL DASHBOARD RESPONSE:",
// response
// );




res.json({

success:true,

data:response

});



}
catch(error){


console.log(
"PATIENT DASHBOARD ERROR:",
error
);


res.status(500).json({

message:error.message

});


}


};



// ===============================
// PATIENT VIEW DOCTOR PROFILE
// ===============================

exports.getDoctorProfileForPatient = async(req,res)=>{

try{


const doctor = await Doctor.findById(req.params.id)
.populate(
    "user",
    "name email profileImage"
);



if(!doctor){

return res.status(404).json({
message:"Doctor not found"
});

}



// ===============================
// Related Doctors Same Department
// ===============================

const relatedDoctors = await Doctor.find({

department: doctor.department,

_id:{
$ne:doctor._id
}

})
.populate(
"user",
"name profileImage"
)
.limit(5);




const feedbacks = await Feedback.find({

doctor:doctor._id

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




const averageRating =
feedbacks.length > 0
?
(
feedbacks.reduce(
(sum,item)=>sum + item.rating,
0
)
/
feedbacks.length
).toFixed(1)
:
0;




res.json({

success:true,


doctor:{

_id:doctor._id,

name:doctor.name,

department:doctor.department,

specialties:doctor.specialties,

qualifications:doctor.qualifications,

experience:doctor.experience,

contactInformation:doctor.contactInformation,

availability:doctor.availability,

profileImage:doctor.user?.profileImage || "",

email:doctor.user?.email || ""

},


averageRating,

feedbacks,


relatedDoctors: relatedDoctors.map((doc)=>({

_id:doc._id,

name:doc.name,

department:doc.department,

specialties:doc.specialties,

experience:doc.experience,

profileImage:doc.user?.profileImage || ""

}))


});


}
catch(error){

console.log(error);

res.status(500).json({
message:error.message
});

}

};