const Notification = require("../models/notification");



// Get My Notifications

exports.getMyNotifications = async(req,res)=>{

try{


const notifications = await Notification.find({

user:req.user.id

})
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




// Mark As Read

exports.markAsRead = async(req,res)=>{


try{


const notification =
await Notification.findByIdAndUpdate(

req.params.id,

{
isRead:true
},

{
new:true
}

);



res.json(notification);



}
catch(error){


res.status(500).json({

message:error.message

});


}

};





// Delete Notification

exports.deleteNotification = async(req,res)=>{


try{


await Notification.findByIdAndDelete(
req.params.id
);



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