<script setup>

import { ref, computed, onMounted } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";
import socket from "../socket";


const router = useRouter();


const role = computed(()=>localStorage.getItem("role"));


const user = ref({});


const notifications = ref([]);



// latest user profile

const getProfile = async()=>{

try{

const res = await api.get("/auth/profile");


user.value = res.data;


localStorage.setItem(
    "user",
    JSON.stringify(res.data)
);


}
catch(error){

console.log(error);

}

};




// get notification count

const getNotifications = async()=>{

try{


const res = await api.get("/notifications");


notifications.value = res.data;


}
catch(error){

console.log(error);

}


};





onMounted(()=>{


getProfile();


getNotifications();



// realtime notification

socket.on(
"notification",
(data)=>{


notifications.value.unshift({

...data,

isRead:false

});
    

});


});





const notificationCount = computed(()=>{


return notifications.value.filter(
n=>!n.isRead
).length;


});





const openNotifications = ()=>{


router.push("/notifications");


};







const name = computed(()=>{

return user.value.name || "";

});





const userRole = computed(()=>{


const currentRole = role.value;


if(currentRole==="admin")
return "Admin";


if(currentRole==="doctor")
return "Doctor";


if(currentRole==="patient")
return "Patient";


return "";


});





const title = computed(()=>{


const currentRole = role.value;


if(currentRole==="admin")
return "Admin Panel";


if(currentRole==="doctor")
return "Doctor Panel";


if(currentRole==="patient")
return "Patient Panel";


return "Hospital";


});



</script>

<template>

<nav class="navbar">


    <div class="brand-section">

        <div class="logo">
            🏥
        </div>


        <div>
            <h2>
                {{title}}
            </h2>

            <p>
                Hospital Management System
            </p>
        </div>

    </div>

<div 
class="notification-icon"
@click="openNotifications"
>


🔔


<span 
v-if="notificationCount > 0"
class="notification-badge"
>

{{notificationCount}}

</span>


</div>

    <div class="user-section">


        <div class="user-icon">
            👤
        </div>


        <div class="user-info">

            <span class="welcome">
                Welcome
            </span>

            <span class="role">
                    <span class="role-badge">{{ userRole }}</span>
               <h4>{{ name }}</h4>

            </span>

        </div>


    </div>


</nav>


</template>



<style scoped>


.navbar{


    height:80px;

    background:var(--white);

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:0 35px;

    box-shadow:var(--shadow);

    border-bottom:1px solid var(--border);


}



/* Brand */


.brand-section{

    display:flex;

    align-items:center;

    gap:15px;

}



.logo{

    width:50px;

    height:50px;

    border-radius:14px;

    display:flex;

    justify-content:center;

    align-items:center;

    font-size:25px;


    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

}



.brand-section h2{


    color:var(--text);

    font-size:22px;

    font-weight:700;

    margin:0;


}



.brand-section p{


    color:var(--muted);

    font-size:13px;

    margin-top:3px;


}




/* User */


.user-section{


    display:flex;

    align-items:center;

    gap:12px;

    padding:10px 18px;

    border-radius:14px;

    background:var(--bg);


}



.user-icon{


    width:42px;

    height:42px;

    border-radius:50%;

    display:flex;

    justify-content:center;

    align-items:center;

    background:white;

    font-size:20px;


}



.user-info{


    display:flex;

    flex-direction:column;

}



.welcome{


    font-size:13px;

    color:var(--muted);

}



.role{


    font-size:15px;

    font-weight:700;

    color:var(--primary);

    text-transform:capitalize;


}




@media(max-width:600px){


.navbar{

    padding:0 15px;

}


.brand-section p{

    display:none;

}


.brand-section h2{

    font-size:18px;

}



.user-section{

    padding:8px;

}


.user-info{

    display:none;

}


}


.role-badge{
    font-size:12px;
    padding:3px 10px;
    border-radius:20px;
    background:#14B8A6;
    color:white;
}
.notification-icon{


position:relative;

font-size:28px;

cursor:pointer;

margin-right:25px;

}



.notification-badge{


position:absolute;

top:-8px;

right:-10px;


background:red;

color:white;


width:20px;

height:20px;


border-radius:50%;


display:flex;

align-items:center;

justify-content:center;


font-size:12px;

font-weight:bold;


}
</style>


