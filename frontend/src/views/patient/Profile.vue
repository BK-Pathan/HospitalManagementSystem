<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";
const profilecompleted = ref(false);


const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const name = ref("");
const email = ref("");
const age = ref("");
const gender = ref("");
const contactInformation = ref("");
const medicalHistory = ref("");
const insuranceDetails = ref("");
const DescribeYourProblem = ref("");

const isEdit = ref(false);
const profileExists = ref(false);
const profileImage = ref("");
const selectedImage = ref(null);

// Select Image
const handleImage = (event) => {

  const file = event.target.files[0];

  if (!file) return;

  selectedImage.value = file;

};

// Upload Image
const uploadImage = async () => {

  if (!selectedImage.value) {
    window.notify("Select image first");
    return;
  }

  try {

    const formData = new FormData();

    formData.append("image", selectedImage.value);

    await api.post(
      "/users/profile-image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

   window.notify ("Profile image updated");

    getProfile();

  } catch (error) {

    console.log(error.response?.data || error.message);

  }

};

// Remove Image
const removeImage = async () => {

  try {

    await api.delete("/users/profile-image");

    profileImage.value = "";

    window.notify("Profile image removed");

  } catch (error) {

    console.log(error.response?.data || error.message);

  }

};

const saveProfile = async () => {

  try {

    await api.post("/patient/profile", {

      age: age.value,
      gender: gender.value,
      contactInformation: contactInformation.value,
      medicalHistory: medicalHistory.value,
      insuranceDetails: insuranceDetails.value,
      DescribeYourProblem: DescribeYourProblem.value,
      profilecompleted: profilecompleted.value

    });

 window.notify   ("Profile Updated Successfully");

    profileExists.value = true;

    await getProfile();

    isEdit.value = false;

  } catch (error) {

    console.log(error.response?.data || error);

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


const getProfile = async()=>{


try{


const res = await api.get("/patient/profile");


if(res.data){


profileExists.value = true;


name.value = res.data.user?.name || "";

email.value = res.data.user?.email || "";

profileImage.value = res.data.user?.profileImage || "";

age.value = res.data.age || "";

gender.value = res.data.gender || "";

contactInformation.value = res.data.contactInformation || "";

medicalHistory.value = res.data.medicalHistory || "";

insuranceDetails.value = res.data.insuranceDetails || "";

DescribeYourProblem.value = res.data.DescribeYourProblem || "";

profilecompleted.value = res.data.profilecompleted || false;


}



}
catch(error){


console.log(error);


// agar profile nahi mili to first time user hai

profileExists.value = false;

isEdit.value = true;


}


}



onMounted(()=>{

getProfile();

});


</script>

<template>

<div class="profile-page">


    <div class="header">


        <div>

            <p class="eyebrow">✦ Patient Portal</p>

            <h2>
                My Profile
            </h2>

            <p class="subtext">
                Complete your healthcare information and medical details
            </p>

        </div>



        <div class="badge" :class="{ 'badge--done': profilecompleted }">
            <span class="badge-dot" :class="{ 'badge-dot--done': profilecompleted }"></span>
            {{ profilecompleted ? "Profile Complete" : "Profile Incomplete" }}
        </div>


    </div>



    <div class="avatar-card">

        <div class="avatar-banner"></div>

        <div class="avatar-card-body">

            <div class="patient-avatar">

              <div class="avatar-ring">
                <img
                  v-if="profileImage"
                  :src="profileImage"
                  alt="Profile"
                />

                <span v-else>
                  {{ name?.charAt(0)?.toUpperCase() }}
                </span>
              </div>

            </div>

            <div class="avatar-info">

                <h3>{{ name || "Patient" }}</h3>
                <p class="avatar-email">✉️ {{ email }}</p>

                <div class="image-controls">

                    <label class="file-label">
                        📷 Choose Image
                        <input
                          type="file"
                          accept="image/*"
                          @change="handleImage"
                        />
                    </label>

                    <div class="image-actions">

                      <button
                        class="update-btn small-btn"
                        @click="uploadImage"
                      >
                        ⬆️ Upload
                      </button>

                      <button
                        v-if="profileImage"
                        class="remove-btn small-btn"
                        @click="removeImage"
                      >
                        🗑️ Remove
                      </button>

                    </div>

                </div>

            </div>

        </div>

    </div>

    <div class="profile-card">


        <div class="section-title">

            <span class="section-icon">🪪</span>

            <h3>
                Personal Information
            </h3>

        </div>

        <div class="form-grid">

        <div class="input-group">

        <label>
        Name
        </label>

        <input
        v-model="name"
        disabled
        />

        </div>



        <div class="input-group">

        <label>
        Email
        </label>

        <input
        v-model="email"
        disabled
        />

        </div>


            <div class="input-group">

                <label>
                    Age
                </label>


                <input
                placeholder="Enter age"
                v-model="age"
                :disabled="!isEdit"
                />

            </div>





            <div class="input-group">

                <label>
                    Gender
                </label>


                <input
                placeholder="Enter gender"
                v-model="gender"
                :disabled="!isEdit"
                />

            </div>





            <div class="input-group">

                <label>
                    Contact Information
                </label>


                <input
                placeholder="Enter contact"
                v-model="contactInformation"
                :disabled="!isEdit"
                />

            </div>




            <div class="input-group full">

                <label>
                    Describe Your Problem
                </label>


                <textarea
                placeholder="Describe your health problem"
                v-model="DescribeYourProblem"
                :disabled="!isEdit">
                </textarea>

            </div>





            <div class="input-group full">

                <label>
                    Medical History
                </label>


                <textarea
                placeholder="Enter medical history"
                v-model="medicalHistory"
                :disabled="!isEdit">
                </textarea>


            </div>





            <div class="input-group full">

                <label>
                    Insurance Details
                </label>


                <textarea
                placeholder="Enter insurance details"
                v-model="insuranceDetails"
                :disabled="!isEdit">
                </textarea>


            </div>



        </div>



        <label class="complete-box" :class="{ 'complete-box--active': profilecompleted }">

            <input 
            type="checkbox" 
            v-model="profilecompleted"
            />

            <span class="complete-box-text">
                <strong>Mark profile as completed</strong>
                <small>Doctors can see your profile is fully filled out</small>
            </span>

        </label>



        <div class="divider"></div>


<!-- =====================
SECURITY
===================== -->

<div class="section-title">

    <span class="section-icon">🔒</span>

    <h3>
        Security
    </h3>

</div>


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


<button
class="save-btn password-btn"
@click="changePassword"
>

🔑 Change Password

</button>


        <div class="actions">


<button 
v-if="!isEdit && profileExists"
class="edit-btn"
@click="isEdit=true">

✏️ Edit Profile

</button>





            <button 
            v-if="isEdit"
            class="update-btn"
            @click="saveProfile">

                ✅ Update Profile

            </button>


        </div>



    </div>



</div>


</template>

<style scoped>

.profile-page {
  --clinical-navy: #0F2A43;
  --clinical-teal: #0D9488;
  --clinical-teal-light: #CCFBF1;
  --clinical-bg: #F4F7FA;
  --clinical-surface: #FFFFFF;
  --clinical-border: #E2E8F0;
  --clinical-text: #1E293B;
  --clinical-text-muted: #64748B;
  --clinical-amber: #D97706;
  --clinical-amber-light: #FEF3C7;
  --clinical-green: #16A34A;
  --clinical-green-light: #DCFCE7;
  --clinical-red: #DC2626;
  --clinical-red-light: #FEE2E2;

  min-height: 100%;
  padding: 24px 28px;
  background:
    radial-gradient(1200px 300px at 100% -10%, rgba(13,148,136,0.06), transparent),
    var(--clinical-bg);
  font-family: -apple-system, "Segoe UI", Roboto, Inter, Arial, sans-serif;
  color: var(--clinical-text);
}

/* ---------- Header ---------- */

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 22px;
  gap: 14px;
  flex-wrap: wrap;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: .1em;
  font-size: 12px;
  font-weight: 700;
  color: var(--clinical-teal);
  margin: 0 0 8px;
}

.header h2 {
  color: var(--clinical-navy);
  font-size: 27px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -.02em;
}

.header .subtext {
  color: var(--clinical-text-muted);
  margin-top: 6px;
  font-size: 14px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 20px;
  border-radius: 999px;
  color: var(--clinical-amber);
  background: var(--clinical-amber-light);
  border: 1px solid rgba(217, 119, 6, .18);
  font-weight: 700;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 4px 12px -6px rgba(217, 119, 6, .3);
}

.badge--done {
  color: var(--clinical-green);
  background: var(--clinical-green-light);
  border-color: rgba(22, 163, 74, .18);
  box-shadow: 0 4px 12px -6px rgba(22, 163, 74, .3);
}

.badge-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--clinical-amber);
  box-shadow: 0 0 0 4px rgba(217, 119, 6, .18);
  animation: pulse 2s infinite;
}

