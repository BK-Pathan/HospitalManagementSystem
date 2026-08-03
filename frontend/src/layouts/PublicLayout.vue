<template>


<div class="public-layout">


<waterMesh/>

    <div class="page-content">

        <router-view/>

    </div>


</div>


</template>


<script setup>

import waterMesh from "../../src/components/WaterMesh.vue"
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