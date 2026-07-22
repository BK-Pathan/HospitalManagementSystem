const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");
const Prescription = require("../models/prescription");
const Feedback = require("../models/feedback");
const Notification = require("../models/notification");


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

try{


const {doctor, appointmentDateTime} = req.body;



// Patient check

const patient = await Patient.findOne({
    user:req.user.id
});


if(!patient){

return res.status(400).json({
message:"Please complete profile first"
});

}



// Doctor check

const doctorData = await Doctor.findById(doctor);


if(!doctorData){

return res.status(404).json({
message:"Doctor not found"
});

}




const selectedDate = new Date(appointmentDateTime);



// Get Day

const dayName = selectedDate.toLocaleDateString(
"en-US",
{
weekday:"short"
}
);



// Convert selected time

let hours = selectedDate.getHours();

let minutes = selectedDate.getMinutes();


let ampm = hours >= 12 ? "PM" : "AM";


hours = hours % 12 || 12;


const selectedTime =
`${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")} ${ampm}`;



console.log("REQUEST DAY:",dayName);
console.log("REQUEST TIME:",selectedTime);





// Convert time to minutes

const convertTimeToMinutes=(time)=>{


let [hourMinute,period] = time.trim().split(" ");


period = period.toUpperCase();


let [hour,minute] = hourMinute.split(":");


hour=parseInt(hour);
minute=parseInt(minute);



if(period==="PM" && hour!==12){

hour += 12;

}



if(period==="AM" && hour===12){

hour=0;

}



return hour*60 + minute;


};





// Check Availability


const available = doctorData.availability.some(slot=>{


console.log("DB SLOT:",slot);



const slotDay = slot.day
.trim()
.toLowerCase();



const requestDay = dayName
.trim()
.toLowerCase();




let dayMatch = false;



// Handle Mon-Fri

if(slotDay.includes("-")){


const [startDay,endDay] = slotDay.split("-");



const days = [
"sun",
"mon",
"tue",
"wed",
"thu",
"fri",
"sat"
];



const startIndex = days.indexOf(startDay);

const endIndex = days.indexOf(endDay);

const requestIndex = days.indexOf(requestDay);



dayMatch =
requestIndex >= startIndex &&
requestIndex <= endIndex;



}else{


dayMatch = slotDay === requestDay;


}





return (

dayMatch

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





if(!available){


return res.status(400).json({

message:
`Doctor is not available on ${dayName} at ${selectedTime}`

});


}





// Check already booked slot


const startTime = new Date(selectedDate);


startTime.setMinutes(
startTime.getMinutes()-30
);



const endTime = new Date(selectedDate);


endTime.setMinutes(
endTime.getMinutes()+30
);




const existingAppointment = await Appointment.findOne({

doctor:doctor,

appointmentDateTime:{

$gte:startTime,

$lte:endTime

}

});




if(existingAppointment){


return res.status(400).json({

message:"This slot is already booked"

});


}





// Create Appointment


const appointment = await Appointment.create({

patient:patient._id,

doctor:doctor,

appointmentDateTime:selectedDate,

status:"pending"

});

// ===============================
// CREATE DOCTOR NOTIFICATION
// ===============================


await Notification.create({

user: doctorData.user,

title:"New Appointment Request",

message:"You have a new appointment request from patient",

type:"appointment"

});



// ===============================
// REAL TIME NOTIFICATION
// ===============================


if(global.io){


global.io
.to(doctorData.user.toString())
.emit(
"notification",
{

title:"New Appointment Request",

message:"You have a new appointment request from patient"

}

);


}



res.status(201).json({

message:"Appointment booked successfully",

appointment

});



}catch(error){


console.log(error);


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

.populate(

"doctor",

"name specialties availability"

)

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

title:"Reschedule Request",

message:"Patient has requested to reschedule appointment",

type:"reschedule"

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


console.log(
"========== PATIENT DASHBOARD =========="
);


console.log(
"LOGIN USER FROM TOKEN:",
req.user
);



console.log(
"LOGIN USER ID:",
req.user.id
);




// Find Patient Profile

const patient = await Patient.findOne({

user:req.user.id

});



console.log(
"PATIENT PROFILE FOUND:",
patient
);




if(!patient){

return res.status(404).json({

message:"Patient profile not found"

});

}



console.log(
"PATIENT PROFILE ID:",
patient._id
);




// ===============================
// TOTAL APPOINTMENTS
// ===============================


const totalAppointments =
await Appointment.countDocuments({

patient:patient._id

});


console.log(
"TOTAL APPOINTMENTS:",
totalAppointments
);



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


console.log(
"ALL MY APPOINTMENTS:",
allAppointments
);








// ===============================
// UPCOMING APPOINTMENT
// ===============================

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


console.log(
"UPCOMING APPOINTMENTS:",
upcomingAppointments
);


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

select:"name specialties"

})
.sort({

appointmentDateTime:1

})
.limit(5);



console.log(
"UPCOMING LIST:",
upcomingAppointmentList
);

// ===============================
// COMPLETED
// ===============================


const completedAppointments =
await Appointment.countDocuments({

patient:patient._id,

status:"completed"

});



console.log(
"COMPLETED APPOINTMENTS:",
completedAppointments
);







// ===============================
// PRESCRIPTIONS
// ===============================


const prescriptions =
await Prescription.find({

patient:patient._id

});



console.log(
"MY PRESCRIPTIONS:",
prescriptions
);



const totalPrescriptions =
prescriptions.length;



console.log(
"TOTAL PRESCRIPTIONS:",
totalPrescriptions
);









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



console.log(
"DOCTORS VISITED:",
doctorsVisited
);







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



console.log(
"FINAL DASHBOARD RESPONSE:",
response
);




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


const doctor = await Doctor.findById(
req.params.id
);



if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}




const feedbacks = await Feedback.find({

doctor:doctor._id

})
.populate({

path:"patient",
select:"name"

})
.sort({

createdAt:-1

});





const averageRating =
feedbacks.length > 0
?
(
feedbacks.reduce(
(sum,item)=>sum+item.rating,
0
)
/ feedbacks.length
).toFixed(1)

:
0;




res.json({

success:true,

doctor,

averageRating,

feedbacks

});



}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}


};