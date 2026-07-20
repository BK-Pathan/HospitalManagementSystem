const Appointment = require("../models/appointment");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");

exports.getPatientHistory = async(req,res)=>{

try{


const {patientId}=req.params;



const doctor = await Doctor.findOne({
    user:req.user.id
});



if(!doctor){

return res.status(404).json({
message:"Doctor not found"
});

}



// current doctor appointments

const myAppointments = await Appointment.find({

patient:patientId,
doctor:doctor._id

})
.populate({
path:"patient",
populate:{
path:"user",
select:"name email"
}
})
.populate(
"doctor"
)
.sort({
appointmentDateTime:-1
});






// other doctors appointments

const otherAppointments = await Appointment.find({

patient:patientId,

doctor:{
$ne:doctor._id
},

status:"completed"

})
.populate("doctor")
.populate({
path:"patient",
populate:{
path:"user",
select:"name email"
}
})
.sort({
appointmentDateTime:-1
});




res.json({

myAppointments,

otherAppointments

});




}catch(error){

console.log(error);

res.status(500).json({
message:error.message
});


}

};