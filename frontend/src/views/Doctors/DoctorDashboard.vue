<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const stats=ref({

patients:0,
pending:0,
confirmed:0,
completed:0

});



const getStats=async()=>{


const res=await api.get(
"/doctor/dashboard"
);


stats.value=res.data;


}



onMounted(()=>{

getStats();

});


</script>



<template>

<div>


<h2>
Doctor Dashboard
</h2>



<div class="cards">


<div>
<h3>
Patients
</h3>

<h1>
{{stats.patients}}
</h1>

</div>


<div>
<h3>
Pending
</h3>

<h1>
{{stats.pending}}
</h1>

</div>


<div>
<h3>
Confirmed
</h3>

<h1>
{{stats.confirmed}}
</h1>

</div>


<div>
<h3>
Completed
</h3>

<h1>
{{stats.completed}}
</h1>

</div>


</div>



</div>

</template>