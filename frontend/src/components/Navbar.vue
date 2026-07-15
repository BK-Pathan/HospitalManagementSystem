<script setup>

import {computed} from "vue";


const role = computed(() => localStorage.getItem("role"));


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


<h2>
{{title}}
</h2>



<div>

<span>
Welcome {{role}}
</span>


</div>


</nav>


</template>



<style scoped>


.navbar{

height:70px;
background:white;
display:flex;
justify-content:space-between;
align-items:center;
padding:0 30px;
box-shadow:0 2px 10px rgba(0,0,0,.1);

}


</style>