const Notification = require("../models/notification");


const sendNotification = async({
user,
sender,
title,
message,
type="system",
appointment=null,
redirectUrl=""
})=>{


try{


const notification = await Notification.create({

user,

sender,

title,

message,

type,

appointment,

redirectUrl

});



// realtime

if(global.io){

global.io
.to(user.toString())
.emit(
"notification",
{

title,
message,
type,
appointmentId:appointment,
redirectUrl

}

);

}



console.log(
"NOTIFICATION SENT:",
notification
);


return notification;


}
catch(error){


console.log(
"NOTIFICATION ERROR:",
error
);


}



};


module.exports = sendNotification;