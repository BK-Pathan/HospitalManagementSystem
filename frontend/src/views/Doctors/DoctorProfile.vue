<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";


const name = ref("");
const department = ref("");
const profileImage = ref("");

const selectedImage = ref(null);



const specialties = ref("");
const qualifications = ref("");
const experience = ref("");
const contactInformation = ref("");

const availability = ref([]);

const day = ref("");
const startTime = ref("");
const endTime = ref("");




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
  <p class="eyebrow">Account</p>
  <h2 class="page-title">Doctor Profile</h2>
</div>


<div class="profile-card">

  <!-- =====================
  IDENTITY / AVATAR
  ===================== -->

  <div class="identity-section">

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
      <p>{{ department || "No department set" }}</p>
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


  <!-- =====================
  PROFILE FORM
  ===================== -->

  <h3 class="section-title">Profile Information</h3>

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
  Availability
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


  <button
  class="save-btn"
  @click="saveProfile"
  >
  <svg viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
  Save Profile
  </button>


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
  font-weight: 600;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: var(--primary);
  margin: 0 0 6px;
}

.page-title {
  color: var(--text);
  font-size: 30px;
  margin: 0;
  letter-spacing: -.01em;
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

/* ---------- Identity ---------- */

.identity-section {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-wrap: wrap;
  padding-bottom: 28px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--border);
}

.identity-info {
  flex: 1;
  min-width: 160px;
}

.identity-info h3 {
  margin: 0 0 4px;
  color: var(--text);
  font-size: 19px;
  font-weight: 700;
}

.identity-info p {
  margin: 0;
  color: var(--muted);
  font-size: 14px;
}

.identity-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.file-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #f8fafc;
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
  border-radius: 50%;
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
}

.doctor-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ---------- Form ---------- */

.section-title {
  margin: 0 0 20px;
  color: var(--text);
  font-size: 17px;
  font-weight: 700;
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
  transition: border-color .2s ease, box-shadow .2s ease;
}

.form-input:focus {
  border-color: var(--secondary);
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

.save-btn {
  margin-top: 30px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 22px -8px rgba(20, 184, 166, .45);
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

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .page-title {
    font-size: 22px;
  }

  .profile-card {
    padding: 18px;
    border-radius: 16px;
  }

  .identity-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .doctor-avatar {
    width: 72px;
    height: 72px;
    font-size: 26px;
  }

  .identity-actions {
    width: 100%;
  }

  .file-btn,
  .identity-actions .primary-btn,
  .identity-actions .remove-btn {
    flex: 1;
    justify-content: center;
  }

  .section-title {
    font-size: 15px;
    margin-bottom: 16px;
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

  .save-btn {
    width: 100%;
    justify-content: center;
    margin-top: 24px;
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

  .doctor-avatar {
    width: 64px;
    height: 64px;
    font-size: 22px;
  }

  .identity-info h3 {
    font-size: 17px;
  }

  .identity-actions {
    flex-direction: column;
  }

  .file-btn,
  .identity-actions .primary-btn,
  .identity-actions .remove-btn {
    width: 100%;
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