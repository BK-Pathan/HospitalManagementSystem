<script setup>

import {ref} from "vue";
import api from "../api/axios";
import {useRouter} from "vue-router";


const router = useRouter();


const name = ref("");
const email = ref("");
const password = ref("");
const role = ref("patient");


const signup = async()=>{


try{


const res = await api.post("/auth/register",{

name:name.value,
email:email.value,
password:password.value,
role:role.value

});


console.log(res.data);


alert("Signup successful");


router.push("/");


}
catch(error){

console.log(error.response.data);

alert(error.response.data.message);

}


}


</script>



<template>
  <div class="signup-page">
    <div class="overlay"></div>

    <div class="signup-card">
      <div class="left-section">
        <div class="logo-circle">
          ❤️
        </div>

        <h1>Hospital Management</h1>
        <p>
          Create your account to access appointments, doctors,
          and healthcare services with ease.
        </p>

        <div class="features">
          <div class="feature">
            ✔ Secure Authentication
          </div>

          <div class="feature">
            ✔ Easy Appointment Booking
          </div>

          <div class="feature">
            ✔ Patient & Doctor Portal
          </div>
        </div>
      </div>

      <div class="right-section">

        <h2>Create Account</h2>
        <p class="subtitle">
          Join our healthcare platform
        </p>

        <div class="input-group">
          <label>Full Name</label>
          <input
            v-model="name"
            placeholder="Enter your full name"
          />
        </div>

        <div class="input-group">
          <label>Email</label>
          <input
            v-model="email"
            placeholder="Enter your email"
          />
        </div>

        <div class="input-group">
          <label>Password</label>
          <input
            type="password"
            v-model="password"
            placeholder="Enter password"
          />
        </div>

        <div class="input-group">
          <label>Register As</label>

          <select v-model="role">
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button class="signup-btn" @click="signup">
          Create Account
        </button>

        <p class="login-text">
          Already have an account?

          <RouterLink to="/login">
            Login
          </RouterLink>
        </p>

      </div>
    </div>
  </div>
</template>

<style scoped>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Inter,sans-serif;
}


/* =========================
      PAGE
========================= */

.signup-page{

    min-height:100vh;

    display:flex;

    justify-content:center;

    align-items:center;

    padding:40px;

    position:relative;

    background:transparent;

}


/* =========================
      CARD
========================= */


.signup-card{

    width:100%;

    max-width:1050px;

    display:grid;

    grid-template-columns:1fr 1fr;

    background:

    rgba(255,255,255,.55);

    backdrop-filter:blur(25px);

    -webkit-backdrop-filter:blur(25px);


    border:

    1px solid rgba(255,255,255,.5);


    border-radius:28px;


    overflow:hidden;


    box-shadow:

    0 30px 80px rgba(15,23,42,.12);


}



/* =========================
      LEFT
========================= */


.left-section{


    padding:60px;


    display:flex;

    flex-direction:column;

    justify-content:center;


    color:white;


    background:


    linear-gradient(

    135deg,

    rgba(37,99,235,.9),

    rgba(6,182,212,.85)

    );


}



.logo-circle{


    width:85px;

    height:85px;


    border-radius:50%;


    display:flex;

    align-items:center;

    justify-content:center;


    font-size:38px;


    background:

    rgba(255,255,255,.2);


    backdrop-filter:blur(10px);


    margin-bottom:25px;


    box-shadow:

    0 15px 40px rgba(0,0,0,.15);


}



.left-section h1{


    font-size:38px;

    margin-bottom:15px;


}



.left-section p{


    line-height:1.8;

    opacity:.9;

    margin-bottom:35px;


}



.feature{


    margin-bottom:18px;

    font-size:15px;


}




/* =========================
      RIGHT FORM
========================= */


.right-section{


    padding:55px;


    background:

    rgba(255,255,255,.45);


}



.right-section h2{


    font-size:34px;

    color:#0f172a;


}



.subtitle{


    color:#64748b;

    margin:

    10px 0 35px;


}



.input-group{


    margin-bottom:20px;


}



label{


    display:block;


    margin-bottom:8px;


    font-weight:600;


    color:#0f172a;


}



input,
select{


    width:100%;


    padding:15px;


    border-radius:14px;


    border:

    1px solid rgba(148,163,184,.35);


    outline:none;


    background:

    rgba(255,255,255,.7);


    font-size:15px;


    transition:.3s;


}



input:focus,
select:focus{


    border-color:#2563eb;


    box-shadow:


    0 0 0 4px rgba(37,99,235,.15);


}





/* =========================
      BUTTON
========================= */


.signup-btn{


    width:100%;


    margin-top:10px;


    padding:16px;


    border:none;


    border-radius:14px;


    cursor:pointer;


    color:white;


    font-size:16px;


    font-weight:700;



    background:


    linear-gradient(

    135deg,

    #2563eb,

    #06b6d4

    );


    transition:.35s;


}



.signup-btn:hover{


    transform:

    translateY(-3px);


    box-shadow:


    0 20px 40px rgba(37,99,235,.35);


}




/* =========================
      LOGIN LINK
========================= */


.login-text{


    text-align:center;


    margin-top:25px;


    color:#64748b;


}



.login-text a{


    color:#2563eb;


    text-decoration:none;


    font-weight:700;


}



/* =========================
      GLASS SHINE
========================= */


.signup-card::before{


content:"";


position:absolute;


width:300px;


height:300px;


background:


radial-gradient(

circle,

rgba(255,255,255,.5),

transparent 70%

);


top:-100px;


right:-100px;


pointer-events:none;


}




/* =========================
      RESPONSIVE
========================= */


@media(max-width:850px){


.signup-card{


grid-template-columns:1fr;


}



.left-section{


padding:40px;

text-align:center;


}



.right-section{


padding:35px;


}


}



</style>