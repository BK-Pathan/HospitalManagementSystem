<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const stats = ref({
 users:0,
doctors:0,
patients:0,
appointments:0

});



const getStats = async()=>{


try{


const res = await api.get("/admin/dashboard");


stats.value = res.data;


}
catch(error){

console.log(error);

}


}



onMounted(()=>{

getStats();

});


</script>



<template>

<div class="dashboard">


    <div class="header">

        <div>
            <h1>
                Admin Dashboard
            </h1>

            <p>
                Manage hospital operations, users and appointments
            </p>
        </div>


        <div class="badge">
            🏥 Admin
        </div>

    </div>




    <div class="cards">


        <div class="card">

            <div class="icon">
                👥
            </div>

            <div>

                <h3>
                    Total Users
                </h3>

                <h1>
                    {{stats.users}}
                </h1>

            </div>


        </div>





        <div class="card">

            <div class="icon">
                👨‍⚕️
            </div>

            <div>

                <h3>
                    Total Doctors
                </h3>

                <h1>
                    {{stats.doctors}}
                </h1>

            </div>

        </div>






        <div class="card">

            <div class="icon">
                🧑‍🤝‍🧑
            </div>

            <div>

                <h3>
                    Total Patients
                </h3>

                <h1>
                    {{stats.patients}}
                </h1>

            </div>

        </div>







        <div class="card">

            <div class="icon">
                📅
            </div>


            <div>

                <h3>
                    Total Appointments
                </h3>

                <h1>
                    {{stats.appointments}}
                </h1>


            </div>


        </div>




    </div>


</div>


</template>

<style scoped>


.dashboard{


    min-height:100%;

}



.header{


    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:35px;


}



.header h1{


    color:var(--text);

    font-size:32px;

    font-weight:700;


}



.header p{


    color:var(--muted);

    margin-top:8px;

}



.badge{


    padding:12px 20px;

    border-radius:30px;

    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );


    color:white;

    font-weight:600;

}




.cards{


    display:grid;

    grid-template-columns:repeat(4,1fr);

    gap:25px;


}




.card{


    background:var(--white);

    border:1px solid var(--border);

    border-radius:20px;

    padding:25px;


    display:flex;

    align-items:center;

    gap:20px;


    box-shadow:var(--shadow);

    transition:.3s;


}



.card:hover{


    transform:translateY(-6px);


}



.icon{


    width:60px;

    height:60px;

    border-radius:18px;


    display:flex;

    align-items:center;

    justify-content:center;


    font-size:30px;


    background:

    rgba(20,184,166,.15);


}




.card h3{


    color:var(--muted);

    font-size:15px;

    font-weight:600;

    margin-bottom:8px;


}



.card h1{


    color:var(--primary);

    font-size:32px;

    margin:0;


}





@media(max-width:1100px){


.cards{

    grid-template-columns:repeat(2,1fr);

}


}



@media(max-width:600px){


.header{

    flex-direction:column;

    align-items:flex-start;

    gap:15px;

}


.cards{

    grid-template-columns:1fr;

}


}



</style>