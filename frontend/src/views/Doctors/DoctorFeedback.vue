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

.page {
  padding: 30px;
}

.page-header {
  margin-bottom: 25px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--primary);
  margin: 0 0 6px;
}

.page-title {
  color: var(--text);
  margin: 0;
  font-size: 30px;
  letter-spacing: -.01em;
}

/* ---------- Summary (Premium) ---------- */

.summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 22px;
  margin-bottom: 30px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 22px;
  border-radius: 18px;
  border: 1px solid var(--border);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  transition: transform .3s cubic-bezier(.22,1,.36,1),
              box-shadow .3s cubic-bezier(.22,1,.36,1);
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 16px 28px -10px rgba(15, 23, 42, 0.14);
}

.summary-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(234,179,8,.20), rgba(234,179,8,.06));
  color: #ca8a04;
  box-shadow: inset 0 1px 1px rgba(255,255,255,.5);
}

.summary-icon--muted {
  background: linear-gradient(135deg, rgba(20,184,166,.18), rgba(20,184,166,.06));
  color: var(--primary);
}

.summary-icon svg {
  width: 24px;
  height: 24px;
}

.summary-card h3 {
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .03em;
  margin: 0 0 6px;
}

.summary-card h1 {
  color: var(--text);
  font-size: 26px;
  font-weight: 700;
  margin: 0;
  line-height: 1;
  letter-spacing: -.02em;
}

.summary-card h1 .unit {
  font-size: 14px;
  color: var(--muted);
  font-weight: 500;
  margin-left: 2px;
}

/* ---------- Feedback grid (Premium) ---------- */

.feedback-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.feedback-card {
  position: relative;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 24px;
  border-radius: 18px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: transform .3s cubic-bezier(.22,1,.36,1),
              box-shadow .3s cubic-bezier(.22,1,.36,1);
}

.feedback-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), var(--primary-dark));
  opacity: 0;
  transition: opacity .3s ease;
}

.feedback-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 18px 30px -12px rgba(15, 23, 42, 0.16);
}

.feedback-card:hover::before {
  opacity: 1;
}

.feedback-card__head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.avatar {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  box-shadow: 0 6px 14px -4px rgba(20, 184, 166, .5);
}

.feedback-card h3 {
  color: var(--text);
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 700;
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-wrap: wrap;
}

.star {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--border);
  stroke-width: 1.5;
}

.star--filled {
  fill: #eab308;
  stroke: #eab308;
}

.rating-value {
  margin-left: 6px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 600;
}

.comment {
  color: var(--text);
  font-size: 14px;
  line-height: 1.6;
  font-style: italic;
  background: #f8fafc;
  border-radius: 12px;
  padding: 14px;
  margin: 0 0 14px;
  border: 1px solid var(--border);
  overflow-wrap: break-word;
}

.comment--empty {
  color: var(--muted);
}

.appointment-date {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 12px;
}

.appointment-date svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* ---------- Empty state ---------- */

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 60px 20px;
  border-radius: 20px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
  color: var(--muted);
}

.empty-state svg {
  width: 38px;
  height: 38px;
  opacity: .5;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .page {
    padding: 26px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .summary-card {
    padding: 20px;
  }

  .feedback-card {
    padding: 20px;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .page {
    padding: 22px;
  }

  .page-title {
    font-size: 26px;
  }

  .feedback-grid {
    grid-template-columns: 1fr;
  }

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .page {
    padding: 16px;
  }

  .page-title {
    font-size: 22px;
  }

  .summary {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 22px;
  }

  .summary-card {
    padding: 18px;
    border-radius: 16px;
    gap: 14px;
  }

  .summary-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }

  .summary-icon svg {
    width: 20px;
    height: 20px;
  }

  .summary-card h1 {
    font-size: 22px;
  }

  .feedback-card {
    padding: 18px;
    border-radius: 16px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    font-size: 13px;
  }

  .feedback-card h3 {
    font-size: 14px;
  }

  .comment {
    padding: 12px;
    font-size: 13px;
  }

  .empty-state {
    padding: 44px 16px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page {
    padding: 12px;
  }

  .page-title {
    font-size: 20px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .summary-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 16px;
  }

  .summary-card h1 {
    font-size: 21px;
  }

  .feedback-card {
    padding: 14px;
  }

  .feedback-card__head {
    gap: 10px;
    margin-bottom: 10px;
  }

  .rating {
    gap: 1px;
  }

  .star {
    width: 13px;
    height: 13px;
  }

  .rating-value {
    font-size: 11px;
  }

  .comment {
    padding: 11px;
    font-size: 12.5px;
    margin-bottom: 10px;
  }

  .appointment-date {
    font-size: 11px;
  }

}
@media (max-width:768px){

  .summary{
    grid-template-columns:repeat(2,1fr);
    gap:14px;
    margin-bottom:22px;
  }

  .summary-card{
    padding:16px;
    gap:12px;
  }

  .summary-icon{
    width:40px;
    height:40px;
  }

  .summary-icon svg{
    width:18px;
    height:18px;
  }

  .summary-card h3{
    font-size:11px;
  }

  .summary-card h1{
    font-size:22px;
  }

}
</style>