const Bed = require("../models/bed");



// Create Bed

exports.createBed = async(req,res)=>{

try{


const bed = await Bed.create(req.body);


res.status(201).json({

message:"Bed created",
bed

});


}
catch(error){

res.status(500).json({
message:error.message
});

}

};



// Get Beds

exports.getBeds = async(req,res)=>{

try{


const beds = await Bed.find()
.populate("room");


res.json(beds);


}
catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.getAvailableBeds = async (req, res) => {
  try {
    const beds = await Bed.find({ status: "available" }).populate("room");

    res.json(beds);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};