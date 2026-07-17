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

    min-height:100vh;

}



/* Sidebar ke liye space */

.main{

    margin-left:270px;

    width:calc(100% - 270px);

    min-height:100vh;

    background:var(--bg);

}




.content{

    padding:30px;

    min-height:calc(100vh - 80px);

}



/* Mobile */

@media(max-width:900px){


.main{

    margin-left:220px;

    width:calc(100% - 220px);

}


}


</style>