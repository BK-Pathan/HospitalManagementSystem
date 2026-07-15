const Appointment = require('../models/appointment');


exports.getMyAppointments = async(req,res)=>{


try{


const doctor = await Doctor.findOne({
user:req.user.id
});


const appointments = await Appointment.find({

doctor:doctor._id

})
.populate(
"patient",
"name email"
);



res.json(appointments);



}catch(error){

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