<script setup>

import {ref} from "vue";
import api from "../api/axios";
import {useRouter} from "vue-router";


const router = useRouter();


const email = ref("");
const password = ref("");
const role = ref("patient");



const login = async()=>{


try{


const res = await api.post("/auth/login",{

    email: email.value,
    password: password.value,
    role: role.value

});



console.log("LOGIN RESPONSE:", res.data);



const userRole = res.data.user.role;



// save user data
localStorage.setItem(
    "user",
    JSON.stringify(res.data.user)
);


// save role
localStorage.setItem(
    "role",
    userRole
);



console.log(
    "SAVED ROLE:",
    localStorage.getItem("role")
);




// redirect according to role

if(userRole === "admin"){


    router.push("/admin");


}


else if(userRole === "doctor"){


    router.push("/doctor");


}


else {


    router.push("/patient");


}




}
catch(error){


console.log("FULL ERROR:",error);



if(error.response){


alert(error.response.data.message);


}

else{


alert("Backend server not reachable");


}



}



}



</script>



<template>

<div class="login-page">

    <div class="login-card">

        <!-- Left Side -->
        <div class="welcome-section">

            <div class="logo">
                🏥
            </div>

            <h1>
                Hospital Management
            </h1>

            <p>
                Manage healthcare services, appointments,
                doctors and patients from one secure platform.
            </p>


            <div class="features">

                <div>
                    ✔ Secure Patient Records
                </div>

                <div>
                    ✔ Doctor Management
                </div>

                <div>
                    ✔ Easy Appointment System
                </div>

            </div>

        </div>



        <!-- Right Side -->
        <div class="form-section">


            <h2>
                Welcome Back
            </h2>

            <p class="subtitle">
                Login to continue your healthcare journey
            </p>



            <div class="input-group">

                <label>
                    Email Address
                </label>

                <input
                v-model="email"
                placeholder="Enter your email"
                />

            </div>




            <div class="input-group">

                <label>
                    Password
                </label>

                <input

                type="password"

                v-model="password"

                placeholder="Enter your password"

                />

            </div>




            <div class="input-group">

                <label>
                    Login As
                </label>


                <select v-model="role">


                    <option value="patient">
                        Patient
                    </option>


                    <option value="doctor">
                        Doctor
                    </option>


                    <option value="admin">
                        Admin
                    </option>


                </select>


            </div>




            <button class="login-btn" @click="login">

                Login

            </button>



            <p class="signup-text">

                Don't have an account?

                <RouterLink to="/signup">
                    Create Account
                </RouterLink>

            </p>


        </div>


    </div>


</div>

</template>

<style>

.login-page{

    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;

    background:

    linear-gradient(
        rgba(15,118,110,.85),
        rgba(20,184,166,.85)
    ),

    var(--bg);

    padding:40px;

}



.login-card{

    width:100%;
    max-width:1000px;

    display:grid;
    grid-template-columns:1fr 1fr;

    background:var(--white);

    border-radius:25px;

    overflow:hidden;

    box-shadow:var(--shadow);

}




/* Left Section */


.welcome-section{


    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );

    color:white;

    padding:60px;

    display:flex;

    flex-direction:column;

    justify-content:center;


}



.logo{


    width:85px;

    height:85px;

    border-radius:50%;

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:38px;

    background:rgba(255,255,255,.2);

    margin-bottom:25px;


}



.welcome-section h1{

    font-size:38px;

    margin-bottom:15px;

}



.welcome-section p{


    line-height:1.8;

    opacity:.9;

    margin-bottom:35px;


}



.features div{


    margin-bottom:18px;

    font-size:15px;


}





/* Form Section */


.form-section{


    padding:60px;


}



.form-section h2{


    font-size:34px;

    color:var(--text);

}



.subtitle{


    color:var(--muted);

    margin:10px 0 35px;


}




.input-group{


    margin-bottom:22px;


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

    border-radius:12px;

    border:1px solid var(--border);

    background:#f8fafc;

    font-size:15px;

    outline:none;

    transition:.3s;


}



input:focus,
select:focus{


    border-color:var(--secondary);

    box-shadow:

    0 0 0 4px rgba(20,184,166,.15);


}




.login-btn{


    width:100%;

    padding:16px;

    border:none;

    border-radius:12px;


    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );


    color:white;

    font-size:17px;

    font-weight:700;

    cursor:pointer;

    transition:.3s;


}



.login-btn:hover{


    transform:translateY(-2px);

    box-shadow:0 12px 25px rgba(15,118,110,.35);


}




.signup-text{


    text-align:center;

    margin-top:25px;

    color:var(--muted);


}



.signup-text a{


    color:var(--primary);

    font-weight:700;

    text-decoration:none;


}



.signup-text a:hover{

    text-decoration:underline;

}




@media(max-width:850px){


.login-card{

    grid-template-columns:1fr;

}


.welcome-section{

    padding:40px;

    text-align:center;

}


.form-section{

    padding:35px;

}


}



</style>