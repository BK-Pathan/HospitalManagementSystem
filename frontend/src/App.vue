<template>

<router-view />

</template>

<script setup>

import {onMounted} from "vue";
import socket from "./socket";


onMounted(()=>{


socket.on(
"notification",
(data)=>{


console.log(
"NEW NOTIFICATION",
data
);


alert(data.message);


});


});


</script>