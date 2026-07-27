<script setup>

import {computed} from "vue";
import {useRouter} from "vue-router";
import api from "../api/axios";

const role = computed(() => localStorage.getItem("role"));

const router = useRouter();

// Logout function
const logout = async()=>{

    try{

        await api.post("/auth/logout");


        // remove frontend data
        localStorage.removeItem("user");
        localStorage.removeItem("role");


        // redirect login
        router.push("/");


    }
    catch(error){

        console.log("Logout Error:", error);

    }

};

const menu = computed(()=>{
    const currentRole = role.value;


if(currentRole=== "admin"){

return [

{
name:"📊 Dashboard",
path:"/admin"
},

{
name:"👨‍⚕️ Doctors",
path:"/admin/doctors"
},

{
name:"🧑 Patients",
path:"/admin/patients"
},

{
name:"📅 Appointments",
path:"/admin/appointments"
},
{
name:"👥 Users",
path:"/admin/users"
},
{
    name:"🧑‍🤝‍🧑Patient Profile",
    path:"/admin/patientprofile",
},
{
name:"👤 Admin Profile",
path:"/admin/profile"
},
// {
//     name:"AdminRooms",
//      path:"/admin/rooms",
// },
// {
//      name:"AdminBeds",
//       path:"/admin/beds",
// },
// {
//     name:"AdminAdmissions",
//      path:"/admin/admissions",
// }


]

}



if(currentRole==="patient"){

return [

{
name:"🏠 Dashboard",
path:"/patient"
},

{
name:"👤 Profile",
path:"/patient/profile"
},

{
name:"👨‍⚕️ Doctors",
path:"/patient/doctors"
},

// {
// name:"📅 Book Appointment",
// path:"/patient/doctors"
// },

{
name:"📅 My Appointments",
path:"/patient/appointments"
},
{
    name:"💊 Prescription History",
    path:"/patient/prescriptions",
}


]

}




if(currentRole==="doctor"){

return [

{
name:"🏠 Dashboard",
path:"/doctor"
},

{
name:"📅 Appointments",
path:"/doctor/appointments"
},

{
name:"👤 Profile",
path:"/doctor/profile"
},
{
    name:"Feedback",
    path:"/doctor/feedback"
},
{
    name:"🔄 Reschedule Requests",
    path:"/doctor/reschedule-requests"
},
// {
//     name:"DoctorAdmissions",
//     path:"/doctor/admissions",
// }



]

}



return [];


});



</script>




<template>

<div class="sidebar">


    <div class="brand">

        <div class="logo-icon">
            🏥
        </div>


        <div>
            <h2>
                Hospital
            </h2>

            <p>
                Management System
            </p>
        </div>

    </div>




    <div class="menu">


        <router-link

        v-for="item in menu"

        :key="item.path"

        :to="item.path"

        class="menu-item"

        >

            <span>
                {{item.name}}
            </span>


        </router-link>


    </div>




    <button
    class="logout"
    @click="logout"
    >

        🚪 Logout

    </button>


</div>

</template>




<style scoped>

.sidebar{

    width:270px;
    height:100vh;

    position:fixed;
    left:0;
    top:0;

    z-index:100;

    display:flex;

    flex-direction:column;


    overflow-x:hidden !important;   /* add this */
    overflow-y:hidden;

    background:

    linear-gradient(
        180deg,
        rgba(15,23,42,.95),
        rgba(30,64,175,.95)
    );

    backdrop-filter:blur(20px);

    color:white;

    padding:25px 18px;

    border-right:1px solid rgba(255,255,255,.15);

    box-shadow:
    10px 0 40px rgba(15,23,42,.15);

}



/* =========================
        BRAND
========================= */


.brand{

    display:flex;

    align-items:center;

    gap:15px;

    padding-bottom:28px;

    border-bottom:

    1px solid rgba(255,255,255,.15);

}



.logo-icon{


    width:58px;

    height:58px;

    border-radius:18px;


    display:flex;

    align-items:center;

    justify-content:center;


    font-size:30px;


    background:


    linear-gradient(
        135deg,
        #38bdf8,
        #2563eb
    );


    box-shadow:

    0 10px 30px rgba(37,99,235,.45);


}



.brand h2{

    font-size:24px;

    font-weight:800;

    margin:0;

    letter-spacing:.5px;

}



.brand p{

    margin-top:4px;

    font-size:12px;

    color:#bfdbfe;

}





/* =========================
        MENU
========================= */


.menu{

    margin-top:35px;

    display:flex;

    flex-direction:column;

    gap:12px;


    flex:1;              /* available space lega */

    overflow-y:auto;     /* menu scroll hoga */

    overflow-x:hidden;   /* add this */

    padding-right:5px;

}


.menu-item{


    position:relative;


    display:flex;

    align-items:center;


    padding:14px 16px;


    border-radius:14px;


    color:#e0f2fe;


    text-decoration:none;


    font-size:15px;


    font-weight:500;


    transition:.35s;


    overflow:hidden;


}




.menu-item::before{


    content:"";


    position:absolute;


    inset:0;


    background:


    linear-gradient(

        90deg,

        rgba(255,255,255,.18),

        transparent

    );


    opacity:0;


    transition:.35s;


}



.menu-item:hover::before{


    opacity:1;


}



.menu-item:hover{


    transform:translateX(6px);


    color:white;


}




/* Active */


.router-link-active{


    background:white;


    color:#2563eb;


    font-weight:700;


    box-shadow:


    0 12px 30px rgba(0,0,0,.18);


}



.router-link-active:hover{


    transform:none;


}




/* =========================
        LOGOUT
========================= */


.logout{

 flex-shrink:0;

    margin-top:20px;


    padding:15px;


    border:none;


    border-radius:14px;


    cursor:pointer;


    font-size:15px;


    font-weight:700;



    background:


    rgba(255,255,255,.95);



    color:#2563eb;



    transition:.35s;



    box-shadow:


    0 10px 25px rgba(0,0,0,.15);


}



.logout:hover{


    background:


    linear-gradient(

        135deg,

        #ef4444,

        #dc2626

    );


    color:white;


    transform:

    translateY(-3px);


}





/* =========================
        SCROLL
========================= */


.menu::-webkit-scrollbar{

    width:6px;

}


.menu::-webkit-scrollbar-track{

    background:transparent;

}



.menu::-webkit-scrollbar-thumb{

    background:

    linear-gradient(
        180deg,
        #38bdf8,
        #2563eb
    );


    border-radius:20px;

}


.sidebar::-webkit-scrollbar-thumb{


    background:

    rgba(255,255,255,.3);


    border-radius:20px;


}



/* =========================
        RESPONSIVE
========================= */


@media(max-width:900px){


.sidebar{


    width:220px;


}


.brand h2{


    font-size:18px;


}


.brand p{


    display:none;


}


.menu-item{


    font-size:14px;


    padding:12px;


}


.logo-icon{


    width:48px;

    height:48px;

    font-size:24px;


}


}


</style>