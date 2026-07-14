const Appointment = require('../models/appointment');

// Book Appointment

exports.bookAppointment = async(req,res)=>{


try{


const appointment = await Appointment.create({

    patient:req.user.id,

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




// Patient own appointments

exports.getMyAppointments = async(req,res)=>{


const appointments = await Appointment.find({

patient:req.user.id

})
.populate("doctor","name specialties");


res.json({
appointments
});


};