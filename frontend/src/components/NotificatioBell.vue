<script setup>

import {ref,onMounted} from "vue";
import socket from "../socket";


const notifications = ref([]);



onMounted(()=>{

socket.on(
"notification",
(data)=>{

console.log(
"PAGE NOTIFICATION:",
data
);

notifications.value.push(data);

});

});

</script>


<template>

<div>


<h3>
Notifications
</h3>


<div
v-for="(n,index) in notifications"
:key="index"
>


{{n.message}}


</div>


</div>


</template>