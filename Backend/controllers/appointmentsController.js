const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const Notification = require("../models/notification");
const Patient = require("../models/patient");


// =====================================
// Patient Request Reschedule
// =====================================

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



const {newDate,newTime}=req.body;



const dateTime = new Date(
    `${newDate} ${newTime}`
);



if(isNaN(dateTime.getTime())){

return res.status(400).json({

message:"Invalid date time"

});

}



// Doctor

const doctor = await Doctor.findById(
    appointment.doctor
);



if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}




// Availability check

const requestDay = dateTime.toLocaleDateString(
    "en-US",
    {
        weekday:"short"
    }
);


const requestTime = dateTime.toLocaleTimeString(
    "en-US",
    {
        hour:"2-digit",
        minute:"2-digit",
        hour12:true
    }
);



const isDoctorAvailable = doctor.availability.some(slot=>{


if(slot.day !== requestDay){

return false;

}


const start = convertTime(slot.startTime);

const end = convertTime(slot.endTime);

const request = convertTime(requestTime);



const startMinutes =
start.hour * 60 + start.minute;


const endMinutes =
end.hour * 60 + end.minute;


const requestMinutes =
request.hour * 60 + request.minute;



return (

requestMinutes >= startMinutes &&

requestMinutes < endMinutes

);


});



if(!isDoctorAvailable){

return res.status(400).json({

message:"Doctor is not available"

});

}





// Slot check

const alreadyBooked = await Appointment.findOne({

doctor:appointment.doctor,

appointmentDateTime:dateTime,

status:{
$in:[
"pending",
"confirmed"
]
},


_id:{
$ne:appointment._id
}


});



if(alreadyBooked){

return res.status(400).json({

message:"This slot is already booked"

});

}





// Patient

const patient = await Patient.findById(
appointment.patient
)
.populate("user");





// Save reschedule request

appointment.rescheduleRequested = true;

appointment.rescheduledDateTime = dateTime;

appointment.rescheduleReason =
req.body.reason || "";

appointment.rescheduleStatus =
"pending";



appointment.rescheduleHistory.push({

oldDateTime:
appointment.appointmentDateTime,

newDateTime:
dateTime,

status:"pending",

doctorReply:""

});



await appointment.save();




// Notification to doctor

await Notification.create({

user:doctor.user,

sender:patient.user._id,

appointment:appointment._id,

type:"reschedule",

title:"Reschedule Request",

message:
`${patient.user.name} requested a reschedule`,

redirectUrl:
"/doctor/appointments"
});




// realtime

if(global.io){

global.io
.to(doctor.user.toString())
.emit(
"notification",
{

title:"Reschedule Request",

message:
`${patient.user.name} requested a reschedule`,

type:"reschedule",

appointmentId: appointment._id,

redirectUrl:"/doctor/appointments"

}

);

}



