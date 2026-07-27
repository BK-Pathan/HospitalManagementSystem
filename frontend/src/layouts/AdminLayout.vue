<script setup>

import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";
import CommonFooter from "../components/Footer.vue";
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

        <main class="content">

            <router-view />
            <CommonFooter/>

        </main>


    </div>


</div>

</template>



<style scoped>


.layout{

    min-height:100vh;

    display:flex;

    background:#f8fafc;

}


/* =====================
MAIN
===================== */


.main{

    margin-left:270px;

    width:calc(100% - 270px);

    min-height:100vh;

    transition:.3s;

}



/* =====================
CONTENT
===================== */


.content{

    padding:30px;

    min-height:calc(100vh - 80px);

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