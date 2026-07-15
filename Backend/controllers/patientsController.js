// const Appointment = require('../models/appointment');

// // Book Appointment

// exports.bookAppointment = async(req,res)=>{


// try{


// const appointment = await Appointment.create({

//     patient:req.user.id,

//     doctor:req.body.doctor,

//     appointmentDateTime:req.body.appointmentDateTime

// });


// res.status(201).json({
//     message:"Appointment booked",
//     appointment
// });


// }catch(error){

// res.status(500).json({
// message:error.message
// });

// }


// };




// // Patient own appointments

// exports.getMyAppointments = async(req,res)=>{


// const appointments = await Appointment.find({

// patient:req.user.id

// })
// .populate("doctor","name specialties");


// res.json({
// appointments
// });


// };
const Appointment = require("../models/appointment");
const Patient = require("../models/patient");



// Book Appointment

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

message:"Appointment booked",

appointment

});



}catch(error){

res.status(500).json({

message:error.message

});

}

};





// My Appointments

exports.getMyAppointments = async(req,res)=>{


try{


const patient = await Patient.findOne({

user:req.user.id

});



const appointments = await Appointment.find({

patient:patient._id

})

.populate(
"doctor",
"name specialties"
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