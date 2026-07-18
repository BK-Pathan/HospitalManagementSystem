const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
const Feedback = require('../models/feedback');

exports.dashboardStats = async(req,res)=>{

try{


const users = await User.countDocuments();

const doctors = await Doctor.countDocuments();

const patients = await Patient.countDocuments();

const appointments = await Appointment.countDocuments();




// Appointment Status Count

const appointmentStatus = await Appointment.aggregate([

{
$group:{
_id:"$status",
total:{
$sum:1
}
}
}

]);





// Monthly Appointments

const monthlyAppointments = await Appointment.aggregate([

{
$group:{
_id:{
month:{
$month:"$appointmentDateTime"
}
},
total:{
$sum:1
}
}
},


{
$sort:{
"_id.month":1
}
}


]);





// Daily New Patients

const dailyPatients = await Patient.aggregate([

{
$group:{

_id:{

day:{
$dayOfMonth:"$createdAt"
},

month:{
$month:"$createdAt"
},

year:{
$year:"$createdAt"
}

},

total:{
$sum:1
}

}

},


{
$sort:{

"_id.year":1,
"_id.month":1,
"_id.day":1

}

}


]);







// ======================
// Today's Appointments
// ======================


const today = new Date();


const start = new Date(today);

start.setHours(0,0,0,0);



const end = new Date(today);

end.setHours(23,59,59,999);





const todaysAppointments = await Appointment.find({

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
.populate({
    path:"doctor",
    select:"name specialties"
})
.limit(5);





res.status(200).json({

users,

doctors,

patients,

appointments,


appointmentStatus,


monthlyAppointments,


dailyPatients,


todaysAppointments


});



}
catch(error){


console.log(error);


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
email,
password,
specialties,
qualifications,
experience,
contactInformation,
availability
}=req.body;



// Check email already exists

const existingUser = await User.findOne({
    email
});


if(existingUser){

return res.status(400).json({
message:"Email already exists"
});

}



// Create login user

const user = await User.create({

name,

email,

password:await bcrypt.hash(password,10),

role:"doctor"

});




// Create doctor profile

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


}
catch(error){


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

exports.getAllDoctors = async (req, res) => {

try {


const search = req.query.search || "";


// Pagination

const page = Number(req.query.page) || 1;

const limit = 5;

const skip = (page - 1) * limit;



const filter = {

$or: [

{
name:{
$regex:search,
$options:"i"
}
},

{
specialties:{
$regex:search,
$options:"i"
}
}

]

};



// Doctors

const doctors = await Doctor.find(filter)
// const doctors = await Doctor.find(filter)
.populate("user","email")
.sort({
experience:-1
})

.skip(skip)

.limit(limit);



// Total doctors count

const total = await Doctor.countDocuments(filter);



res.json({

doctors,

total,

currentPage:page,

totalPages:Math.ceil(total / limit)

});



}catch(error){


res.status(500).json({

message:error.message

});


}

};



// ======================
// View All Patients
// ======================

exports.getAllPatients = async (req, res) => {
  try {
    const search = req.query.search || "";

    const patients = await Patient.find()
      .populate({
        path: "user",
        match: {
          role: "patient",
          name: {
            $regex: search,
            $options: "i",
          },
        },
        select: "name email role",
      });

    const filteredPatients = patients.filter(
      (patient) => patient.user !== null
    );

    res.json(filteredPatients);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



// ======================
// View All Appointments
// ======================

exports.getAllAppointments = async (req, res) => {
  try {

    const status = req.query.status;

    let filter = {};

    if (status) {
      filter.status = status;
    }


    const appointments = await Appointment.find(filter)

      .populate(
        "doctor",
        "name specialties"
      )

      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email"
        }
      });


    res.json(appointments);


  } catch (error) {

    res.status(500).json({
      message: error.message
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

exports.cancelAppointment = async(req,res)=>{

try{


const {reason}=req.body;


const appointment = await Appointment.findByIdAndUpdate(

req.params.id,

{
status:"cancelled",
cancelReason:reason
},

{
new:true
}

);



res.json({

message:"Appointment cancelled successfully",

appointment

});



}catch(error){


res.status(500).json({

message:error.message

});


}

};


exports.doctorPerformance = async(req,res)=>{

try{


const performance = await Feedback.aggregate([

{
$group:{
_id:"$doctor",

averageRating:{
$avg:"$rating"
},

totalReviews:{
$sum:1
}

}

},


{
$lookup:{
from:"doctors",
localField:"_id",
foreignField:"_id",
as:"doctor"
}

},


{
$unwind:"$doctor"
},


{
$project:{
_id:0,
doctorName:"$doctor.name",
averageRating:{
$round:[
"$averageRating",
1
]
},
totalReviews:1
}

}


]);


res.status(200).json(performance);


}
catch(error){

console.log("Doctor Performance Error:",error);

res.status(500).json({
message:error.message
});

}

};

// ======================
// Create Patient By Admin
// ======================

exports.createPatient = async(req,res)=>{

try{


const {
name,
email,
password,
age,
gender,
contactInformation,
medicalHistory,
DescribeYourProblem,
insuranceDetails
}=req.body;



// check existing user

const existingUser = await User.findOne({
email
});


if(existingUser){

return res.status(400).json({

message:"Email already exists"

});

}



// create user

const user = await User.create({

name,

email,

password:await bcrypt.hash(password,10),

role:"patient"

});




// create patient profile

const patient = await Patient.create({

user:user._id,

age,

gender,

contactInformation,

medicalHistory,

DescribeYourProblem,

insuranceDetails,

profilecompleted:true

});




res.status(201).json({

message:"Patient created successfully",

patient

});


}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}

};

// ======================
// Doctor Availability Status
// ======================

exports.doctorAvailabilityStatus = async(req,res)=>{

try{

const today = new Date()
.toLocaleString("en-US",{
weekday:"short"
});


const doctors = await Doctor.find()
.select("name specialties availability");



const result = doctors.map(doctor=>{


const availableToday = doctor.availability?.some(
(item)=> item.day === today
);



return {

name: doctor.name,

specialties: doctor.specialties,

status: availableToday 
? "Available Today"
: "Not Available",

available: availableToday

};


});



res.json(result);


}catch(error){


res.status(500).json({

message:error.message

});


}

};