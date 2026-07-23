<script setup>


defineProps({

notification:{

type:Object,

default:null

}

});


</script>



<template>


<div

v-if="notification"

class="toast"

>


<h4>

🔔 {{notification.title}}

</h4>


<p>

{{notification.message}}

</p>



</div>



</template>




<style scoped>


.toast{


position:fixed;

top:20px;

right:20px;

background:white;

padding:20px;

border-radius:15px;

box-shadow:0 10px 30px rgba(0,0,0,.15);

z-index:9999;

width:300px;

border-left:5px solid #14b8a6;

animation:slide .3s ease;


}



.toast h4{

margin:0 0 8px;

}



.toast p{

margin:0;

color:#555;

}



@keyframes slide{


from{

transform:translateX(100%);

}


to{

transform:translateX(0);

}


}


</style>