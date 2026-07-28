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



  <div v-if="loading" class="loading-state">

    <div class="spinner"></div>
    <p>Loading doctor profile...</p>

  </div>






  <div

  v-else-if="doctor"

  class="profile-card"

  >





    <div class="doctor-header">


      <div class="doctor-img-wrap">
        <img

        src="https://cdn-icons-png.flaticon.com/512/387/387561.png"

        class="doctor-img"

        />
      </div>



      <div class="doctor-header-info">


        <p class="eyebrow">Doctor Profile</p>

        <h1>

        Dr. {{doctor.name}}

        </h1>


        <div class="header-meta">

          <span class="tag">🏥 {{doctor.department}}</span>

          <span class="tag tag--muted" v-if="doctor.specialties?.length">
            {{doctor.specialties.join(", ")}}
          </span>

        </div>



        <div class="rating">

          <span class="rating-stars">⭐ {{averageRating}}</span>
          <span class="rating-label">{{feedbacks.length}} review{{feedbacks.length === 1 ? '' : 's'}}</span>

        </div>


      </div>


      <button
      class="book-btn book-btn--header"
      @click="router.push(`/patient/book-appointment/${doctor._id}`)"
      >

      Book Appointment

      </button>



    </div>









    <div class="info-grid">



      <div class="info-card">
        <span class="info-icon">🏥</span>
        <div>
          <p class="info-label">Department</p>
          <p class="info-value">{{doctor.department}}</p>
        </div>
      </div>

      <div class="info-card">
        <span class="info-icon">🎓</span>
        <div>
          <p class="info-label">Qualification</p>
          <p class="info-value">{{doctor.qualifications}}</p>
        </div>
      </div>

      <div class="info-card">
        <span class="info-icon">📈</span>
        <div>
          <p class="info-label">Experience</p>
          <p class="info-value">{{doctor.experience}} Years</p>
        </div>
      </div>

      <div class="info-card">
        <span class="info-icon">📞</span>
        <div>
          <p class="info-label">Contact</p>
          <p class="info-value">{{doctor.contactInformation}}</p>
        </div>
      </div>



    </div>









    <div class="section availability">


      <h2>Availability</h2>


      <div class="slot-list">

        <div

        v-for="slot in doctor.availability"

        :key="slot._id"

        class="slot"

        >


          <span class="slot-day">{{slot.day}}</span>


          <span class="slot-time">{{slot.startTime}} – {{slot.endTime}}</span>



        </div>

      </div>


    </div>









    <button
    class="book-btn book-btn--full"
    @click="router.push(`/patient/book-appointment/${doctor._id}`)"
    >

    Book Appointment

    </button>








    <div class="section reviews">


      <h2>

      Patient Reviews

      </h2>





      <div class="review-list" v-if="feedbacks.length">

        <div

        v-for="feedback in feedbacks"

        :key="feedback._id"

        class="review-card"

        >


          <div class="review-avatar">
            {{ (feedback.patient?.name || "P").charAt(0) }}
          </div>

          <div class="review-body">

            <div class="review-top">

              <span class="review-stars">⭐ {{feedback.rating}}</span>

              <small class="review-author">{{feedback.patient?.name}}</small>

            </div>


            <p class="review-comment">

            {{feedback.comment}}

            </p>


          </div>



        </div>

      </div>






      <div class="empty-state" v-else>

        <div class="empty-icon">💬</div>
        <p>No reviews yet</p>

      </div>





    </div>





  </div>





</div>


</template>









<style scoped>


.profile-page{

  --clinical-navy:#0F2A43;
  --clinical-teal:#0D9488;
  --clinical-teal-light:#CCFBF1;
  --clinical-bg:#F4F7FA;
  --clinical-surface:#FFFFFF;
  --clinical-border:#E2E8F0;
  --clinical-text:#1E293B;
  --clinical-text-muted:#64748B;
  --clinical-amber:#D97706;
  --clinical-amber-light:#FEF3C7;
  --clinical-green:#16A34A;
  --clinical-green-light:#DCFCE7;
  --clinical-blue:#2563EB;
  --clinical-blue-light:#DBEAFE;
  --clinical-purple:#7C3AED;
  --clinical-purple-light:#EDE9FE;
  --clinical-indigo:#4F46E5;
  --clinical-indigo-light:#E0E7FF;

  padding:28px;

  background:var(--clinical-bg);

  font-family:-apple-system,"Segoe UI",Roboto,Inter,Arial,sans-serif;

  color:var(--clinical-text);

}


.loading-state{

  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:14px;
  padding:80px 0;
  color:var(--clinical-text-muted);

}

.spinner{

  width:34px;
  height:34px;
  border:3px solid var(--clinical-border);
  border-top-color:var(--clinical-teal);
  border-radius:50%;
  animation:spin .8s linear infinite;

}

@keyframes spin{
  to{ transform:rotate(360deg); }
}



