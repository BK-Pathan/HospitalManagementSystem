const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');


// // Create Doctor
// exports.createDoctor = async(req,res)=>{

//     try{

//         const doctor = await Doctor.create(req.body);

//         res.status(201).json({
//             message:"Doctor created",
//             doctor
//         });

//     }catch(error){

//         res.status(500).json({
//             message:error.message
//         });

//     }

// };


// // Update Doctor
// exports.updateDoctor = async(req,res)=>{

//     try{

//         const doctor = await Doctor.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             {new:true}
//         );


//         res.json({
//             message:"Doctor updated",
//             doctor
//         });


//     }catch(error){

//         res.status(500).json({
//             message:error.message
//         });

//     }

// };



// // Delete Doctor
// exports.deleteDoctor = async(req,res)=>{

//     try{

//         await Doctor.findByIdAndDelete(req.params.id);


//         res.json({
//             message:"Doctor deleted"
//         });


//     }catch(error){

//         res.status(500).json({
//             message:error.message
//         });

//     }

// };



// // View All Doctors
// exports.getAllDoctors = async(req,res)=>{

//     const doctors = await Doctor.find();

//     res.json(doctors);

// };



// // View All Patients
// exports.getAllPatients = async(req,res)=>{

//     const patients = await Patient.find();

//     res.json(patients);

// };



// // View All Appointments
// exports.getAllAppointments = async(req,res)=>{


//     const appointments = await Appointment.find()
//     .populate("doctor","name specialties")
//     .populate("patient","name");


//     res.json(appointments);


// };


// ======================
// Dashboard Statistics
// ======================

exports.dashboardStats = async(req,res)=>{

    try{

        const users = await User.countDocuments();

        const doctors = await Doctor.countDocuments();

        const patients = await Patient.countDocuments();

        const appointments = await Appointment.countDocuments();


        res.status(200).json({
            users,
            doctors,
            patients,
            appointments
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// ======================
// Create Doctor
// ======================

const bcrypt = require("bcrypt");
const User = require("../models/user");


exports.createDoctor = async(req,res)=>{

try{


const {
name,
specialties,
qualifications,
experience,
contactInformation,
availability
}=req.body;



// create user

const user = await User.create({

name,

email:`${Date.now()}@doctor.com`,

password:await bcrypt.hash("123456",10),

role:"doctor"

});




// create doctor profile

const doctor = await Doctor.create({

user:user._id,

name,

specialties,

qualifications,

experience,

contactInformation,

availability

});




res.status(201).json({

message:"Doctor created successfully",

doctor

});


}catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}

};




// ======================
// Update Doctor
// ======================

exports.updateDoctor = async(req,res)=>{

try{

const doctor = await Doctor.findByIdAndUpdate(
req.params.id,
req.body,
{
new:true
}
);


res.json(doctor);


}catch(error){

res.status(500).json({
message:error.message
});

}

}




// ======================
// Delete Doctor
// ======================

exports.deleteDoctor = async(req,res)=>{

    try{

        await Doctor.findByIdAndDelete(req.params.id);


        res.json({
            message:"Doctor deleted"
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// ======================
// View All Doctors
// ======================

exports.getAllDoctors = async(req,res)=>{

    try{

        const doctors = await Doctor.find();

        res.json(doctors);

    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// ======================
// View All Patients
// ======================

exports.getAllPatients = async(req,res)=>{

try{

const patients = await Patient.find()
.populate({
    path:"user",
    match:{
        role:"patient"
    },
    select:"name email role"
});


const filteredPatients = patients.filter(
    patient => patient.user !== null
);


res.json(filteredPatients);


}catch(error){

res.status(500).json({
message:error.message
});

}

};



// ======================
// View All Appointments
// ======================

exports.getAllAppointments = async(req,res)=>{

try{


const appointments = await Appointment.find()

.populate(
"doctor",
"name specialties"
)

.populate({
    path:"patient",
    populate:{
        path:"user",
        select:"name email"
    }
});


res.json(appointments);


}catch(error){

res.status(500).json({
message:error.message
});

}

};

//change role
exports.changeRole = async(req,res)=>{

try{

const {role} = req.body;


const user = await User.findById(req.params.id);


if(!user){

return res.status(404).json({
message:"User not found"
});

}



// Patient -> Doctor

if(user.role === "patient" && role === "doctor"){


await Patient.findOneAndDelete({
    user:user._id
});


}



// Doctor -> Patient

if(user.role === "doctor" && role === "patient"){


await Doctor.findOneAndDelete({
    user:user._id
});


}



// Update role

user.role = role;

await user.save();



res.json({

message:"Role updated successfully",
user

});


}
catch(error){

res.status(500).json({
message:error.message
});

}

};

// ======================
// View All Users
// ======================

exports.getAllUsers = async(req,res)=>{

try{

    const users = await User.find()
    .select("-password");


    res.json(users);


}
catch(error){

    res.status(500).json({
        message:error.message
    });

}

};