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



const patient = await Patient.findOne({

user:req.user.id

});



if(!patient){


return res.status(400).json({

message:"Please complete profile first"

});


}




const appointment = await Appointment.create({


patient:patient._id,


doctor:req.body.doctor,


appointmentDateTime:req.body.appointmentDateTime


});





res.status(201).json({

message:"Appointment booked successfully",


appointment


});





}catch(error){


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

// Patient Dashboard Stats

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