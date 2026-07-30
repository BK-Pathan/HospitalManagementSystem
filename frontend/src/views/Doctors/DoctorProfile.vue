<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";

console.log("🔥 DOCTOR Profile FILE LOADED");

const name = ref("");
const department = ref("");
const profileImage = ref("");

const selectedImage = ref(null);



const specialties = ref("");
const qualifications = ref("");
const experience = ref("");
const contactInformation = ref("");

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const availability = ref([]);

const day = ref("");
const startTime = ref("");
const endTime = ref("");


// mobile-only UI toggle (no backend / data change)
const showMobilePhotoActions = ref(false);




// =======================
// Convert 24hr -> 12hr
// =======================

const convertTo12Hour = (time) => {

if (!time) return "";

let [hour, minute] = time.split(":");

hour = parseInt(hour);

const ampm = hour >= 12 ? "PM" : "AM";

hour = hour % 12 || 12;

return `${hour}:${minute} ${ampm}`;

};




// =======================
// Select Image
// =======================

const handleImage=(event)=>{


const file = event.target.files[0];


if(!file) return;


selectedImage.value=file;


};





// =======================
// Upload Image
// =======================

const uploadImage = async()=>{


if(!selectedImage.value){

window.notify("Select image first");

return;

}



try{


const formData = new FormData();


formData.append(
"image",
selectedImage.value
);



const res = await api.post(

"/users/profile-image",

formData,

{

headers:{

"Content-Type":"multipart/form-data"

}

}

);



window.notify(
"Profile image updated"
);



getProfile();



}
catch(error){

console.log(
error.response?.data || error.message
);


}



};





// =======================
// Remove Image
// =======================

const removeImage = async()=>{


try{


await api.delete(
"/users/profile-image"
);



window.notify(
"Image removed"
);



profileImage.value="";



}
catch(error){

console.log(
error.response?.data || error.message
);


}


};






// =======================
// Add Availability
// =======================

const addAvailability = () => {


if (!day.value || !startTime.value || !endTime.value) {

window.notify("Fill all fields");

return;

}



availability.value.push({

day:day.value,

startTime:convertTo12Hour(startTime.value),

endTime:convertTo12Hour(endTime.value),

});



day.value="";

startTime.value="";

endTime.value="";

};






// Remove slot

const removeAvailability=(index)=>{

availability.value.splice(index,1);

};







// =======================
// Save Profile
// =======================

const saveProfile = async()=>{


try{


await api.post(

"/doctor/profile",

{


name:name.value,

department:department.value,
specialties:specialties.value
.split(",")
.map(item=>item.trim()),


qualifications:qualifications.value,


experience:experience.value,


contactInformation:contactInformation.value,


availability:availability.value,


}

);



window.notify(
"Profile Saved"
);



}
catch(error){


console.log(error);


}


};


// =======================
// Change Password
// =======================

const changePassword = async()=>{


if(
!oldPassword.value ||
!newPassword.value ||
!confirmPassword.value
){

window.notify(
"Fill all password fields",
"warning"
);

return;

}



if(
newPassword.value !== confirmPassword.value
){

window.notify(
"New passwords do not match",
"error"
);

return;

}



try{


const res = await api.put(

"/auth/change-password",

{

oldPassword:oldPassword.value,

newPassword:newPassword.value

}

);



window.notify(
res.data.message
);



oldPassword.value="";
newPassword.value="";
confirmPassword.value="";


}
catch(error){


console.log(
error.response?.data || error.message
);


window.notify(

error.response?.data?.message ||
"Password change failed",

"error"

);


}


};







// =======================
// Get Profile
// =======================

const getProfile = async()=>{


try{


const res = await api.get(
"/doctor/profile"
);



if(!res.data) return;



name.value =
res.data.name || "";

department.value =
res.data.department || "";

profileImage.value =
res.data.profileImage || "";



specialties.value =
(res.data.specialties || []).join(",");



qualifications.value =
res.data.qualifications || "";



experience.value =
res.data.experience || "";



contactInformation.value =
res.data.contactInformation || "";



availability.value =
res.data.availability || [];



}
catch(error){

console.log(error);

}


};




onMounted(()=>{

getProfile();

});


</script>

<template>

<div class="profile-page">

<div class="page-header">
  <p class="eyebrow">✦ Account</p>
  <h2 class="page-title">Doctor Profile</h2>
</div>


