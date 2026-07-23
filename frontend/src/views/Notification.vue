<script setup>


import {ref,onMounted} from "vue";
import api from "../api/axios";



const notifications = ref([]);



const getNotifications = async()=>{


try{


const res = await api.get(
"/notifications"
);


notifications.value=res.data;


}

catch(error){

console.log(error);

}


};





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






onMounted(()=>{


getNotifications();


});



</script>





<template>


<div class="notification-page">


<h2>

🔔 Notifications

</h2>




<div

v-if="notifications.length===0"

>

No Notifications

</div>





<div

v-for="n in notifications"

:key="n._id"

class="card"

>


<h3>

{{n.title}}

</h3>



<p>

{{n.message}}

</p>




<small>

{{new Date(
n.createdAt
).toLocaleString()}}

</small>




<div>


<button

v-if="!n.isRead"

@click="markRead(n._id)"

>

Mark Read

</button>




<button

@click="removeNotification(n._id)"

>

Delete

</button>



</div>



</div>



</div>


</template>





<style scoped>


.card{


background:white;

padding:15px;

margin:10px;

border-radius:10px;

box-shadow:0 5px 15px #ddd;


}



button{

margin-right:10px;

padding:7px 12px;

cursor:pointer;

}



</style>