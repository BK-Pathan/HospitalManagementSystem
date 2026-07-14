<script setup>

import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";

</script>



<template>


<div class="layout">


<Sidebar/>


<div class="main">


<Navbar/>


<div class="content">

<router-view/>

</div>


</div>


</div>


</template>



<style scoped>


.layout{

display:flex;
height:100vh;

}


.main{

flex:1;
background:#f1f5f9;

}


.content{

padding:30px;

}



</style>