<div class="profile-card">

  <!-- =====================
  MOBILE IDENTITY CARD (reference-style)
  ===================== -->

  <div class="mobile-hero">

    <div class="mobile-hero-photo">

      <img
      v-if="profileImage"
      :src="profileImage"
      />

      <span v-else>
        {{
          name
          ?.replace(/^Dr\.?\s*/i, "")
          ?.charAt(0)
          ?.toUpperCase() || "D"
        }}
      </span>

      <button
      class="mobile-hero-edit"
      @click="showMobilePhotoActions = !showMobilePhotoActions"
      >
        <svg viewBox="0 0 24 24" fill="none"><path d="M12 20h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>

    </div>

    <span class="mobile-hero-badge" v-if="department">
      {{ department }}
    </span>

    <h3 class="mobile-hero-name">
      {{ name || "Your Name" }}
    </h3>

    <p class="mobile-hero-contact" v-if="contactInformation">
      {{ contactInformation }}
    </p>

    <transition name="expand">
      <div
      class="mobile-hero-photo-actions"
      v-if="showMobilePhotoActions"
      >

        <label class="file-btn">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Choose Image
          <input
          type="file"
          accept="image/*"
          @change="handleImage"
          />
        </label>

        <button
        class="primary-btn"
        @click="uploadImage"
        >
        Upload
        </button>

        <button
        v-if="profileImage"
        class="remove-btn"
        @click="removeImage"
        >
        Remove
        </button>

      </div>
    </transition>

    <div class="mobile-hero-tiles">

      <div class="hero-tile">
        <svg viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="hero-tile-value">{{ experience || "—" }}</span>
        <span class="hero-tile-label">Experience</span>
      </div>

      <div class="hero-tile">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h9M4 12h16M4 17h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span class="hero-tile-value">{{ qualifications || "—" }}</span>
        <span class="hero-tile-label">Qualification</span>
      </div>

      <div class="hero-tile">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span class="hero-tile-value">{{ availability.length }}</span>
        <span class="hero-tile-label">Slots</span>
      </div>

    </div>

  </div>


  <!-- =====================
  IDENTITY / AVATAR (Desktop, premium banner)
  ===================== -->

  <div class="identity-section">

    <div class="identity-banner"></div>

    <div class="identity-row">

      <div class="doctor-avatar">

        <img
        v-if="profileImage"
        :src="profileImage"
        />

        <span v-else>
          {{
            name
            ?.replace(/^Dr\.?\s*/i, "")
            ?.charAt(0)
            ?.toUpperCase() || "D"
          }}
        </span>

      </div>

      <div class="identity-info">
        <h3>{{ name || "Your Name" }}</h3>
        <p v-if="department" class="identity-dept">{{ department }}</p>
        <p v-else class="identity-dept identity-dept--muted">No department set</p>
        <p v-if="contactInformation" class="identity-contact">{{ contactInformation }}</p>
      </div>

      <div class="identity-actions">

        <label class="file-btn">
          <svg viewBox="0 0 24 24" fill="none"><path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Choose Image
          <input
          type="file"
          accept="image/*"
          @change="handleImage"
          />
        </label>

        <button
        class="primary-btn"
        @click="uploadImage"
        >
        Upload
        </button>

        <button
        v-if="profileImage"
        class="remove-btn"
        @click="removeImage"
        >
        Remove
        </button>

      </div>

    </div>

    <div class="identity-tiles">

      <div class="hero-tile">
        <svg viewBox="0 0 24 24" fill="none"><path d="M3 7h18M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="hero-tile-value">{{ experience || "—" }}</span>
        <span class="hero-tile-label">Experience</span>
      </div>

      <div class="hero-tile">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 7h9M4 12h16M4 17h9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span class="hero-tile-value">{{ qualifications || "—" }}</span>
        <span class="hero-tile-label">Qualification</span>
      </div>

      <div class="hero-tile">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <span class="hero-tile-value">{{ availability.length }}</span>
        <span class="hero-tile-label">Slots</span>
      </div>

    </div>

  </div>


  <!-- =====================
  PROFILE FORM
  ===================== -->

  <h3 class="section-title"><span class="section-icon">🪪</span> Profile Information</h3>

  <div class="form-grid">

    <div class="field">
      <label>Full Name</label>
      <input
      class="form-input"
      v-model="name"
      placeholder="Dr. John Doe"
      />
    </div>

    <div class="field">
      <label>Department</label>
      <select
      class="form-input"
      v-model="department"
      >

      <option value="">
      Select Department
      </option>

      <option>
          24/7 Emergency
      </option>

      <option>
      Cardiology
      </option>

      <option>
      Neurology
      </option>

      <option>
      Dermatology
      </option>

      <option>
      Orthopedics
      </option>

      <option>
      Pediatrics
      </option>

      <option>
      Gynecology
      </option>

      <option>
      General Medicine
      </option>

      <option>
      ENT
      </option>

      <option>
      Dental
      </option>

      </select>
    </div>

    <div class="field">
      <label>Specialties</label>
      <input
      class="form-input"
      v-model="specialties"
      placeholder="Cardiologist, Dentist"
      />
    </div>

    <div class="field">
      <label>Qualifications</label>
      <input
      class="form-input"
      v-model="qualifications"
      placeholder="MBBS, FCPS"
      />
    </div>

    <div class="field">
      <label>Experience</label>
      <input
      class="form-input"
      v-model="experience"
      placeholder="e.g. 8 years"
      />
    </div>

    <div class="field">
      <label>Contact Information</label>
      <input
      class="form-input"
      v-model="contactInformation"
      placeholder="Phone or email"
      />
    </div>

  </div>


  <!-- =====================
  AVAILABILITY
  ===================== -->

  <h3 class="section-title">
  <span class="section-icon">🗓️</span> Availability
  </h3>


  <div class="availability-form">


  <div class="field">
    <label>Day</label>
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
  </div>


  <div class="field">
    <label>Start Time</label>
    <input
    class="form-input"
    type="time"
    v-model="startTime"
    />
  </div>


  <div class="field">
    <label>End Time</label>
    <input
    class="form-input"
    type="time"
    v-model="endTime"
    />
  </div>


  <button
  class="primary-btn add-slot-btn"
  @click="addAvailability"
  >
  <svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
  Add Slot
  </button>


  </div>



  <div class="table-card">

    <table class="availability-table" v-if="availability.length">

    <thead>
    <tr>

    <th>Day</th>

    <th>Start</th>

    <th>End</th>

    <th>Action</th>

    </tr>
    </thead>


    <tbody>
    <tr
    v-for="(slot,index) in availability"
    :key="index"
    >


    <td><span class="day-pill">{{ slot.day }}</span></td>

    <td>{{ slot.startTime }}</td>

    <td>{{ slot.endTime }}</td>




    <td>


    <button
    class="remove-btn small"
    @click="removeAvailability(index)"
    >
    <svg viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    Remove
    </button>



    </td>


    </tr>
    </tbody>

    </table>

    <div class="empty-state" v-else>
      <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <p>No availability slots added yet.</p>
    </div>

  </div>

