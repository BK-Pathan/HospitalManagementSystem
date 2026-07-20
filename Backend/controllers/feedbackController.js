const Feedback = require("../models/feedback");
const Patient = require("../models/patient");
const Doctor = require("../models/doctor");

exports.createFeedback = async(req,res)=>{

try{


const patient = await Patient.findOne({
    user:req.user.id
});


if(!patient){

return res.status(404).json({
message:"Patient profile not found"
});

}



const feedback = await Feedback.create({

doctor:req.body.doctor,

patient:patient._id,

appointment:req.body.appointment,

rating:req.body.rating,

comment:req.body.comment

});



res.status(201).json({

message:"Feedback submitted successfully",

feedback

});


}
catch(error){

console.log(error);

res.status(500).json({

message:error.message

});

}


};

// Doctor Feedback

exports.getDoctorFeedback = async(req,res)=>{


try{


console.log("========== DOCTOR FEEDBACK ==========");

console.log(
"Logged User:",
req.user
);



const doctor = await Doctor.findOne({

user:req.user.id

});



console.log(
"Doctor:",
doctor
);



if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}





const feedbacks = await Feedback.find({

doctor:doctor._id

})

.populate({

path:"patient",

populate:{

path:"user",

select:"name email"

}

})


.populate({

path:"appointment",

select:"appointmentDateTime"

})


.sort({

createdAt:-1

});





console.log(
"Feedbacks:",
feedbacks
);



res.json(feedbacks);



}

catch(error){


console.log(
"Feedback Error:",
error
);


res.status(500).json({

message:error.message

});


}



};

exports.getDoctorFeedbackAnalytics = async(req,res)=>{


try{


const Feedback = require("../models/feedback");
const Doctor = require("../models/doctor");



const doctor = await Doctor.findOne({

user:req.user.id

});



if(!doctor){

return res.status(404).json({

message:"Doctor not found"

});

}




const totalReviews = await Feedback.countDocuments({

doctor:doctor._id

});





const ratings = await Feedback.aggregate([

{
$match:{
doctor:doctor._id
}
},


{
$group:{

_id:"$rating",

count:{
$sum:1
}

}

}

]);





let distribution={

1:0,
2:0,
3:0,
4:0,
5:0

};



ratings.forEach(item=>{

distribution[item._id]=item.count;

});





const average = await Feedback.aggregate([

{
$match:{
doctor:doctor._id
}
},


{
$group:{

_id:null,

avgRating:{
$avg:"$rating"
}

}

}

]);






res.json({

totalReviews,


averageRating:
average.length
?
average[0].avgRating.toFixed(1)
:
0,


ratingDistribution:distribution



});




}

catch(error){


console.log(
"Feedback Analytics Error:",
error
);



res.status(500).json({

message:error.message

});


}



};