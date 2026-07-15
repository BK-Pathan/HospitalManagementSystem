<script setup>

import {computed} from "vue";


const role = computed(() => localStorage.getItem("role"));



const menu = computed(()=>{
    const currentRole = role.value;


if(currentRole=== "admin"){

return [

{
name:"📊 Dashboard",
path:"/admin"
},

{
name:"👨‍⚕️ Doctors",
path:"/admin/doctors"
},

{
name:"🧑 Patients",
path:"/admin/patients"
},

{
name:"📅 Appointments",
path:"/admin/appointments"
}


]

}



if(currentRole==="patient"){

return [

{
name:"🏠 Dashboard",
path:"/patient"
},

{
name:"👤 Profile",
path:"/patient/profile"
},

{
name:"👨‍⚕️ Doctors",
path:"/patient/doctors"
},

{
name:"📅 Book Appointment",
path:"/patient/doctors"
},

{
name:"📅 My Appointments",
path:"/patient/appointments"
}


]

}




if(currentRole==="doctor"){

return [

{
name:"🏠 Dashboard",
path:"/doctor"
},

{
name:"📅 Appointments",
path:"/doctor/appointments"
},

{
name:"👤 Profile",
path:"/doctor/profile"
}


]

}



return [];


});



</script>




<template>


<div class="sidebar">


<h2 class="logo">
🏥 Hospital
</h2>




<router-link

v-for="item in menu"

:key="item.path"

:to="item.path"

>


{{item.name}}


</router-link>




<button class="logout">

🚪 Logout

</button>



</div>


</template>




<style scoped>


.sidebar{


width:250px;
height:100vh;
background:#1e293b;
color:white;
display:flex;
flex-direction:column;
padding:20px;
gap:15px;


}



.logo{

margin-bottom:30px;

}



.sidebar a{

color:white;
text-decoration:none;
padding:12px;
border-radius:8px;

}



.sidebar a:hover{

background:#334155;

}



.logout{

margin-top:auto;
padding:12px;
border:none;
border-radius:8px;
cursor:pointer;

}


</style>