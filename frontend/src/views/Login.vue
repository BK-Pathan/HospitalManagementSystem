<script setup>

import { ref } from "vue";
import api from "../api/axios";
import { useRouter } from "vue-router";
import socket from "../socket";


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



console.log(
"LOGIN RESPONSE:",
res.data
);



const user = res.data.user;

const userRole = user.role;



// Save User Data

localStorage.setItem(
    "user",
    JSON.stringify(user)
);



// Save Role

localStorage.setItem(
    "role",
    userRole
);





// =============================
// SOCKET CONNECTION
// =============================


socket.connect();



socket.emit(
    "joinRoom",
    user.id
);



console.log(
"Socket Room Joined:",
user.id
);






// Redirect According To Role


if(userRole === "admin"){


    router.push("/admin");


}


else if(userRole === "doctor"){


    router.push("/doctor");


}


else{


    router.push("/patient");


}



}
catch(error){



console.log(
"FULL ERROR:",
error
);




if(error.response){


alert(
error.response.data.message
);


}
else{


alert(
"Backend server not reachable"
);


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

    padding:40px;

    position:relative;

    overflow:hidden;


    background:

    linear-gradient(
        135deg,
        #eff6ff,
        #ffffff,
        #eef2ff
    );

}


/* soft water glow */

.login-page::before{

content:"";

position:absolute;

width:600px;

height:600px;

left:-200px;

top:-200px;


background:

radial-gradient(
circle,
rgba(59,130,246,.35),
transparent 70%
);


filter:blur(80px);


animation:

moveGlow 12s ease-in-out infinite alternate;


}


.login-page::after{

content:"";

position:absolute;

width:600px;

height:600px;

right:-200px;

bottom:-200px;


background:

radial-gradient(
circle,
rgba(96,165,250,.3),
transparent 70%
);


filter:blur(100px);


animation:

moveGlow2 15s ease-in-out infinite alternate;


}



@keyframes moveGlow{


from{

transform:translate(0,0);

}

to{

transform:translate(120px,80px);

}

}


@keyframes moveGlow2{


from{

transform:translate(0,0);

}

to{

transform:translate(-120px,-80px);

}

}





.login-card{


position:relative;

z-index:5;


width:100%;

max-width:1050px;


display:grid;

grid-template-columns:1fr 1fr;



background:

rgba(255,255,255,.55);



backdrop-filter:

blur(25px);


-webkit-backdrop-filter:

blur(25px);



border:

1px solid rgba(255,255,255,.6);



border-radius:30px;



overflow:hidden;



box-shadow:


0 30px 90px rgba(37,99,235,.15);



}




/* LEFT */


.welcome-section{


padding:60px;


display:flex;

flex-direction:column;

justify-content:center;



background:


linear-gradient(

135deg,

rgba(37,99,235,.95),

rgba(96,165,250,.85)

);



color:white;


}





.logo{


width:90px;

height:90px;


border-radius:50%;


display:flex;

justify-content:center;

align-items:center;


font-size:40px;


background:

rgba(255,255,255,.2);


backdrop-filter:

blur(15px);



box-shadow:


0 20px 40px rgba(0,0,0,.15);


margin-bottom:30px;


}




.welcome-section h1{


font-size:38px;


line-height:1.2;


margin-bottom:20px;


}




.welcome-section p{


font-size:16px;


line-height:1.8;


color:rgba(255,255,255,.85);


}




.features div{


margin-top:18px;


font-size:15px;


}




/* RIGHT FORM */


.form-section{


padding:60px;


background:

rgba(255,255,255,.45);


}



.form-section h2{


font-size:36px;


color:#0f172a;


}



.subtitle{


color:#64748b;

margin:10px 0 35px;


}




.input-group{


margin-bottom:22px;


}



label{


display:block;

margin-bottom:8px;


font-weight:600;


color:#334155;


}



input,
select{


width:100%;


padding:15px 18px;


border-radius:14px;


border:

1px solid rgba(148,163,184,.3);



background:

rgba(255,255,255,.7);



font-size:15px;


outline:none;


transition:.3s;


}



input:focus,
select:focus{


border-color:#2563eb;



box-shadow:


0 0 0 5px rgba(37,99,235,.12);


}




.login-btn{


width:100%;


padding:16px;


border:none;


border-radius:15px;



background:


linear-gradient(

135deg,

#2563eb,

#60a5fa

);



color:white;


font-size:17px;


font-weight:700;


cursor:pointer;


box-shadow:


0 15px 35px rgba(37,99,235,.25);



transition:.35s;


}



.login-btn:hover{


transform:

translateY(-4px);


box-shadow:


0 25px 50px rgba(37,99,235,.35);


}




.signup-text{


text-align:center;


margin-top:25px;


color:#64748b;


}



.signup-text a{


color:#2563eb;


font-weight:700;


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