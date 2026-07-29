<script setup>
import { computed } from "vue";

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: "success"
  },
  show: Boolean
});

const icon = computed(()=>{

if(props.type==="success") return "✓";
if(props.type==="error") return "✕";
if(props.type==="warning") return "!";
return "i";

});

</script>


<template>

<transition name="toast">

<div
v-if="show"
class="toast"
:class="type"
>

<div class="icon">
{{icon}}
</div>

<p>
{{message}}
</p>

</div>

</transition>

</template>


<style scoped>

.toast{

position:fixed;
top:25px;
right:25px;

display:flex;
align-items:center;
gap:12px;

padding:14px 18px;

background:white;

border-radius:14px;

box-shadow:
0 15px 35px rgba(0,0,0,.15);

z-index:9999;

min-width:300px;

}


.icon{

width:32px;
height:32px;

border-radius:50%;

display:flex;
align-items:center;
justify-content:center;

color:white;
font-weight:bold;

}


.success .icon{
background:#16a34a;
}


.error .icon{
background:#dc2626;
}


.warning .icon{
background:#ca8a04;
}


p{
margin:0;
font-weight:600;
color:#334155;
}



.toast-enter-active,
.toast-leave-active{

transition:.3s;

}


.toast-enter-from,
.toast-leave-to{

opacity:0;
transform:translateY(-20px);

}


</style>