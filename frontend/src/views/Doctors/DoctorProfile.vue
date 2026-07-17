<script setup>
import { ref, onMounted } from "vue";
import api from "../../api/axios";

const name = ref("");
const specialties = ref("");
const qualifications = ref("");
const experience = ref("");
const contactInformation = ref("");

const availability = ref([]);

const day = ref("");
const startTime = ref("");
const endTime = ref("");

// Convert 24hr -> 12hr
const convertTo12Hour = (time) => {
  if (!time) return "";

  let [hour, minute] = time.split(":");

  hour = parseInt(hour);

  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
};

// Add availability slot
const addAvailability = () => {

  if (!day.value || !startTime.value || !endTime.value) {
    alert("Fill all fields");
    return;
  }

  availability.value.push({
    day: day.value,
    startTime: convertTo12Hour(startTime.value),
    endTime: convertTo12Hour(endTime.value),
  });

  day.value = "";
  startTime.value = "";
  endTime.value = "";
};

// Remove slot
const removeAvailability = (index) => {
  availability.value.splice(index, 1);
};

// Save profile
const saveProfile = async () => {

  try {

    await api.post("/doctor/profile", {

      name: name.value,

      specialties: specialties.value
        .split(",")
        .map((item) => item.trim()),

      qualifications: qualifications.value,

      experience: experience.value,

      contactInformation: contactInformation.value,

      availability: availability.value,

    });

    alert("Profile Saved");

  } catch (error) {
    console.log(error);
  }

};

// Load profile
const getProfile = async () => {

  try {

    const res = await api.get("/doctor/profile");

    if (!res.data) return;

    name.value = res.data.name || "";

    specialties.value = (res.data.specialties || []).join(",");

    qualifications.value = res.data.qualifications || "";

    experience.value = res.data.experience || "";

    contactInformation.value = res.data.contactInformation || "";

    availability.value = res.data.availability || [];

  } catch (error) {
    console.log(error);
  }

};

onMounted(() => {
  getProfile();
});
</script>

<template>

<div class="profile-page">


<h2 class="page-title">
Doctor Profile
</h2>




<div class="profile-card">


<div class="form-grid">



<input
class="form-input"
v-model="name"
placeholder="Name"
/>




<input
class="form-input"
v-model="specialties"
placeholder="Cardiologist, Dentist"
/>




<input
class="form-input"
v-model="qualifications"
placeholder="Qualification"
/>




<input
class="form-input"
v-model="experience"
placeholder="Experience"
/>




<input
class="form-input"
v-model="contactInformation"
placeholder="Contact"
/>




</div>





<h3 class="section-title">
Availability
</h3>





<div class="availability-form">


<select class="form-input" v-model="day">

<option value="">
Select Day
</option>

<option>Mon</option>
<option>Tue</option>
<option>Wed</option>
<option>Thu</option>
<option>Fri</option>
<option>Sat</option>
<option>Sun</option>

</select>





<input
class="form-input"
type="time"
v-model="startTime"
/>




<input
class="form-input"
type="time"
v-model="endTime"
/>





<button 
class="primary-btn"
@click="addAvailability"
>

Add Slot

</button>


</div>






<div class="table-card">


<table class="availability-table">


<tr>

<th>Day</th>

<th>Start</th>

<th>End</th>

<th>Action</th>

</tr>




<tr
v-for="(slot,index) in availability"
:key="index"
>


<td>{{ slot.day }}</td>

<td>{{ slot.startTime }}</td>

<td>{{ slot.endTime }}</td>




<td>


<button
class="remove-btn"
@click="removeAvailability(index)"
>

Remove

</button>



</td>


</tr>



</table>


</div>





<button 
class="save-btn"
@click="saveProfile"
>

Save Profile

</button>



</div>


</div>


</template>

<style scoped>


.profile-page{

    min-height:100%;

}




.page-title{

    color:var(--text);

    font-size:32px;

    margin-bottom:30px;

}





.profile-card{

    background:var(--white);

    padding:35px;

    border-radius:22px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);

}





.form-grid{

    display:grid;

    grid-template-columns:repeat(2,1fr);

    gap:20px;

}





.form-input{

    width:100%;

    padding:15px;

    border-radius:12px;

    border:1px solid var(--border);

    background:#f8fafc;

    font-size:15px;

    outline:none;

}





.form-input:focus{

    border-color:var(--secondary);

    box-shadow:0 0 0 4px rgba(20,184,166,.15);

}





.section-title{

    margin:30px 0 20px;

    color:var(--text);

}





.availability-form{

    display:grid;

    grid-template-columns:repeat(4,1fr);

    gap:15px;

    align-items:center;

}





.primary-btn,
.save-btn{

    border:none;

    padding:14px 20px;

    border-radius:12px;

    cursor:pointer;

    color:white;

    font-weight:700;

    background:linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

}





.table-card{

    margin-top:30px;

    overflow-x:auto;

}





.availability-table{

    width:100%;

    border-collapse:collapse;

}





.availability-table th{

    background:linear-gradient(
        135deg,
        var(--primary),
        var(--primary-dark)
    );

    color:white;

    padding:15px;

    text-align:left;

}





.availability-table td{

    padding:15px;

    border-bottom:1px solid var(--border);

    color:var(--text);

}





.remove-btn{

    padding:10px 15px;

    border:none;

    border-radius:10px;

    cursor:pointer;

    background:#fee2e2;

    color:#b91c1c;

    font-weight:700;

}





.save-btn{

    margin-top:30px;

    width:200px;

}





button:hover{

    transform:translateY(-2px);

}





@media(max-width:800px){


.form-grid{

    grid-template-columns:1fr;

}



.availability-form{

    grid-template-columns:1fr;

}


}


</style>