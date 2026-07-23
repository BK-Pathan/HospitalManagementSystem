import socket from "./socket";


// 🔔 Global Notification Listener

socket.on(
"notification",
(data)=>{


console.log(
"Global Notification:",
data
);



// 🔊 Notification Sound

const audio = new Audio(
"/sound.mp3"
);


audio.play()
.catch(error=>{

console.log(
"Sound blocked:",
error
);

});




// 🌐 Browser Notification

if(
Notification.permission === "granted"
){


new Notification(
data.title,
{

body:data.message,

icon:"/logo.png"

}

);


}



});