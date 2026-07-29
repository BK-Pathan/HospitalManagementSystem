<script setup>

import {ref,onMounted,onUnmounted} from "vue";
import socket from "./socket";
import NotificationToast from "./components/NotificationToast.vue";
import Toast from "./components/Toast.vue";


const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("success");


const notify=(message,type="success")=>{

toastMessage.value = message;
toastType.value = type;

showToast.value=true;


setTimeout(()=>{

showToast.value=false;

},3000);


}


window.notify = notify;

const toast = ref(null);


// sound
const audio = new Audio();

audio.src="/sound.mp3";
audio.preload="auto";



const handleNotification = (data)=>{


console.log(
"GLOBAL NOTIFICATION:",
data
);


// show toast

toast.value=data;



setTimeout(()=>{

toast.value=null;

},4000);




// play sound

audio.play()
.then(()=>{

console.log(
"Notification sound played"
);

})
.catch(error=>{

console.log(
"Sound blocked:",
error
);

});





// browser notification

if(
Notification.permission==="granted"
){


new Notification(

data.title,

{

body:data.message

}

);


}



};






onMounted(()=>{


const user =
JSON.parse(
localStorage.getItem("user")
);



if(user){


console.log(
"CURRENT USER:",
user
);



socket.emit(
"joinRoom",
user._id
);



console.log(
"JOIN REQUEST SENT:",
user._id
);


}





socket.on(
"notification",
handleNotification
);



});






onUnmounted(()=>{


socket.off(
"notification",
handleNotification
);


});



</script>



<template>


<router-view/>



<Toast
:show="showToast"
:message="toastMessage"
:type="toastType"
/>


<NotificationToast

:notification="toast"

/>

<div v-if="toast">
TEST POPUP:
{{toast.title}}
</div>


</template>