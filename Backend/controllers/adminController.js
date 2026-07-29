const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
const Feedback = require('../models/feedback');
// Prevent Regex Injection
const escapeRegex = (text)=>{

return text.replace(
/[.*+?^${}()|[\]\\]/g,
"\\$&"
);

};
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
    select:"name department specialties"
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
const xss = require("xss");


// ======================
// Create Doctor
// ======================

exports.createDoctor = async(req,res)=>{

try{


let {
name,
email,
password,
department,
specialties,
qualifications,
experience,
contactInformation,
availability
}=req.body;



// ======================
// Required Fields
// ======================

if(
!name ||
!email ||
!password
){

return res.status(400).json({

message:"Name, email and password are required"

});

}



// ======================
// XSS Sanitize
// ======================

name = xss(name.trim());

email = email.trim().toLowerCase();

department = department 
? xss(department)
: "";

qualifications =
qualifications
? xss(qualifications)
: "";

contactInformation =
contactInformation
? xss(contactInformation)
: "";



if(Array.isArray(specialties)){

specialties =
specialties.map(item=>xss(item));

}else{

specialties=[];

}




// ======================
// Email Validation
// ======================

if(!validator.isEmail(email)){


return res.status(400).json({

message:"Invalid email format"

});

}





// ======================
// Password Security
// ======================

if(password.length < 8){

return res.status(400).json({

message:"Password must be at least 8 characters"

});

}



const strongPassword =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;



if(!strongPassword.test(password)){


return res.status(400).json({

message:
"Password must contain uppercase, lowercase, number and special character"

});

}




// ======================
// Existing Email
// ======================

const existingUser =
await User.findOne({
email
});


if(existingUser){

return res.status(400).json({

message:"Email already exists"

});

}




// ======================
// Create Login User
// ======================

const user = await User.create({

name,

email,

password:
await bcrypt.hash(password,12),

role:"doctor"

});






// ======================
// Create Doctor Profile
// ======================

const doctor = await Doctor.create({

user:user._id,

name,

department,

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


console.log(
"Create Doctor Error:",
error
);


if(error.code===11000){

return res.status(400).json({

message:"Email already exists"

});

}



res.status(500).json({

message:error.message

});


}

};
// ======================
// Update Doctor
// ======================

// ======================
// Update Doctor
// ======================

exports.updateDoctor = async(req,res)=>{

try{

const {
name,
email,
password,
department,
specialties,
qualifications,
experience,
contactInformation,
availability
}=req.body;



const doctor = await Doctor.findById(req.params.id);


if(!doctor){

return res.status(404).json({
message:"Doctor not found"
});

}



// Update Doctor Profile

doctor.name = name ? xss(name) : doctor.name;
doctor.department = department ? xss(department) : doctor.department;

doctor.specialties =
specialties ? xss(specialties) :doctor.specialties;

doctor.qualifications =
qualifications ? xss(qualifications) : doctor.qualifications;

doctor.experience =
experience || doctor.experience;

doctor.contactInformation =
contactInformation || doctor.contactInformation;

doctor.availability =
availability || doctor.availability;



await doctor.save();




// Update User Account

if(doctor.user){


const user = await User.findById(doctor.user);


if(user){


user.name = name || user.name;



// Email update only if changed

if(email && email !== user.email){


const existingUser = await User.findOne({

email,

_id:{
$ne:user._id
}

});


if(existingUser){

return res.status(400).json({

message:"Email already exists"

});

}


user.email = email;


}



// Password update only if entered

if(password){

user.password =
await bcrypt.hash(password,10);

}



await user.save();


}


}



res.json({

message:"Doctor updated successfully",

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


let search = req.query.search || "";


// Regex Injection Protection
search = escapeRegex(search.trim());



// Pagination

const page = Number(req.query.page) || 1;

const limit = 3;

const skip = (page - 1) * limit;




let filter = {};


// Agar search hai tab filter lagao

if(search){

filter = {

$or:[

{
name:{
$regex:search,
$options:"i"
}
},

{
department:{
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

}




const doctors = await Doctor.find(filter)

.populate(
"user",
"email"
)

.sort({
experience:-1
})

.skip(skip)

.limit(limit);




const total = await Doctor.countDocuments(filter);



res.json({

doctors,

total,

currentPage:page,

totalPages:
Math.ceil(total / limit)

});



}
catch(error){


console.log(
"Get Doctors Error:",
error
);


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


let search = req.query.search || "";


// Regex Injection Protection

search = escapeRegex(search.trim());



let matchQuery = {

role:"patient"

};



if(search){

matchQuery.name = {

$regex:search,

$options:"i"

};

}




const patients = await Patient.find()

.populate({

path:"user",

match:matchQuery,

select:"name email role"

});




const filteredPatients = patients.filter(

(patient)=>patient.user !== null

);



res.json(filteredPatients);



}
catch(error){


console.log(
"Get Patients Error:",
error
);



res.status(500).json({

message:error.message

});


}

};;



// ======================
// View All Appointments
// ======================

exports.getAllAppointments = async (req, res) => {
  try {


    const status = req.query.status;


    // Pagination
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;



    let filter = {};


    if (status) {

      filter.status = status;

    }



    const totalAppointments = await Appointment.countDocuments(filter);



    const appointments = await Appointment.find(filter)

      .populate(
        "doctor",
        "name department specialties"
      )

      .populate({
        path: "patient",
        populate: {
          path: "user",
          select: "name email"
        }
      })

      .skip(skip)

      .limit(limit)

      .sort({
        createdAt: -1
      });



    res.json({

      appointments,

      currentPage: page,

      totalPages: Math.ceil(
        totalAppointments / limit
      ),

      totalAppointments

    });



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
const validator = require("validator");
// const bcrypt = require("bcrypt");

// ======================
// Create Patient By Admin
// ======================

exports.createPatient = async(req,res)=>{

try{


let {

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





// ======================
// Required Fields
// ======================

if(
!name ||
!email ||
!password
){

return res.status(400).json({

message:"Name, email and password are required"

});

}





// ======================
// XSS Sanitize
// ======================

name = xss(name.trim());

email = email.trim().toLowerCase();



contactInformation =
contactInformation
?
xss(contactInformation)
:"";



medicalHistory =
medicalHistory
?
xss(medicalHistory)
:"";



DescribeYourProblem =
DescribeYourProblem
?
xss(DescribeYourProblem)
:"";



insuranceDetails =
insuranceDetails
?
xss(insuranceDetails)
:"";







// ======================
// Email Validation
// ======================

if(!validator.isEmail(email)){


return res.status(400).json({

message:"Invalid email format"

});

}





// ======================
// Password Security
// ======================

if(password.length < 8){

return res.status(400).json({

message:"Password must be at least 8 characters"

});

}




const strongPassword =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;



if(!strongPassword.test(password)){


return res.status(400).json({

message:
"Password must contain uppercase, lowercase, number and special character"

});

}





// ======================
// Check Existing User
// ======================

const existingUser =
await User.findOne({

email

});



if(existingUser){

return res.status(400).json({

message:"Email already exists"

});

}





// ======================
// Create User
// ======================

const user = await User.create({

name,

email,

password:
await bcrypt.hash(password,12),

role:"patient"

});







// ======================
// Create Patient Profile
// ======================


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


console.log(
"Create Patient Error:",
error
);



if(error.code===11000){

return res.status(400).json({

message:"Email already exists"

});

}



res.status(500).json({

message:error.message

});


}

};

// ======================
// Doctor Availability Status
// ======================

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
.select("name specialties department availability");

console.log(
"Doctors from DB:",
JSON.stringify(doctors,null,2)
);

const result = await Promise.all(

doctors.map(async(doctor)=>{


const availableToday = doctor.availability?.some(
(item)=> item.day === today
);



// Doctor Rating

const ratings = await Feedback.aggregate([

{
$match:{
doctor:doctor._id
}
},

{
$group:{
_id:null,

averageRating:{
$avg:"$rating"
},

totalReviews:{
$sum:1
}

}

}

]);



return {

name:doctor.name,


// Department Added
department: doctor.department || null,


specialties:doctor.specialties || [],


status:availableToday
? "Available Today"
: "Not Available",


available:availableToday,


averageRating:
ratings.length
? Number(ratings[0].averageRating.toFixed(1))
:0,


totalReviews:
ratings.length
? ratings[0].totalReviews
:0


};


})

);



res.json(result);



}
catch(error){

console.log(error);

res.status(500).json({
message:error.message
});


}

};



// Update User Password (Admin)
exports.updateUserPassword = async(req,res)=>{

try{


const {userId,password}=req.body;



if(!userId || !password){

return res.status(400).json({

message:"User id and password required"

});

}



// Password validation

if(password.length < 8){

return res.status(400).json({

message:"Password must be at least 8 characters"

});

}




// Hash new password

const hashedPassword = await bcrypt.hash(
password,
10
);




// Update

const user = await User.findByIdAndUpdate(

userId,

{
password:hashedPassword
},

{
new:true
}

);



if(!user){

return res.status(404).json({

message:"User not found"

});

}



res.status(200).json({

message:"Password updated successfully"

});



}
catch(error){


console.log(error);


res.status(500).json({

message:"Server error"

});


}


};

// ======================
// Update Patient
// ======================

exports.updatePatient = async(req,res)=>{

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



const patient = await Patient.findById(req.params.id);



if(!patient){

return res.status(404).json({
message:"Patient not found"
});

}



// Update Patient Profile

patient.age = age ?? patient.age;

patient.gender = gender ?? patient.gender;

patient.contactInformation =
contactInformation
?
xss(contactInformation)
:
patient.contactInformation;


patient.medicalHistory =
medicalHistory
?
xss(medicalHistory)
:
patient.medicalHistory;


patient.DescribeYourProblem =
DescribeYourProblem
?
xss(DescribeYourProblem)
:
patient.DescribeYourProblem;


patient.insuranceDetails =
insuranceDetails
?
xss(insuranceDetails)
:
patient.insuranceDetails;



await patient.save();




// Update User Account

if(patient.user){


const user = await User.findById(patient.user);


if(user){


if(name){

user.name = xss(name);

}



if(email && email !== user.email){


const existingUser = await User.findOne({

email,

_id:{
$ne:user._id
}

});


if(existingUser){

return res.status(400).json({

message:"Email already exists"

});

}


user.email=email;


}



// Admin password change

if(password){


user.password =
await bcrypt.hash(password,10);


}



await user.save();


}


}




res.json({

message:"Patient updated successfully",

patient

});



}
catch(error){


console.log(
"Update Patient Error:",
error
);


res.status(500).json({

message:error.message

});


}

};