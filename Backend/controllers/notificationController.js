const Notification = require("../models/notification");



// =====================================
// Get My Notifications
// =====================================

exports.getMyNotifications = async(req,res)=>{

try{


const notifications = await Notification.find({

user:req.user.id

})
.populate("sender","name")
.populate("appointment")
.sort({
createdAt:-1
});



res.json(notifications);



}
catch(error){

res.status(500).json({

message:error.message

});

}

};





// =====================================
// Mark As Read
// =====================================

exports.markAsRead = async(req,res)=>{


try{


const notification =
await Notification.findOneAndUpdate(


{
_id:req.params.id,

user:req.user.id

},


{
isRead:true
},


{
new:true
}

);



if(!notification){

return res.status(404).json({

message:"Notification not found"

});

}



res.json(notification);



}
catch(error){


res.status(500).json({

message:error.message

});


}

};






// =====================================
// Delete Notification
// =====================================

exports.deleteNotification = async(req,res)=>{


try{


const notification =
await Notification.findOneAndDelete({

_id:req.params.id,

user:req.user.id

});



if(!notification){

return res.status(404).json({

message:"Notification not found"

});

}



res.json({

message:"Notification deleted"

});



}
catch(error){

res.status(500).json({

message:error.message

});

}


};






// =====================================
// Get Unread Count
// =====================================

exports.getUnreadCount = async(req,res)=>{


try{


const count =
await Notification.countDocuments({

user:req.user.id,

isRead:false

});



res.json({

count

});



}
catch(error){


res.status(500).json({

message:error.message

});


}

};
