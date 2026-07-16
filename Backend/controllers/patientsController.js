const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");




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

appointmentDateTime:selectedDate

});





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

exports.dashboardStats = async(req,res)=>{

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