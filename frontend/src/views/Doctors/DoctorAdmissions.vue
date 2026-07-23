<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";
import {useRouter} from "vue-router";


const router = useRouter();


const admissions = ref([]);



// View Patient History

const viewHistory=(patientId)=>{

router.push(
`/doctor/all-history/${patientId}`
);

};




// Get Admissions

const getAdmissions=async()=>{

try{


const token=localStorage.getItem("token");


const res=await api.get(
"/api/admissions/doctor",
{
headers:{
Authorization:`Bearer ${token}`
}
}
);



admissions.value=res.data;



}
catch(error){

console.log(error.response?.data);

}

};




onMounted(()=>{

getAdmissions();

});


</script>




<template>


<div class="container">


<h2>
🏥 My Admitted Patients
</h2>



<div

v-if="admissions.length===0"

>

No admitted patients


</div>




<div

v-for="a in admissions"

:key="a._id"

class="card"

>



<h3>

{{a.patient?.user?.name}}

</h3>



<p>

Room:

{{a.room?.roomNumber}}

</p>



<p>

Bed:

{{a.bed?.bedNumber}}

</p>



<p>

Reason:

{{a.reason}}

</p>



<p>

Status:

{{a.status}}

</p>


<p>

Admission Date:

{{new Date(a.createdAt).toLocaleDateString()}}

</p>



<button
@click="viewHistory(a.patient._id)"
>
View Patient History
</button>



</div>



</div>


</template>