.badge-dot--done {
  background: var(--clinical-green);
  box-shadow: 0 0 0 4px rgba(22, 163, 74, .18);
  animation: none;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .4; }
}

/* ---------- Avatar card (Premium, with banner) ---------- */

.avatar-card {
  background: var(--clinical-surface);
  border: 1px solid var(--clinical-border);
  border-radius: 20px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 10px 24px -12px rgba(15, 42, 67, 0.12);
}

.avatar-banner {
  height: 72px;
  background: linear-gradient(120deg, var(--clinical-navy) 0%, #163f63 45%, var(--clinical-teal) 100%);
}

.avatar-card-body {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px 22px;
  margin-top: -40px;
}

.patient-avatar {
  flex-shrink: 0;
}

.avatar-ring {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, var(--clinical-teal), var(--clinical-navy));
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 22px -8px rgba(15, 42, 67, .45);
}

.avatar-ring img,
.avatar-ring span {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--clinical-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring img {
  object-fit: cover;
  background: #fff;
}

.avatar-ring span {
  color: var(--clinical-navy);
  font-size: 32px;
  font-weight: 800;
}

.avatar-info {
  padding-top: 44px;
  min-width: 0;
}

.avatar-info h3 {
  margin: 0 0 3px;
  color: var(--clinical-navy);
  font-size: 18px;
  font-weight: 800;
}

.avatar-email {
  margin: 0 0 14px;
  color: var(--clinical-text-muted);
  font-size: 13px;
}

.image-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.file-label {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 16px;
  border-radius: 9px;
  border: 1px solid var(--clinical-border);
  background: var(--clinical-bg);
  color: var(--clinical-text);
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  box-sizing: border-box;
  cursor: pointer;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

.file-label:hover {
  transform: translateY(-2px);
  border-color: var(--clinical-teal);
  box-shadow: 0 6px 14px -6px rgba(15, 42, 67, .25);
}

.file-label input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.image-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.small-btn {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 16px !important;
  margin: 0;
  font-size: 13px !important;
  line-height: 1;
  box-sizing: border-box;
  transform: none !important;
}

/* ---------- Profile card (Premium) ---------- */

.profile-card {
  background: var(--clinical-surface);
  padding: 30px;
  border-radius: 20px;
  box-shadow:
    0 1px 2px rgba(15, 42, 67, 0.04),
    0 10px 24px -12px rgba(15, 42, 67, 0.12);
  border: 1px solid var(--clinical-border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 20px;
}

.section-title h3 {
  color: var(--clinical-navy);
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.section-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--clinical-teal-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, var(--clinical-border), transparent);
  margin: 28px 0 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.input-group,
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.full {
  grid-column: span 2;
}

label {
  font-weight: 700;
  color: var(--clinical-text-muted);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: .04em;
}

input,
textarea {
  width: 100%;
  padding: 13px 14px;
  border-radius: 11px;
  border: 1px solid var(--clinical-border);
  background: var(--clinical-bg);
  font-size: 14px;
  font-family: inherit;
  color: var(--clinical-text);
  outline: none;
  resize: none;
  box-sizing: border-box;
  transition: .2s;
}

textarea {
  min-height: 110px;
}

input:focus,
textarea:focus {
  border-color: var(--clinical-teal);
  background: var(--clinical-surface);
  box-shadow: 0 0 0 4px rgba(13, 148, 136, .12);
}

input:disabled,
textarea:disabled {
  background: #F1F5F9;
  color: var(--clinical-text-muted);
  cursor: not-allowed;
}

/* ---------- Complete checkbox (Premium row) ---------- */

.complete-box {
  margin-top: 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 14px;
  background: var(--clinical-bg);
  border: 1px solid var(--clinical-border);
  color: var(--clinical-text);
  cursor: pointer;
  text-transform: none;
  transition: border-color .2s ease, background .2s ease;
}

.complete-box--active {
  background: var(--clinical-teal-light);
  border-color: rgba(13, 148, 136, .25);
}

.complete-box input {
  width: 20px;
  height: 20px;
  accent-color: var(--clinical-teal);
  flex-shrink: 0;
}

.complete-box-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.complete-box-text strong {
  font-size: 14px;
  font-weight: 700;
  color: var(--clinical-navy);
}

.complete-box-text small {
  font-size: 12px;
  color: var(--clinical-text-muted);
  font-weight: 500;
}

/* ---------- Buttons (Premium) ---------- */

.actions {
  margin-top: 26px;
}

button {
  padding: 13px 26px;
  border: none;
  border-radius: 11px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  color: white;
  transition: transform .18s cubic-bezier(.22,1,.36,1),
              box-shadow .18s ease,
              filter .18s ease;
}

.edit-btn,
.update-btn {
  background: linear-gradient(135deg, var(--clinical-teal), #0b7a70);
  box-shadow: 0 8px 18px -6px rgba(13, 148, 136, .4);
}

.remove-btn {
  background: linear-gradient(135deg, var(--clinical-red), #b91c1c);
  box-shadow: 0 8px 18px -6px rgba(220, 38, 38, .35);
}

.password-btn {
  margin-top: 22px;
  background: linear-gradient(135deg, var(--clinical-navy), #1a3a5c);
  box-shadow: 0 8px 18px -6px rgba(15, 42, 67, .4);
}

button:hover {
  transform: translateY(-3px);
  filter: brightness(1.06);
  box-shadow: 0 14px 24px -8px rgba(15, 42, 67, .3);
}

button:active {
  transform: translateY(-1px);
}

/* ==========================
   Large Laptop
========================== */
@media (max-width: 1400px) {

  .profile-page {
    padding: 22px 24px;
  }

}

/* ==========================
   Laptop
========================== */
@media (max-width: 1200px) {

  .profile-card {
    padding: 26px;
  }

}

/* ==========================
   Tablet
========================== */
@media (max-width: 992px) {

  .profile-page {
    padding: 18px;
  }

  .header h2 {
    font-size: 23px;
  }

}

/* ==========================
   Mobile
========================== */
@media (max-width: 768px) {

  .profile-page {
    padding: 14px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 18px;
  }

  .badge {
    width: 100%;
    justify-content: center;
  }

  .header h2 {
    font-size: 21px;
  }

  .avatar-banner {
    height: 56px;
  }

  .avatar-card-body {
    flex-direction: column;
    text-align: center;
    padding: 0 18px 20px;
    margin-top: -36px;
    gap: 10px;
  }

  .avatar-ring {
    width: 80px;
    height: 80px;
  }

  .avatar-ring span {
    font-size: 26px;
  }

  .avatar-info {
    padding-top: 0;
  }

  .image-controls {
    justify-content: center;
  }

  .profile-card {
    padding: 18px;
    border-radius: 16px;
  }

  .section-title h3 {
    font-size: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .full {
    grid-column: span 1;
  }

  input,
  textarea {
    padding: 12px 13px;
    font-size: 13.5px;
  }

  textarea {
    min-height: 90px;
  }

  .actions button,
  .password-btn {
    width: 100%;
  }

  .divider {
    margin: 22px 0 20px;
  }

}

/* ==========================
   Small Mobile
========================== */
@media (max-width: 480px) {

  .profile-page {
    padding: 10px;
  }

  .header h2 {
    font-size: 19px;
  }

  .eyebrow {
    font-size: 11px;
  }

  .avatar-card-body {
    padding: 0 14px 16px;
  }

  .avatar-ring {
    width: 68px;
    height: 68px;
  }

  .avatar-ring span {
    font-size: 22px;
  }

  .profile-card {
    padding: 14px;
  }

  .section-icon {
    width: 30px;
    height: 30px;
    font-size: 14px;
  }

  .image-actions {
    width: 100%;
    justify-content: center;
  }

  .complete-box {
    padding: 13px 14px;
  }

  button {
    padding: 12px 20px;
    font-size: 13px;
  }

}

</style>