import socket from "./socket";


socket.on("notification", (data)=>{

    console.log("Notification Received:", data);

});