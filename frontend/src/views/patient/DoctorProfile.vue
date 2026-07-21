<script setup>

import {
ref,
onMounted
} from "vue";

import {
useRoute,
useRouter
} from "vue-router";

import api from "../../api/axios";


const route = useRoute();

const router = useRouter();



const doctor = ref(null);

const feedbacks = ref([]);

const averageRating = ref(0);

const loading = ref(true);





const getDoctorProfile = async()=>{


try{


const res = await api.get(

`/patient/doctors/profile/${route.params.id}`

);



console.log(
"Doctor Profile:",
res.data
);



doctor.value =
res.data.doctor;


feedbacks.value =
res.data.feedbacks;


averageRating.value =
res.data.averageRating;



}
catch(error){


console.log(
error
);


}
finally{


loading.value=false;


}



};







const bookAppointment = ()=>{


router.push(

`/patient/appointments/book/${doctor.value._id}`

);


};







onMounted(()=>{


getDoctorProfile();


});




</script>





<template>


<div class="profile-page">



<div v-if="loading">

Loading...

</div>






<div

v-else-if="doctor"

class="profile-card"

>





<div class="doctor-header">


<img

src="https://cdn-icons-png.flaticon.com/512/387/387561.png"

class="doctor-img"

/>



<div>


<h1>

Dr. {{doctor.name}}

</h1>



<p>

{{doctor.specialties}}

</p>



<div class="rating">

⭐ {{averageRating}}

</div>


</div>



</div>









<div class="details">



<h2>
Doctor Information
</h2>




<p>

<b>
Qualification:
</b>

{{doctor.qualifications}}

</p>





<p>

<b>
Experience:
</b>

{{doctor.experience}}
Years

</p>






<p>

<b>
Contact:
</b>

{{doctor.contactInformation}}

</p>






</div>









<div class="availability">


<h2>
Availability
</h2>



<div

v-for="slot in doctor.availability"

:key="slot._id"

class="slot"

>


{{slot.day}}

<br>


{{slot.startTime}}

-

{{slot.endTime}}



</div>



</div>









    <button
    class="book-btn"
    @click="router.push(`/patient/book-appointment/${doctor._id}`)"
    >

    Book Appointment

    </button>








<div class="reviews">


<h2>

Patient Reviews

</h2>





<div

v-if="feedbacks.length"

v-for="feedback in feedbacks"

:key="feedback._id"

class="review-card"

>



<h3>

⭐ {{feedback.rating}}

</h3>



<p>

{{feedback.comment}}

</p>



<small>

By:
{{feedback.patient?.name}}

</small>



</div>






<p v-else>

No reviews yet

</p>





</div>





</div>





</div>


</template>









<style scoped>


.profile-page{

padding:30px;

}



.profile-card{


background:white;

border-radius:25px;

padding:35px;

box-shadow:0 10px 30px #ddd;


}




.doctor-header{


display:flex;

align-items:center;

gap:30px;


}




.doctor-img{


width:120px;

height:120px;

border-radius:50%;

object-fit:cover;


}





.doctor-header h1{


font-size:35px;

color:#2563eb;


}



.rating{


font-size:22px;

color:#f59e0b;


}




.details{


margin-top:30px;


}





.details p{


font-size:17px;

margin:10px 0;


}







.availability{


margin-top:30px;


}



.slot{


display:inline-block;

background:#eff6ff;

padding:15px;

margin:10px;

border-radius:15px;

color:#2563eb;

font-weight:600;


}







.book-btn{


margin-top:30px;

background:#16a34a;

color:white;

border:none;

padding:15px 30px;

border-radius:15px;

font-size:18px;

cursor:pointer;


}






.reviews{


margin-top:40px;


}



.review-card{


background:#f8fafc;

padding:20px;

border-radius:15px;

margin:15px 0;


}



</style>