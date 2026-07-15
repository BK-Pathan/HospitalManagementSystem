// const Doctor = require('../models/doctor');
// const Appointment = require('../models/appointment');

// exports.getAllDoctors = async (req, res) => {
//   try {
//     const doctors = await Doctor.find();
//     res.json(doctors);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getDoctorById = async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.id);
//     if (!doctor) {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }
//     res.json(doctor);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.createDoctor = async (req, res) => {
//   try {
//     const doctor = await Doctor.create(req.body);
//     res.status(201).json({ message: 'Doctor created', doctor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.updateDoctor = async (req, res) => {
//   try {
//     const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!doctor) {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }
//     res.json({ message: 'Doctor updated', doctor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.deleteDoctor = async (req, res) => {
//   try {
//     const doctor = await Doctor.findByIdAndDelete(req.params.id);
//     if (!doctor) {
//       return res.status(404).json({ message: 'Doctor not found' });
//     }
//     res.json({ message: 'Doctor deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getMyAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ doctor: req.user.id }).populate('patient', 'name');
//     res.json({ appointments });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const Doctor = require("../models/doctor");
const Appointment = require("../models/appointment");


// Create Profile
exports.createProfile = async(req,res)=>{

try{


const doctor = await Doctor.findOneAndUpdate(

{
    user:req.user.id
},

{

    user:req.user.id,
    name:req.body.name,
    specialties:req.body.specialties,
    qualifications:req.body.qualifications,
    experience:req.body.experience,
    contactInformation:req.body.contactInformation,
    availability:req.body.availability

},

{
    new:true,
    upsert:true
}


);


res.json({
message:"Doctor profile saved",
doctor
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};




// Get Profile
exports.getProfile = async(req,res)=>{

try{

const doctor = await Doctor.findOne({
user:req.user.id
});


res.json(doctor);


}catch(error){

res.status(500).json({
message:error.message
});

}

};




// Get My Appointments
exports.getMyAppointments = async(req,res)=>{

try{

const appointments = await Appointment.find({
doctor:req.user.id
})
.populate("patient","name email");


res.json({
appointments
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};
// Doctor Dashboard Stats

exports.dashboardStats = async(req,res)=>{

try{


const doctor = await Doctor.findOne({
user:req.user.id
});


const totalPatients = await Appointment.distinct(
"patient",
{
doctor:doctor._id
}
);



const pending = await Appointment.countDocuments({

doctor:doctor._id,
status:"pending"

});


const confirmed = await Appointment.countDocuments({

doctor:doctor._id,
status:"confirmed"

});


const completed = await Appointment.countDocuments({

doctor:doctor._id,
status:"completed"

});



res.json({

patients:totalPatients.length,

pending,

confirmed,

completed

});


}
catch(error){

res.status(500).json({
message:error.message
});

}


};

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
exports.getAvailableDoctors = async(req,res)=>{

try{


const doctors = await Doctor.find()
.select(
"name specialties qualifications experience contactInformation availability"
);


res.json(doctors);



}catch(error){


res.status(500).json({

message:error.message

});


}


};

// Get Single Doctor

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