const Notification = require("../models/notification");
const User = require("../models/user");


const createAdminNotification = async({

title,
message,
type="system",
appointment=null

})=>{


try{


// find all admins

const admins = await User.find({
role:"admin"
});



const notifications = [];



for(const admin of admins){


const notification =
await Notification.create({

user:admin._id,

title,

message,

type,

appointment

});


notifications.push(notification);




// realtime

if(global.io){


global.io
.to(admin._id.toString())
.emit(
"notification",
{

title,

message,

type,

appointmentId:appointment

}

);


}



}



// console.log(
// "ADMIN NOTIFICATIONS SENT",
// notifications.length
// );



return notifications;



}
catch(error){


console.log(
"ADMIN NOTIFICATION ERROR",
error
);


}

};



module.exports = {
createAdminNotification
};