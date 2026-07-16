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

<div>

<h2>Doctor Profile</h2>

<input
v-model="name"
placeholder="Name"
/>

<input
v-model="specialties"
placeholder="Cardiologist, Dentist"
/>

<input
v-model="qualifications"
placeholder="Qualification"
/>

<input
v-model="experience"
placeholder="Experience"
/>

<input
v-model="contactInformation"
placeholder="Contact"
/>

<h3>Availability</h3>

<select v-model="day">

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
type="time"
v-model="startTime"
/>

<input
type="time"
v-model="endTime"
/>

<button @click="addAvailability">
Add Slot
</button>

<br><br>

<table border="1">

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
@click="removeAvailability(index)"
>
Remove
</button>

</td>

</tr>

</table>

<br>

<button @click="saveProfile">
Save Profile
</button>

</div>

</template>