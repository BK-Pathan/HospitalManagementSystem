<script setup>

</script>


<template>

<div class="sidebar">

    <h2 class="logo">
        🏥 Hospital
    </h2>


    <router-link to="/admin">
        📊 Dashboard
    </router-link>


    <router-link to="/admin/doctors">
        👨‍⚕️ Doctors
    </router-link>


    <router-link to="/admin/patients">
        🧑 Patients
    </router-link>


    <router-link to="/admin/appointments">
        📅 Appointments
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