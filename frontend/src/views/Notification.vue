<script setup>

import {ref,onMounted} from "vue";
import api from "../api/axios";
import socket from "../socket";


const notifications = ref([]);



// Load old notifications from database

const getNotifications = async()=>{

try{


const res = await api.get("/notifications");


notifications.value = res.data;


}
catch(error){

console.log(error);

}

};




// realtime notification

onMounted(()=>{


getNotifications();



socket.on(
"notification",
(data)=>{


console.log(
"Realtime Notification:",
data
);



notifications.value.unshift({

title:data.title,

message:data.message,

isRead:false,

createdAt:new Date()

});


});


});




// mark read

const markRead = async(id)=>{


try{


await api.patch(
`/notifications/${id}/read`
);



const item =
notifications.value.find(
n=>n._id===id
);


if(item){

item.isRead=true;

}



}
catch(error){

console.log(error);

}


};




// delete

const removeNotification = async(id)=>{


try{


await api.delete(
`/notifications/${id}`
);



notifications.value =
notifications.value.filter(
n=>n._id!==id
);



}
catch(error){

console.log(error);

}


};



</script>



<template>


<div class="notification-page">


<h2>
🔔 Notifications
</h2>



<div
v-if="notifications.length===0"
class="empty"
>

No Notifications

</div>




<div
v-for="n in notifications"
:key="n._id || n.createdAt"
class="notification-card"
:class="{unread:!n.isRead}"
>


<div>


<h3>
{{n.title}}
</h3>


<p>
{{n.message}}
</p>


<small>
{{new Date(n.createdAt).toLocaleString()}}
</small>


</div>



<div class="actions">


<button
v-if="n._id && !n.isRead"
@click="markRead(n._id)"
>

Mark Read

</button>



<button
v-if="n._id"
@click="removeNotification(n._id)"
>

Delete

</button>


</div>


</div>



</div>


</template>