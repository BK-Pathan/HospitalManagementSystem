<script setup>
import { RouterView } from "vue-router";
</script>


<template>

<div>

<h1>
Patient Dashboard
</h1>


<nav>

<router-link to="/patient/profile">
Profile
</router-link>


&nbsp; | &nbsp;


<router-link to="/patient/doctors">
Doctors
</router-link>


&nbsp; | &nbsp;


<router-link to="/patient/appointments">
My Appointments
</router-link>


</nav>


<hr>


<RouterView />

</div>

</template>