<!-- =====================
SECURITY
===================== -->

<h3 class="section-title">
<span class="section-icon">🔒</span> Security
</h3>


<div class="form-grid">


<div class="field">

<label>
Current Password
</label>

<input
class="form-input"
type="password"
v-model="oldPassword"
placeholder="Enter current password"
/>

</div>



<div class="field">

<label>
New Password
</label>

<input
class="form-input"
type="password"
v-model="newPassword"
placeholder="Enter new password"
/>

</div>



<div class="field">

<label>
Confirm New Password
</label>

<input
class="form-input"
type="password"
v-model="confirmPassword"
placeholder="Confirm new password"
/>

</div>



</div>


<div class="footer-actions">

<button
class="save-btn password-btn"
@click="changePassword"
>
<svg viewBox="0 0 24 24" fill="none"><rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
Change Password
</button>


  <button
  class="save-btn"
  @click="saveProfile"
  >
  <svg viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
  Save Profile
  </button>

</div>


</div>


</div>


</template>

<style scoped>

.profile-page {
  min-height: 100%;
}

.page-header {
  margin-bottom: 25px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--primary);
  margin: 0 0 6px;
}

.page-title {
  color: var(--text);
  font-size: 30px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -.02em;
}

/* ---------- Profile card (Premium) ---------- */

