const Room = require("../models/room");


// Create Room

exports.createRoom = async(req,res)=>{

try{

const room = await Room.create(req.body);


res.status(201).json({
message:"Room created successfully",
room
});


}
catch(error){

res.status(500).json({
message:error.message
});

}

};



// Get Rooms

exports.getRooms = async(req,res)=>{

try{

const rooms = await Room.find();


res.json(rooms);


}
catch(error){

res.status(500).json({
message:error.message
});

}

};

exports.getAvailableBeds = async(req,res)=>{

try{

const beds = await Bed.find({
status:"available"
})
.populate("room");


res.json(beds);


}catch(error){

res.status(500).json({
message:error.message
});

}

};