.profile-card{


  background:var(--clinical-surface);

  border-radius:18px;

  padding:32px;

  border:1px solid var(--clinical-border);

  box-shadow:0 1px 2px rgba(15,42,67,0.04);


}




.doctor-header{


  display:flex;

  align-items:center;

  gap:26px;

  padding-bottom:26px;

  border-bottom:1px solid var(--clinical-border);


}


.doctor-img-wrap{

  padding:4px;
  border-radius:50%;
  background:linear-gradient(135deg, var(--clinical-teal), var(--clinical-navy));

}


.doctor-img{


  width:104px;

  height:104px;

  border-radius:50%;

  object-fit:cover;

  display:block;

  border:3px solid var(--clinical-surface);


}


.doctor-header-info{

  flex:1;

}


.eyebrow{

  text-transform:uppercase;
  letter-spacing:.08em;
  font-size:12px;
  font-weight:700;
  color:var(--clinical-teal);
  margin:0 0 4px;

}


.doctor-header h1{


  font-size:28px;

  font-weight:700;

  color:var(--clinical-navy);

  margin:0 0 10px;


}


.header-meta{

  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-bottom:12px;

}

.tag{

  font-size:13px;
  font-weight:600;
  color:var(--clinical-teal);
  background:var(--clinical-teal-light);
  padding:5px 12px;
  border-radius:999px;

}

.tag--muted{

  color:var(--clinical-text-muted);
  background:var(--clinical-bg);
  border:1px solid var(--clinical-border);

}


.rating{

  display:flex;
  align-items:center;
  gap:10px;

}


.rating-stars{


  font-size:16px;
  font-weight:700;

  color:var(--clinical-amber);


}

.rating-label{

  font-size:13px;
  color:var(--clinical-text-muted);

}




.info-grid{

  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:14px;

  margin-top:26px;


}

.info-card{

  display:flex;
  align-items:flex-start;
  gap:12px;

  background:var(--clinical-bg);
  border:1px solid var(--clinical-border);
  border-radius:12px;
  padding:16px;

}

.info-icon{

  font-size:18px;

}

.info-label{

  font-size:12px;
  font-weight:600;
  text-transform:uppercase;
  letter-spacing:.03em;
  color:var(--clinical-text-muted);
  margin:0 0 4px;

}

.info-value{

  font-size:15px;
  font-weight:600;
  color:var(--clinical-navy);
  margin:0;

}


.section{

  margin-top:30px;

}

.section h2{

  font-size:18px;
  font-weight:700;
  color:var(--clinical-navy);
  margin:0 0 14px;

}


.slot-list{

  display:flex;
  flex-wrap:wrap;
  gap:12px;

}


.slot{


  display:flex;
  flex-direction:column;
  gap:2px;

  background:var(--clinical-teal-light);

  padding:12px 16px;

  border-radius:12px;

  color:var(--clinical-navy);

  min-width:130px;


}

.slot-day{

  font-weight:700;
  font-size:13px;
  color:var(--clinical-teal);
  text-transform:uppercase;
  letter-spacing:.03em;

}

.slot-time{

  font-weight:600;
  font-size:14px;

}



.book-btn{


  background:var(--clinical-teal);

  color:white;

  border:none;

  padding:13px 26px;

  border-radius:12px;

  font-size:15px;

  font-weight:600;

  cursor:pointer;

  transition:background .2s ease, transform .2s ease;


}

.book-btn:hover{

  background:#0B7A70;
  transform:translateY(-1px);

}

.book-btn--header{

  white-space:nowrap;

}

.book-btn--full{

  margin-top:30px;
  width:100%;

}





.review-list{

  display:flex;
  flex-direction:column;
  gap:12px;

}


.review-card{

  display:flex;
  gap:14px;

  background:var(--clinical-bg);

  border:1px solid var(--clinical-border);

  padding:18px;

  border-radius:12px;


}

.review-avatar{

  width:40px;
  height:40px;
  min-width:40px;
  border-radius:50%;
  background:var(--clinical-navy);
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:700;
  font-size:15px;

}

.review-body{

  flex:1;

}

.review-top{

  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:6px;

}

.review-stars{

  font-weight:700;
  color:var(--clinical-amber);
  font-size:14px;

}

.review-author{

  color:var(--clinical-text-muted);
  font-size:12px;

}

.review-comment{

  margin:0;
  color:var(--clinical-text);
  font-size:14px;
  line-height:1.5;

}


.empty-state{

  text-align:center;
  padding:36px 0;
  color:var(--clinical-text-muted);

}

.empty-icon{

  font-size:32px;
  margin-bottom:8px;

}



@media(max-width:700px){

  .profile-page{
    padding:18px;
  }

  .doctor-header{

    flex-direction:column;
    align-items:flex-start;

  }

  .book-btn--header{

    width:100%;

  }

}


</style>