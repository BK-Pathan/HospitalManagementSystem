import socket from "./socket";


// 🔔 Global Notification Listener

socket.on(
"notification",
(data)=>{

	console.log("SocketListener: notification received", data);

	// 🔊 Notification Sound
	const audio = new Audio("/sound.mp3");

	audio.play()
	.then(()=>{
		console.log("SocketListener: notification sound played");
	})
	.catch(error=>{
		console.log("SocketListener: sound play blocked:", error);
	});

	// 🌐 Browser Notification
	if(Notification.permission === "granted"){
		new Notification(data.title, { body: data.message, icon: "/logo.png" });
		console.log("SocketListener: browser notification shown", data.title);
	}



});