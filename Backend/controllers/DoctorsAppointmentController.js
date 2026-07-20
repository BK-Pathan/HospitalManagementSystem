const Appointment = require('../models/appointment');
const Doctor = require("../models/doctor");
// const Appointment = require("../models/appointment");
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


const appointment = await Appointment.findByIdAndUpdate(

req.params.id,

{
status:req.body.status
},

{
new:true
}

);


res.json({
message:"Status updated",
appointment
});


}catch(error){

res.status(500).json({
message:error.message
});

}


};