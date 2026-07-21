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
}


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
}



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

    background:
    linear-gradient(
        180deg,
        var(--primary),
        var(--primary-dark)
    );

    color:var(--white);

    display:flex;

    flex-direction:column;

    padding:25px 20px;

    box-shadow:var(--shadow);

}



/* Brand */


.brand{


    display:flex;

    align-items:center;

    gap:15px;

    padding-bottom:30px;

    border-bottom:1px solid rgba(255,255,255,.2);

}



.logo-icon{


    width:55px;

    height:55px;

    border-radius:15px;

    display:flex;

    align-items:center;

    justify-content:center;

    font-size:28px;


    background:

    rgba(255,255,255,.18);


}



.brand h2{


    font-size:23px;

    margin:0;

    font-weight:700;


}



.brand p{


    font-size:12px;

    opacity:.8;

    margin-top:4px;


}





/* Menu */


.menu{


    margin-top:30px;

    display:flex;

    flex-direction:column;

    gap:10px;


}



.menu-item{


    color:white;

    text-decoration:none;

    padding:14px 15px;

    border-radius:12px;

    font-size:15px;

    transition:.3s;

    background:transparent;


}



.menu-item:hover{


    background:

    rgba(255,255,255,.15);


    transform:translateX(5px);


}



.router-link-active{


    background:white;

    color:var(--primary);

    font-weight:700;


}





/* Logout */


.logout{


    margin-top:auto;

    padding:14px;

    border:none;

    border-radius:12px;


    background:white;

    color:var(--primary);


    font-size:15px;

    font-weight:700;

    cursor:pointer;


    transition:.3s;


}



.logout:hover{


    background:var(--secondary);

    color:white;

    transform:translateY(-2px);


}





@media(max-width:900px){


.sidebar{

    width:220px;

}


.brand h2{

    font-size:18px;

}


.menu-item{

    font-size:14px;

}


}



</style>