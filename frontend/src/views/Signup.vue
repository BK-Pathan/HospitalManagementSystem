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

          <RouterLink to="/">
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

.signup-page{
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:
    linear-gradient(rgba(137, 179, 182, 0.85),rgba(20,184,166,.85)),
    url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80");
    background-size:cover;
    background-position:center;
    padding:40px;
}

.signup-card{

    width:100%;
    max-width:1050px;
    display:grid;
    grid-template-columns:1fr 1fr;
    background:var(--white);
    border-radius:22px;
    overflow:hidden;
    box-shadow:var(--shadow);

}

.left-section{

    background:linear-gradient(135deg,var(--primary),var(--secondary));
    color:var(--white);
    padding:60px;
    display:flex;
    flex-direction:column;
    justify-content:center;

}

.logo-circle{

    width:80px;
    height:80px;
    border-radius:50%;
    background:rgba(255,255,255,.2);
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:34px;
    margin-bottom:25px;

}

.left-section h1{

    font-size:38px;
    margin-bottom:15px;

}

.left-section p{

    opacity:.9;
    line-height:1.8;
    margin-bottom:35px;

}

.feature{

    margin-bottom:15px;
    font-size:15px;

}

.right-section{

    padding:55px;

}

.right-section h2{

    color:var(--text);
    font-size:34px;

}

.subtitle{

    color:var(--muted);
    margin:10px 0 35px;

}

.input-group{

    margin-bottom:20px;

}

label{

    display:block;
    margin-bottom:8px;
    font-weight:600;
    color:var(--text);

}

input,
select{

    width:100%;
    padding:15px;
    border:1px solid var(--border);
    border-radius:10px;
    outline:none;
    transition:.3s;
    font-size:15px;
    background:#FAFCFD;

}

input:focus,
select:focus{

    border-color:var(--secondary);
    box-shadow:0 0 0 4px rgba(20,184,166,.15);

}

.signup-btn{

    width:100%;
    margin-top:10px;
    padding:15px;
    border:none;
    border-radius:10px;
    background:linear-gradient(135deg,var(--primary),var(--secondary));
    color:white;
    font-size:16px;
    font-weight:600;
    cursor:pointer;
    transition:.3s;

}

.signup-btn:hover{

    transform:translateY(-2px);
    box-shadow:0 12px 25px rgba(20,184,166,.35);

}

.login-text{

    margin-top:25px;
    text-align:center;
    color:var(--muted);

}

.login-text a{

    color:var(--primary);
    text-decoration:none;
    font-weight:700;

}

.login-text a:hover{

    text-decoration:underline;

}

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