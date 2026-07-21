// const Patient = require("../models/patient");


// // create profile

// exports.createProfile = async(req,res)=>{

// try{


// const patient = await Patient.create({

//     name:req.body.name,
//     age:req.body.age,
//     gender:req.body.gender,
//     contactInformation:req.body.contactInformation,
//     medicalHistory:req.body.medicalHistory,
//     insuranceDetails:req.body.insuranceDetails

// });


// res.status(201).json({

// message:"Profile created",
// patient

// });


// }catch(error){

// res.status(500).json({
// message:error.message
// });

// }


// };

const Patient = require("../models/patient");


// Create / Update Profile

exports.createProfile = async(req,res)=>{

try{
console.log("USER:", req.user);
console.log("BODY:", req.body);
const patient = await Patient.findOneAndUpdate(

{
    user:req.user.id
},


{

user:req.user.id,

age:req.body.age,

gender:req.body.gender,

contactInformation:req.body.contactInformation,

medicalHistory:req.body.medicalHistory,

DescribeYourProblem:req.body.DescribeYourProblem,

insuranceDetails:req.body.insuranceDetails,

profilecompleted:req.body.profilecompleted

},


{
    new:true,
    upsert:true
}


);



res.status(200).json({

message:"Profile saved successfully",

patient

});


}
catch(error){

res.status(500).json({

message:error.message

});

}


};




// Get Profile

exports.getProfile = async(req,res)=>{


try{


const patient = await Patient.findOne({

user:req.user.id

})
.populate(
"user",
"name email"
);



res.json(patient);



}catch(error){

res.status(500).json({

message:error.message

});

}


};