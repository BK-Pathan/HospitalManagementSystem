<template>


<div class="public-layout">


    <WaterMesh/>


    <div class="page-content">

        <router-view/>

    </div>


</div>


</template>


<script setup>

import WaterMesh from "../components/WaterMesh.vue"

</script>



<style scoped>


.public-layout{

min-height:100vh;

position:relative;

overflow:hidden;

}



.page-content{

position:relative;

z-index:5;

}


</style>