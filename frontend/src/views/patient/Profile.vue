<script setup>

import { ref, onMounted } from "vue";
import api from "../../api/axios";
const profilecompleted = ref(false);

const age = ref("");
const gender = ref("");
const contactInformation = ref("");
const medicalHistory = ref("");
const insuranceDetails = ref("");
const DescribeYourProblem = ref("");

const isEdit = ref(false);



const saveProfile = async()=>{

try{


await api.post("/patient/profile",{

age:age.value,
gender:gender.value,
contactInformation:contactInformation.value,
medicalHistory:medicalHistory.value,
insuranceDetails:insuranceDetails.value,
DescribeYourProblem:DescribeYourProblem.value,
profilecompleted: profilecompleted.value
});


alert("Profile Updated");


isEdit.value=false;


}catch(error){

console.log(error);

}

}




const getProfile = async()=>{


try{


const res = await api.get("/patient/profile");


if(res.data){

age.value = res.data.age || "";
gender.value = res.data.gender || "";
contactInformation.value = res.data.contactInformation || "";
medicalHistory.value = res.data.medicalHistory || "";
insuranceDetails.value = res.data.insuranceDetails || "";
DescribeYourProblem.value = res.data.DescribeYourProblem || "";
profilecompleted.value = res.data.profilecompleted || false;

}


}catch(error){

console.log(error);

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

            <h2>
                👤 My Profile
            </h2>

            <p>
                Complete your healthcare information and medical details
            </p>

        </div>



        <div class="badge">
            Patient Portal
        </div>


    </div>





    <div class="profile-card">


        <div class="section-title">

            <h3>
                Personal Information
            </h3>

        </div>




        <div class="form-grid">


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






        <div class="complete-box">


            <input 
            type="checkbox" 
            v-model="profilecompleted"
            />

            <span>
                Profile Completed
            </span>


        </div>







        <div class="actions">


            <button 
            v-if="!isEdit"
            class="edit-btn"
            @click="isEdit=true">

                ✏️ Edit Profile

            </button>





            <button 
            v-if="isEdit"
            class="update-btn"
            @click="saveProfile">

                Update Profile

            </button>


        </div>



    </div>



</div>


</template>

<style scoped>


.profile-page{

    min-height:100%;

}





.header{


    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:30px;


}




.header h2{


    color:var(--text);

    font-size:30px;


}




.header p{


    color:var(--muted);

    margin-top:8px;


}





.badge{


    padding:12px 20px;


    border-radius:30px;


    color:white;


    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );


    font-weight:700;


}






.profile-card{


    background:var(--white);


    padding:35px;


    border-radius:22px;


    box-shadow:var(--shadow);


    border:1px solid var(--border);


}





.section-title h3{


    color:var(--text);

    margin-bottom:25px;

}





.form-grid{


    display:grid;


    grid-template-columns:repeat(2,1fr);


    gap:25px;


}





.input-group{


    display:flex;


    flex-direction:column;


    gap:8px;


}



.full{


    grid-column:span 2;

}




label{


    font-weight:600;


    color:var(--text);


}




input,
textarea{


    width:100%;


    padding:15px;


    border-radius:12px;


    border:1px solid var(--border);


    background:#f8fafc;


    font-size:15px;


    outline:none;


    resize:none;


    transition:.3s;


}





textarea{


    min-height:120px;


}





input:focus,
textarea:focus{


    border-color:var(--secondary);


    box-shadow:

    0 0 0 4px rgba(20,184,166,.15);


}






input:disabled,
textarea:disabled{


    background:#f1f5f9;


    cursor:not-allowed;


}







.complete-box{


    margin-top:25px;


    display:flex;


    align-items:center;


    gap:10px;


    color:var(--text);


    font-weight:600;


}





.complete-box input{


    width:18px;


    height:18px;


}





.actions{


    margin-top:30px;


}




button{


    padding:14px 25px;


    border:none;


    border-radius:12px;


    cursor:pointer;


    font-weight:700;


    font-size:15px;


}





.edit-btn,
.update-btn{


    color:white;


    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );


}





button:hover{


    transform:translateY(-2px);


    box-shadow:0 10px 20px rgba(15,118,110,.25);


}







@media(max-width:800px){


.header{


    flex-direction:column;


    align-items:flex-start;


    gap:15px;


}



.form-grid{


    grid-template-columns:1fr;


}



.full{


    grid-column:span 1;


}



.profile-card{


    padding:20px;


}



}


</style>