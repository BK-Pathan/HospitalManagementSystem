<script setup>

import { ref, onMounted, onUnmounted } from "vue";
import socket from "./socket";

import NotificationToast from "./components/NotificationToast.vue";
import Toast from "./components/Toast.vue";


// ==========================
// GLOBAL TOAST
// ==========================

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");


const notify = (
  message,
  type = "success"
)=>{

  toastMessage.value = message;
  toastType.value = type;

  showToast.value = true;


  setTimeout(()=>{

    showToast.value = false;

  },3000);

};


window.notify = notify;



// ==========================
// NOTIFICATION TOAST
// ==========================

const toast = ref(null);


// ==========================
// SOUND
// ==========================

const audio = new Audio();

audio.src = "/sound.mp3";
audio.preload = "auto";


const audioUnlocked = ref(false);


const unlockAudio = ()=>{

if(audioUnlocked.value) return;


audio.play()
.then(()=>{

audio.pause();
audio.currentTime = 0;

audioUnlocked.value = true;

console.log("Audio unlocked");

})
.catch(()=>{});

};



// ==========================
// SOCKET NOTIFICATION
// ==========================

const handleNotification = (data)=>{


console.log(
"App: notification received",
data
);



toast.value = data;



setTimeout(()=>{

toast.value = null;

},4000);





audio.play()

.then(()=>{

console.log(
"App: notification sound played"
);

})

.catch(error=>{

console.log(
"App: sound blocked:",
error
);

});





if(Notification.permission === "granted"){

new Notification(

data.title,

{
body:data.message
}

);


console.log(
"App: browser notification shown",
data.title
);

}


};




// ==========================
// SOCKET JOIN FUNCTION
// ==========================

const joinNotificationRoom = ()=>{


const user = JSON.parse(
localStorage.getItem("user")
);



if(user){


const userId =
user?.id || user?._id;



if(userId){


socket.emit(
"joinRoom",
userId
);


console.log(
"Joined notification room:",
userId
);


}


}


};




// ==========================
// MOUNT
// ==========================

onMounted(()=>{


// socket connect + reconnect par room join

socket.on(
"connect",
()=>{

console.log(
"Socket Connected:",
socket.id
);


joinNotificationRoom();


});





document.addEventListener(
"click",
unlockAudio,
{
 once:true
}
);





socket.on(
"notification",
handleNotification
);



});




// ==========================
// UNMOUNT
// ==========================

onUnmounted(()=>{


socket.off(
"notification",
handleNotification
);


socket.off(
"connect",
joinNotificationRoom
);


});


</script>



<template>


<router-view />



<Toast

:show="showToast"

:message="toastMessage"

:type="toastType"

/>



<NotificationToast

v-if="toast"

:data="toast"

/>


</template>