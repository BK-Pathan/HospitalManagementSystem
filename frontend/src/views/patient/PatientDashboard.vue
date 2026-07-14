<script setup>

import {RouterView} from "vue-router";


</script>


<template>

<div>

<h1>
Patient Dashboard
</h1>


<nav>

<router-link to="/patient">
Doctors
</router-link>
<router-link to="/patient/book">
Book Appointment
</router-link>

|
<router-link to="/patient/appointments">
My Appointments
</router-link>


</nav>


<hr>


<RouterView />


</div>

</template>