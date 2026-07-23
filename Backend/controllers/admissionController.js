const Admission = require("../models/admission");
const Bed = require("../models/bed");
const Room = require("../models/room");
const Doctor = require("../models/doctor");


// Assign Bed



exports.createAdmission = async(req,res)=>{

try{

const bed = await Bed.findById(req.body.bed);


if(!bed){

return res.status(404).json({
message:"Bed not found"
});

}


if(bed.status==="occupied"){

return res.status(400).json({
message:"Bed already occupied"
});

}

const admission = await Admission.create(req.body);


// bed occupied

await Bed.findByIdAndUpdate(
req.body.bed,
{
status:"occupied"
}
);



res.status(201).json({

message:"Patient admitted successfully",
admission

});


}
catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.dischargePatient = async(req,res)=>{

try{


const admission = await Admission.findById(
req.params.id
);


if(!admission){

return res.status(404).json({
message:"Admission not found"
});

}

if(admission.status==="discharged"){

return res.status(400).json({
message:"Patient already discharged"
});

}

admission.status="discharged";
admission.dischargeDate=new Date();


await admission.save();



await Bed.findByIdAndUpdate(
admission.bed,
{
status:"available"
}
);



res.json({
message:"Patient discharged successfully"
});


}
catch(error){

res.status(500).json({
message:error.message
});

}

};

// Get All Admissions

exports.getAdmissions = async(req,res)=>{

try{


const admissions = await Admission.find()
.populate("patient")
.populate("doctor")
.populate("room")
.populate("bed")
.sort({
createdAt:-1
});


res.json(admissions);


}
catch(error){

res.status(500).json({

message:error.message

});

}

};

// for doc panel

// =====================================
// Get Doctor Admissions
// =====================================

exports.getDoctorAdmissions = async(req,res)=>{

try{


console.log("USER:",req.user);


// Find Doctor Profile

const doctor = await Doctor.findOne({

user:req.user._id

});



if(!doctor){

return res.status(404).json({

message:"Doctor profile not found"

});

}



console.log("DOCTOR:",doctor);




// Get Doctor Admissions

const admissions = await Admission.find({

doctor:doctor._id,

status:"admitted"

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

populate:{

path:"user",

select:"name email"

}

})
.populate({

path:"room",

select:"roomNumber type"

})
.populate({

path:"bed",

select:"bedNumber"

})
.sort({

createdAt:-1

});



console.log(
"POPULATED ADMISSIONS:",
admissions
);



res.json(admissions);



}
catch(error){


console.log(error);


res.status(500).json({

message:error.message

});


}

};