res.json({

message:"Reschedule request sent",

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





// =====================================
// Doctor Get Reschedule Requests
// =====================================

exports.getDoctorRescheduleRequests = async(req,res)=>{

try{


console.log(
"LOGIN DOCTOR:",
req.user.id
);



const doctor = await Doctor.findOne({
    user:req.user.id
});



if(!doctor){

return res.status(404).json({
message:"Doctor profile not found"
});

}



const requests = await Appointment.find({

doctor: doctor._id,

rescheduleRequested: true,

rescheduleStatus: "pending"

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

});



console.log(
"REQUESTS:",
requests
);



res.json(requests);



}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}


};






// =====================================
// Doctor Approve Reschedule
// =====================================

exports.approveReschedule = async(req,res)=>{


try{


const appointment =
await Appointment.findById(req.params.id);



if(!appointment){

return res.status(404).json({

message:"Appointment not found"

});

}




const alreadyBooked = await Appointment.findOne({

doctor:appointment.doctor,

appointmentDateTime:
appointment.rescheduledDateTime,


status:{
$in:[
"pending",
"confirmed"
]
},


_id:{
$ne:appointment._id
}

});



if(alreadyBooked){

return res.status(400).json({

message:"This slot is already booked"

});

}





appointment.appointmentDateTime =
appointment.rescheduledDateTime;


appointment.rescheduleRequested=false;


appointment.rescheduleStatus="approved";



let lastHistory =
appointment.rescheduleHistory[
appointment.rescheduleHistory.length-1
];


if(lastHistory){

lastHistory.status="approved";

}



await appointment.save();





// Get doctor + patient

const doctor = await Doctor.findById(
appointment.doctor
);



const patient = await Patient.findById(
appointment.patient
)
.populate("user");





// Notification to patient

await Notification.create({

user:patient.user._id,

sender:doctor.user,

appointment:appointment._id,

type:"reschedule",

title:"Reschedule Approved",

message:
"Doctor approved your reschedule request",

redirectUrl:
`/patient/appointments`
});





// realtime patient

if(global.io){

global.io
.to(patient.user._id.toString())
.emit(
"notification",
{

title:"Reschedule Approved",

message:
"Doctor approved your reschedule request"

}

);

}



res.json({

message:"Appointment rescheduled successfully",

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






// =====================================
// Doctor Reject Reschedule
// =====================================

exports.rejectReschedule = async(req,res)=>{


try{


const appointment =
await Appointment.findById(req.params.id);



if(!appointment){


return res.status(404).json({

message:"Appointment not found"

});


}




appointment.rescheduleRequested = false;



appointment.rescheduleStatus = "rejected";



appointment.doctorReply =
req.body.reply || "";



// update history

let lastHistory =
appointment.rescheduleHistory[
appointment.rescheduleHistory.length - 1
];


if(lastHistory){

    lastHistory.status = "rejected";

    lastHistory.doctorReply =
    req.body.reply || "";

}



await appointment.save();




res.json({

message:"Reschedule rejected"

});



}
catch(error){


res.status(500).json({

message:error.message

});


}


};

exports.getDoctorAvailability = async(req,res)=>{

try{


const doctor = await Doctor.findById(
    req.params.id
);


if(!doctor){

return res.status(404).json({
message:"Doctor not found"
});

}



// Doctor ki appointments nikalo

const bookedAppointments = await Appointment.find({

doctor:doctor._id,

status:{
    $in:[
        "pending",
        "confirmed"
    ]
}

});



let bookedTimes = bookedAppointments.map(app=>{


return new Date(
    app.appointmentDateTime
).getTime();


});





let availableSlots=[];



doctor.availability.forEach(item=>{


let start = new Date();


// day set karna
// example Mon
start.setHours(
    convertTime(item.startTime).hour,
    convertTime(item.startTime).minute,
    0
);



let end = new Date();


end.setHours(
    convertTime(item.endTime).hour,
    convertTime(item.endTime).minute,
    0
);




while(start < end){



let slotTime = new Date(start);



// check booked

let isBooked = bookedTimes.includes(
    slotTime.getTime()
);




if(!isBooked){


availableSlots.push({

date:
slotTime.toISOString().split("T")[0],


time:
slotTime.toLocaleTimeString(
"en-US",
{
hour:"2-digit",
minute:"2-digit"
}
)


});


}




// next 30 minutes

start.setMinutes(
start.getMinutes()+30
);



}



});



res.json(
availableSlots
);



}
catch(error){

console.log(error);


res.status(500).json({

message:error.message

});


}

};





function convertTime(time){


let [hourMinute,modifier] =
time.split(" ");


let [hour,minute] =
hourMinute.split(":");



hour = parseInt(hour);


if(modifier==="PM" && hour!==12){

hour +=12;

}


if(modifier==="AM" && hour===12){

hour=0;

}


return {

hour,

minute:parseInt(minute)

};


}

// =====================================
// Doctor Reschedule History
// =====================================



exports.getDoctorRescheduleHistory = async (req, res) => {

try {

    // Logged in doctor profile
    const doctor = await Doctor.findOne({
        user: req.user.id
    });

    if (!doctor) {
        return res.status(404).json({
            message: "Doctor not found"
        });
    }

    // Sirf approved/rejected reschedule history lao
    const history = await Appointment.find({

        doctor: doctor._id,

        rescheduleStatus: {
            $in: ["approved", "rejected"]
        }

    })

    .populate({

        path: "patient",

        populate: {

            path: "user",

            select: "name email"

        }

    })

    .sort({
        updatedAt: -1
    });

    console.log(
        "RESCHEDULE HISTORY:",
        JSON.stringify(history, null, 2)
    );

    res.json(history);

}
catch (error) {

    console.log(error);

    res.status(500).json({
        message: error.message
    });

}

};