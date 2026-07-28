<script setup>

import { watch, nextTick } from "vue";
import { useRoute } from "vue-router";

import Sidebar from "../components/Sidebar.vue";
import Navbar from "../components/Navbar.vue";
import CommonFooter from "../components/Footer.vue";


const route = useRoute();


watch(
    () => route.fullPath,
    async () => {

        await nextTick();

        const content = document.querySelector(".content");

        if(content){
            content.scrollTo({
                top:0,
                behavior:"instant"
            });
        }

    }
);


</script>

<template>


<div class="layout">


<Sidebar/>


<div class="main">


<Navbar/>


<div class="content">


<router-view/>
<CommonFooter/>

</div>


</div>


</div>


</template>



<style scoped>


.layout{

display:flex;

min-height:100vh;

background:var(--bg);

}





.main{

flex:1;

background:#f8fafc;

margin-left:270px;

min-height:100vh;

}





.content{

padding:30px;

min-height:calc(100vh - 70px);

background:#f8fafc;

}





@media(max-width:900px){


.main{

margin-left:220px;

}


.content{

padding:20px;

}


}


</style>