.profile-card {
  background: linear-gradient(180deg, #ffffff 0%, #fbfdfd 100%);
  padding: 35px;
  border-radius: 22px;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 8px 20px -8px rgba(15, 23, 42, 0.08);
  border: 1px solid var(--border);
}

/* ---------- Identity (Desktop, premium banner) ---------- */

.identity-section {
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid var(--border);
  margin-bottom: 30px;
  background: #f8fafc;
}

.identity-banner {
  height: 64px;
  background: linear-gradient(120deg, var(--primary-dark) 0%, var(--primary) 55%, var(--secondary) 100%);
}

.identity-row {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  padding: 0 22px 20px;
  margin-top: -34px;
}

.identity-info {
  flex: 1;
  min-width: 160px;
  padding-top: 38px;
}

.identity-info h3 {
  margin: 0 0 4px;
  color: var(--text);
  font-size: 19px;
  font-weight: 800;
}

.identity-dept {
  margin: 0 0 2px;
  color: var(--primary);
  font-size: 13px;
  font-weight: 700;
}

.identity-dept--muted {
  color: var(--muted);
  font-weight: 500;
}

.identity-contact {
  margin: 0;
  color: var(--muted);
  font-size: 13px;
}

.identity-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 38px;
}

.identity-tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 0 22px 22px;
}

.file-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #ffffff;
  color: var(--text);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease;
}

.file-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px -6px rgba(15, 23, 42, 0.15);
}

.file-btn svg {
  width: 16px;
  height: 16px;
}

.file-btn input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.doctor-avatar {
  width: 88px;
  height: 88px;
  min-width: 88px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 8px 18px -6px rgba(20, 184, 166, .5);
  border: 3px solid #fff;
  box-sizing: border-box;
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

/* ---------- Shared stat tiles (mobile hero + desktop identity) ---------- */

.hero-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 6px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid var(--border);
}

.hero-tile svg {
  width: 18px;
  height: 18px;
  color: var(--primary);
  margin-bottom: 2px;
}

.hero-tile-value {
  font-size: 13px;
  font-weight: 800;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.hero-tile-label {
  font-size: 10px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: .03em;
  font-weight: 700;
}

/* ---------- Mobile hero (reference-style, hidden on desktop) ---------- */

.mobile-hero {
  display: none;
}

/* ---------- Form ---------- */

.section-title {

    display: inline-flex;

    align-items: center;

    gap: 8px;

    padding: 8px 18px;

    margin: 24px 0 20px;

    color: var(--primary-dark);

    background: linear-gradient(135deg, rgba(20,184,166,.12), rgba(20,184,166,.06));

    border: 1px solid rgba(20,184,166,.22);

    border-radius: 50px;

    font-size: 15px;

    font-weight: 700;

    letter-spacing: .2px;

    box-shadow: 0 8px 18px -10px rgba(20,184,166,.3);

}

.section-title:first-of-type {
  margin-top: 0;
}

.section-icon {
  font-size: 15px;
  line-height: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 34px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.field label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .03em;
  color: var(--muted);
}

.form-input {
  width: 100%;
  padding: 14px 15px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #f8fafc;
  font-size: 15px;
  outline: none;
  font-family: inherit;
  color: var(--text);
  box-sizing: border-box;
  transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
}

.form-input:focus {
  border-color: var(--secondary);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(20, 184, 166, .15);
}

/* ---------- Availability ---------- */

.availability-form {
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 15px;
  align-items: end;
  margin-bottom: 24px;
}

.add-slot-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  margin: 0 !important;
}

.add-slot-btn svg {
  width: 16px;
  height: 16px;
}

.primary-btn,
.save-btn {
  border: none;
  padding: 14px 20px;
  border-radius: 12px;
  cursor: pointer;
  color: white;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  box-shadow: 0 8px 18px -6px rgba(20, 184, 166, .4);
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease;
}

.primary-btn {
  margin: 0;
}

.table-card {
  overflow-x: auto;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.availability-table {
  width: 100%;
  border-collapse: collapse;
}

.availability-table thead th {
  color: var(--muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
  font-weight: 700;
  text-align: left;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  background: transparent;
  white-space: nowrap;
}

.availability-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

.availability-table tbody tr {
  transition: background .2s ease;
}

.availability-table tbody tr:last-child td {
  border-bottom: none;
}

.availability-table tbody tr:hover {
  background: rgba(20, 184, 166, .06);
}

.day-pill {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(20, 184, 166, .15);
  color: var(--primary);
  font-weight: 700;
  font-size: 12px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 40px 20px;
  color: var(--muted);
}

.empty-state svg {
  width: 30px;
  height: 30px;
  opacity: .6;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.remove-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: #fee2e2;
  color: #b91c1c;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: transform .18s ease, background .18s ease;
}

.remove-btn svg {
  width: 14px;
  height: 14px;
}

.remove-btn:hover {
  background: #fecaca;
}

.remove-btn.small {
  padding: 8px 12px;
  font-size: 13px;
}

/* ---------- Footer actions (password + save, side by side) ---------- */

.footer-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 28px;
  flex-wrap: wrap;
}

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 0;
  box-shadow: 0 10px 22px -8px rgba(20, 184, 166, .45);
}

