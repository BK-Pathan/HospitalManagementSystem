<script setup>

import {ref,onMounted,computed} from "vue";

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


// Display-only derived values (computed locally from already-fetched
// feedbacks — no extra backend calls)

const averageRating = computed(() => {

  if (!feedbacks.value.length) return 0;

  const total = feedbacks.value.reduce(
    (sum, item) => sum + (item.rating || 0),
    0
  );

  return (total / feedbacks.value.length).toFixed(1);

});

const initials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
};


</script>



<template>


<div class="page">


<div class="page-header">
  <p class="eyebrow">Reviews</p>
  <h2 class="page-title">Patient Feedback</h2>
</div>


<div class="summary" v-if="feedbacks.length">

  <div class="summary-card">
    <div class="summary-icon">
      <svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.9 6.4 7 .7-5.2 4.8 1.5 6.9L12 17.3 5.8 20.8l1.5-6.9L2.1 9.1l7-.7L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
    </div>
    <div>
      <h3>Average Rating</h3>
      <h1>{{ averageRating }}<span class="unit">/5</span></h1>
    </div>
  </div>

  <div class="summary-card">
    <div class="summary-icon summary-icon--muted">
      <svg viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
    </div>
    <div>
      <h3>Total Reviews</h3>
      <h1>{{ feedbacks.length }}</h1>
    </div>
  </div>

</div>




<div
v-if="feedbacks.length"
class="feedback-grid"
>


<div
class="feedback-card"
v-for="item in feedbacks"
:key="item._id"
>


<div class="feedback-card__head">

<span class="avatar">{{ initials(item.patient?.user?.name) }}</span>

<div class="feedback-card__head-info">

<h3>

{{item.patient?.user?.name || "Patient"}}

</h3>



<div class="rating">

<svg
v-for="n in 5"
:key="n"
viewBox="0 0 24 24"
:class="n <= item.rating ? 'star star--filled' : 'star'"
><path d="M12 2l2.9 6.4 7 .7-5.2 4.8 1.5 6.9L12 17.3 5.8 20.8l1.5-6.9L2.1 9.1l7-.7L12 2z" /></svg>

<span class="rating-value">{{item.rating}}/5</span>

</div>

</div>

</div>



<p class="comment" v-if="item.comment">

"{{item.comment}}"

</p>

<p class="comment comment--empty" v-else>

No comment left.

</p>



<small class="appointment-date">

<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>

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




<div v-else class="empty-state">

<svg viewBox="0 0 24 24" fill="none"><path d="M12 2l2.9 6.4 7 .7-5.2 4.8 1.5 6.9L12 17.3 5.8 20.8l1.5-6.9L2.1 9.1l7-.7L12 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>

<p>
No feedback available yet.
</p>


</div>




</div>



</template>





<style scoped>


.page{

padding:30px;

}


.page-header{

margin-bottom:25px;

}


.eyebrow{

font-size:13px;
font-weight:600;
letter-spacing:.04em;
text-transform:uppercase;
color:var(--primary);
margin:0 0 6px;

}


.page-title{

color:var(--text);

margin:0;

font-size:30px;

}


/* ---------- Summary ---------- */

.summary{

display:grid;

grid-template-columns:repeat(2,1fr);

gap:22px;

margin-bottom:30px;

}


.summary-card{

display:flex;

align-items:center;

gap:16px;

background:var(--white);

padding:22px;

border-radius:18px;

border:1px solid var(--border);

box-shadow:var(--shadow);

}


.summary-icon{

flex-shrink:0;

width:48px;

height:48px;

border-radius:14px;

display:flex;

align-items:center;

justify-content:center;

background:rgba(234,179,8,.14);

color:#ca8a04;

}


.summary-icon--muted{

background:rgba(20,184,166,.12);

color:var(--primary);

}


.summary-icon svg{

width:24px;

height:24px;

}


.summary-card h3{

color:var(--muted);

font-size:13px;

font-weight:600;

text-transform:uppercase;

letter-spacing:.03em;

margin:0 0 6px;

}


.summary-card h1{

color:var(--text);

font-size:26px;

margin:0;

line-height:1;

}


.summary-card h1 .unit{

font-size:14px;

color:var(--muted);

font-weight:500;

margin-left:2px;

}


/* ---------- Feedback grid ---------- */

.feedback-grid{

display:grid;

grid-template-columns:repeat(2,1fr);

gap:20px;

}


.feedback-card{


background:var(--white);

padding:24px;

border-radius:18px;

box-shadow:var(--shadow);

border:1px solid var(--border);

transition:transform .2s ease;


}


.feedback-card:hover{

transform:translateY(-3px);

}


.feedback-card__head{

display:flex;

align-items:center;

gap:14px;

margin-bottom:14px;

}


.avatar{

flex-shrink:0;

width:44px;

height:44px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

background:linear-gradient(135deg,var(--primary),var(--primary-dark));

color:#fff;

font-size:14px;

font-weight:700;

}


.feedback-card h3{

color:var(--text);

margin:0 0 4px;

font-size:15px;

}


.rating{

display:flex;

align-items:center;

gap:2px;

}


.star{

width:15px;

height:15px;

fill:none;

stroke:var(--border);

stroke-width:1.5;

}


.star--filled{

fill:#eab308;

stroke:#eab308;

}


.rating-value{

margin-left:6px;

font-size:12px;

color:var(--muted);

font-weight:600;

}


.comment{

color:var(--text);

font-size:14px;

line-height:1.6;

font-style:italic;

background:#f8fafc;

border-radius:12px;

padding:14px;

margin:0 0 14px;

border:1px solid var(--border);

}


.comment--empty{

color:var(--muted);

}


.appointment-date{

display:flex;

align-items:center;

gap:6px;

color:var(--muted);

font-size:12px;

}


.appointment-date svg{

width:14px;

height:14px;

}


/* ---------- Empty state ---------- */

.empty-state{

display:flex;

flex-direction:column;

align-items:center;

justify-content:center;

gap:12px;

background:var(--white);

padding:60px 20px;

border-radius:20px;

box-shadow:var(--shadow);

border:1px solid var(--border);

color:var(--muted);

}


.empty-state svg{

width:38px;

height:38px;

opacity:.5;

}


.empty-state p{

margin:0;

font-size:14px;

}


@media (max-width:800px){

.summary,
.feedback-grid{

grid-template-columns:1fr;

}

}


</style>