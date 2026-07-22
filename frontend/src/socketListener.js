import socket from "./socket";


socket.on(
"notification",
(data)=>{

console.log(
"Global Notification:",
data
);


});