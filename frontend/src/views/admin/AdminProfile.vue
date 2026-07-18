<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const profile = ref({

name:"",
email:"",
role:"",
createdAt:""

});


const loading = ref(false);



// Get Profile

const getProfile = async()=>{

try{


const res = await api.get("/auth/profile");


profile.value = res.data;


}
catch(error){

console.log(
error.response?.data || error.message
);

}


};




// Update Profile

const updateProfile = async()=>{


try{

loading.value=true;


const res = await api.put(
"/auth/profile",
{

name:profile.value.name,

email:profile.value.email

}

);


alert(
res.data.message
);



getProfile();


}
catch(error){

console.log(
error.response?.data || error.message
);

}
finally{

loading.value=false;

}


};



onMounted(()=>{

getProfile();

});


</script>


<template>


<div class="profile-page">


    <div class="header">


        <div>

            <h1>
                👤 Admin Profile
            </h1>

            <p>
                Manage your administrator account information
            </p>

        </div>


        <div class="badge">

            🏥 Administrator

        </div>


    </div>





    <div class="profile-card">



        <div class="avatar">


            {{profile.name?.charAt(0)}}


        </div>



        <h2>

            {{profile.name}}

        </h2>



        <span class="role">

            {{profile.role}}

        </span>



    </div>






    <div class="form-card">


        <h2>
            Account Information
        </h2>



        <div class="form-grid">



            <div class="field">


                <label>
                    Full Name
                </label>


                <input

                v-model="profile.name"

                placeholder="Admin Name"

                />


            </div>






            <div class="field">


                <label>
                    Email Address
                </label>


                <input

                v-model="profile.email"

                placeholder="Email"

                />


            </div>





            <div class="field">


                <label>
                    Role
                </label>


                <input

                :value="profile.role"

                disabled

                />


            </div>





            <div class="field">


                <label>
                    Joined Date
                </label>


                <input

                :value="
                new Date(profile.createdAt)
                .toLocaleDateString()
                "

                disabled

                />


            </div>



        </div>





        <button

        class="save-btn"

        @click="updateProfile"

        :disabled="loading"

        >

        {{loading ? "Saving..." : "Save Changes"}}


        </button>



    </div>





</div>


</template>





<style scoped>


.profile-page{

padding:30px;

}



.header{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:30px;

}



.header h1{

font-size:32px;

color:var(--text);

margin:0;

}



.header p{

color:var(--muted);

margin-top:8px;

}



.badge{

background:

linear-gradient(
135deg,
var(--primary),
var(--secondary)
);

color:white;

padding:12px 20px;

border-radius:30px;

font-weight:600;

}




.profile-card{

background:var(--white);

border-radius:20px;

padding:35px;

box-shadow:var(--shadow);

border:1px solid var(--border);

text-align:center;

margin-bottom:30px;

}





.avatar{

width:90px;

height:90px;

margin:auto;

border-radius:50%;

background:var(--secondary);

color:white;

display:flex;

justify-content:center;

align-items:center;

font-size:40px;

font-weight:bold;

}



.profile-card h2{

margin:15px 0 10px;

color:var(--text);

}




.role{

background:#ccfbf1;

color:var(--primary);

padding:8px 20px;

border-radius:20px;

font-weight:600;

font-size:14px;

}





.form-card{

background:var(--white);

border-radius:20px;

padding:30px;

box-shadow:var(--shadow);

border:1px solid var(--border);

}





.form-card h2{

color:var(--text);

margin-bottom:25px;

}





.form-grid{

display:grid;

grid-template-columns:repeat(2,1fr);

gap:20px;

}





.field{

display:flex;

flex-direction:column;

gap:8px;

}



label{

color:var(--muted);

font-weight:600;

}





input{

padding:14px;

border-radius:12px;

border:1px solid var(--border);

font-size:15px;

outline:none;

}



input:focus{

border-color:var(--secondary);

box-shadow:
0 0 0 4px rgba(20,184,166,.15);

}



input:disabled{

background:#f1f5f9;

cursor:not-allowed;

}





.save-btn{

margin-top:30px;

padding:14px 35px;

border:none;

border-radius:12px;

background:

linear-gradient(
135deg,
var(--primary),
var(--secondary)
);

color:white;

font-size:16px;

font-weight:700;

cursor:pointer;

}




.save-btn:hover{

transform:translateY(-2px);

}




@media(max-width:700px){


.header{

flex-direction:column;

align-items:flex-start;

gap:15px;

}



.form-grid{

grid-template-columns:1fr;

}


}



</style>