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
doctor:req.user.id,

})
.populate("patient","name email");


res.json({
appointments
});
console.log("kam ka ni ha")


}catch(error){

res.status(500).json({
message:error.message
});

}

};
// Doctor Dashboard Stats



exports.dashboardStats = async (req, res) => {
  try {

    console.log("========== DOCTOR DASHBOARD ==========");
    console.log("Logged User:", req.user);

    // Find doctor profile
    const doctor = await Doctor.findOne({
      user: req.user.id
    });

    console.log("Doctor Profile:", doctor);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor profile not found"
      });
    }

    // Check appointments
    const allAppointments = await Appointment.find({
      doctor: doctor._id
    });

    console.log("Appointments Found:", allAppointments.length);
    console.log(allAppointments);

    // Dashboard Stats
    const totalAppointments = allAppointments.length;

    const totalPatients = await Appointment.distinct("patient", {
      doctor: doctor._id
    });

    const pending = await Appointment.countDocuments({
      doctor: doctor._id,
      status: "pending"
    });

    const confirmed = await Appointment.countDocuments({
      doctor: doctor._id,
      status: "confirmed"
    });

    const completed = await Appointment.countDocuments({
      doctor: doctor._id,
      status: "completed"
    });

    const cancelled = await Appointment.countDocuments({
      doctor: doctor._id,
      status: "cancelled"
    });

    // Recent Appointments
    const recentAppointments = await Appointment.find({
      doctor: doctor._id
    })
      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email"
        }
      })
      .sort({ createdAt: -1 })
      .limit(5);

    console.log("Recent Appointments:", recentAppointments);

    res.json({
      patients: totalPatients.length,
      appointments: totalAppointments,
      pending,
      confirmed,
      completed,
      cancelled,
      recentAppointments
    });

  } catch (error) {

    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};

// exports.getMyAppointments = async(req,res)=>{


// try{


// const doctor = await Doctor.findOne({
// user:req.user.id
// });


// const appointments = await Appointment.find({

// doctor:doctor._id

// })
// .populate(
// "patient",
// "name email"
// );



// res.json(appointments);



// }catch(error){

// res.status(500).json({
// message:error.message
// });

// }


// };

exports.updateAppointmentStatus = async(req,res)=>{


try{


const {
status,
cancelReason
}=req.body;



const updateData = {
status
};



// agar cancel hai to reason save karo

if(status === "cancelled"){

updateData.cancelReason = cancelReason;

}




const appointment = await Appointment.findByIdAndUpdate(

req.params.id,

updateData,

{
new:true
}

);



res.json({

message:"Appointment status updated",

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


// ================================
// Today's Doctor Appointments
// ================================

exports.getTodaysAppointments = async(req,res)=>{

try{


// logged in user se doctor find karo

const doctor = await Doctor.findOne({
    user:req.user.id
});


if(!doctor){

return res.status(404).json({
message:"Doctor profile not found"
});

}



// today date range

const today = new Date();


const start = new Date(today);

start.setHours(0,0,0,0);



const end = new Date(today);

end.setHours(23,59,59,999);




// appointments find

const appointments = await Appointment.find({

doctor:doctor._id,

appointmentDateTime:{
    $gte:start,
    $lte:end
}

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



res.status(200).json(appointments);



}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}


};

exports.getUpcomingAppointments = async(req,res)=>{

try{


const doctor = await Doctor.findOne({
    user:req.user.id
});


if(!doctor){

return res.status(404).json({
message:"Doctor profile not found"
});

}



const appointments = await Appointment.find({

doctor:doctor._id,

appointmentDateTime:{
$gte:new Date()
}

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



res.json(appointments);



}catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}

};

exports.getPatientStats = async(req,res)=>{

try{


const Appointment = require("../models/appointment");



const patientId = req.params.patientId;



const totalVisits = await Appointment.countDocuments({

patient:patientId,

status:"completed"

});




const lastVisit = await Appointment.findOne({

patient:patientId,

status:"completed"

})
.sort({
appointmentDateTime:-1
})
.populate({
path:"doctor",
populate:{
path:"user",
select:"name"
}
});





res.json({

totalVisits,

lastVisit

});



}
catch(error){

console.log(error);

res.status(500).json({
message:error.message
});

}


};

exports.appointmentAnalytics = async(req,res)=>{


try{


const doctor = await Doctor.findOne({

user:req.user.id

});


console.log(
"Analytics Doctor:",
doctor
);



if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}



const pending =
await Appointment.countDocuments({

doctor:doctor._id,

status:"pending"

});



const confirmed =
await Appointment.countDocuments({

doctor:doctor._id,

status:"confirmed"

});



const completed =
await Appointment.countDocuments({

doctor:doctor._id,

status:"completed"

});



const cancelled =
await Appointment.countDocuments({

doctor:doctor._id,

status:"cancelled"

});



const total =
await Appointment.countDocuments({

doctor:doctor._id

});




console.log(
"Analytics Result:",
{
pending,
confirmed,
completed,
cancelled,
total
}
);



res.json({

pending,

confirmed,

completed,

cancelled,

total

});



}
catch(error){


console.log(
"Analytics Error:",
error
);


res.status(500).json({

message:error.message

});


}


};

