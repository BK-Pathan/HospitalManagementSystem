<script setup>

import { ref, watch } from "vue";
import { useRoute } from "vue-router";

import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";
import CommonFooter from "../components/Footer.vue";


const route = useRoute();

const content = ref(null);


watch(
    () => route.path,
    () => {

        if(content.value){

            content.value.scrollTop = 0;

        }

    }
);


</script>


<template>

<div class="layout">


    <!-- Sidebar -->

    <Sidebar />


    <!-- Main Area -->

    <div class="main">


        <!-- Navbar -->

        <Navbar />


        <!-- Page Content -->

<main class="content" ref="content">

    <router-view />
    <CommonFooter/>

</main>


    </div>


</div>

</template>



<style scoped>


.layout{

    width:100%;

    min-height:100vh;

    display:flex;

    background:#f8fafc;

    overflow-x:hidden;

}


/* =====================
MAIN
===================== */

.main{

    margin-left:270px;

    width:calc(100% - 270px);

    min-height:100vh;

    height:100vh;

    display:flex;

    flex-direction:column;

    overflow:hidden;

}



/* =====================
CONTENT
===================== */


.content{

    padding:30px;

    flex:1;

    overflow-y:auto;

    background:#f8fafc;

}



/* =====================
TABLET
===================== */


@media(max-width:1000px){


.main{

    margin-left:220px;

    width:calc(100% - 220px);

}


.content{

    padding:20px;

}


}



/* =====================
MOBILE
===================== */


@media(max-width:700px){


.main{

    margin-left:0;

    width:100%;

}



.content{

    padding:15px;

}


}



</style>