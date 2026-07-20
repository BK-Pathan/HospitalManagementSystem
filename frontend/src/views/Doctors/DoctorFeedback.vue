<script setup>

import {ref,onMounted} from "vue";

import api from "../../api/axios";


const feedbacks = ref([]);



const getFeedback = async()=>{


try{


const res = await api.get(
"/doctor/feedback"
);



console.log(
"Doctor Feedback:",
res.data
);



feedbacks.value=res.data;



}

catch(error){


console.log(
error.response?.data || error.message
);


}


};




onMounted(()=>{

getFeedback();

});


</script>



<template>


<div class="page">


<h2>
Patient Feedback
</h2>




<div
v-if="feedbacks.length"
>


<div
class="feedback-card"
v-for="item in feedbacks"
:key="item._id"
>



<h3>

{{item.patient?.user?.name || "Patient"}}

</h3>



<div class="rating">

⭐ {{item.rating}} / 5

</div>



<p>

{{item.comment}}

</p>



<small>

Appointment:

{{

new Date(
item.appointment?.appointmentDateTime
)
.toLocaleDateString()

}}

</small>



</div>


</div>




<div v-else>


<p>
No feedback available
</p>


</div>




</div>



</template>





<style scoped>


.page{

padding:30px;

}



.feedback-card{


background:white;

padding:25px;

margin-bottom:20px;

border-radius:18px;

box-shadow:var(--shadow);

border:1px solid var(--border);


}



.feedback-card h3{


color:var(--primary);


}


.rating{

font-size:20px;

margin:10px 0;

}



p{

color:var(--text);

font-size:16px;

}



</style>