.password-btn {
  background: linear-gradient(135deg, var(--primary-dark), var(--text));
  box-shadow: 0 10px 22px -8px rgba(15, 23, 42, .35);
}

.save-btn svg {
  width: 16px;
  height: 16px;
}

button:hover {
  transform: translateY(-3px);
  filter: brightness(1.05);
}

button:active {
  transform: translateY(-1px);
}

/* expand transition (used by mobile photo actions) */

.expand-enter-active,
.expand-leave-active {
  transition: .25s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .profile-card {
    padding: 30px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .availability-form {
    grid-template-columns: repeat(3, 1fr);
  }

  .add-slot-btn {
    grid-column: span 3;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .page-title {
    font-size: 26px;
  }

  .profile-card {
    padding: 26px;
    border-radius: 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .availability-form {
    grid-template-columns: 1fr 1fr;
  }

  .add-slot-btn {
    grid-column: span 2;
  }

  .identity-row {
    padding: 0 18px 18px;
  }

  .identity-tiles {
    padding: 0 18px 18px;
  }

}

/* ==========================
   Mobile (reference-style hero card)
========================== */
@media (max-width: 768px) {

  .page-title {
    font-size: 22px;
  }

  .profile-card {
    padding: 18px;
    border-radius: 16px;
  }

  /* hide desktop identity row, show reference-style hero instead */

  .identity-section {
    display: none;
  }

  .mobile-hero {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding-bottom: 22px;
    margin-bottom: 22px;
    border-bottom: 1px solid var(--border);
  }

  .mobile-hero-photo {
    position: relative;
    width: 92px;
    height: 92px;
    border-radius: 28px;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34px;
    font-weight: 800;
    overflow: hidden;
    box-shadow: 0 10px 22px -8px rgba(20, 184, 166, .5);
  }

  .mobile-hero-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .mobile-hero-edit {
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid #fff;
    background: var(--white);
    color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow);
    cursor: pointer;
    padding: 0;
  }

  .mobile-hero-edit svg {
    width: 13px;
    height: 13px;
  }

  .mobile-hero-badge {
    margin-top: 14px;
    display: inline-flex;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(20, 184, 166, .12);
    color: var(--primary);
    font-size: 12px;
    font-weight: 700;
  }

  .mobile-hero-name {
    margin: 8px 0 0;
    font-size: 20px;
    font-weight: 800;
    color: var(--text);
  }

  .mobile-hero-contact {
    margin: 4px 0 0;
    font-size: 13px;
    color: var(--muted);
  }

  .mobile-hero-photo-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
    width: 100%;
  }

  .mobile-hero-photo-actions .file-btn,
  .mobile-hero-photo-actions .primary-btn,
  .mobile-hero-photo-actions .remove-btn {
    flex: 1;
    min-width: 100px;
    justify-content: center;
    padding: 10px 12px;
    font-size: 13px;
  }

  .mobile-hero-tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    width: 100%;
    margin-top: 18px;
  }

  .section-title {
    font-size: 14px;
    margin: 20px 0 16px;
    padding: 7px 15px;
  }

  .section-title:first-of-type {
    margin-top: 0;
  }

  .form-grid {
    gap: 16px;
    margin-bottom: 26px;
  }

  .form-input {
    padding: 12px 13px;
    font-size: 14px;
  }

  .availability-form {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .add-slot-btn {
    grid-column: span 1;
    width: 100%;
    justify-content: center;
  }

  .availability-table th,
  .availability-table td {
    padding: 12px 14px;
    font-size: 13px;
  }

  .footer-actions {
    flex-direction: column;
    margin-top: 24px;
  }

  .save-btn,
  .password-btn {
    width: 100%;
    justify-content: center;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .page-title {
    font-size: 20px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .profile-card {
    padding: 14px;
  }

  .mobile-hero-photo {
    width: 80px;
    height: 80px;
    font-size: 28px;
    border-radius: 24px;
  }

  .mobile-hero-name {
    font-size: 18px;
  }

  .hero-tile {
    padding: 10px 4px;
  }

  .hero-tile-value {
    font-size: 12px;
  }

  .availability-table {
    min-width: 480px;
  }

  .day-pill {
    font-size: 11px;
    padding: 4px 10px;
  }

  .remove-btn.small {
    padding: 7px 10px;
    font-size: 12px;
  }

}

</style>