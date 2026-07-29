<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const profile = ref({

name:"",
email:"",
role:"",
createdAt:"",
profileImage:""

});


const selectedImage = ref(null);

const loading = ref(false);



// =====================
// Get Profile
// =====================

const getProfile = async()=>{


try{


const res = await api.get(
"/auth/profile"
);



console.log(
"Profile:",
res.data
);



profile.value = res.data;



}
catch(error){


console.log(
error.response?.data || error.message
);


}


};




// =====================
// Select Image
// =====================


const handleImage=(event)=>{


const file = event.target.files[0];


if(!file) return;



selectedImage.value=file;


};




// =====================
// Upload Image
// =====================


const uploadImage = async()=>{


if(!selectedImage.value){


window.notify(
"Please select image first"
);


return;


}



try{


const formData = new FormData();


formData.append(
"image",
selectedImage.value
);



const res = await api.post(

"/users/profile-image",

formData,

{

headers:{

"Content-Type":"multipart/form-data"

}

}

);

window.notify(
res.data.message
);



selectedImage.value=null;



getProfile();



}
catch(error){


console.log(
error.response?.data || error.message
);


}


};






// =====================
// Remove Image
// =====================


const removeImage = async()=>{


try{


const res = await api.delete(

"/users/profile-image"

);



window.notify(
res.data.message
);



getProfile();



}
catch(error){


console.log(
error.response?.data || error.message
);


}


};






// =====================
// Update Profile
// =====================


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

window.notify(
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


    <!-- Header -->

    <div class="header">

        <div>

            <span class="eyebrow">
                Hospital Admin
            </span>

            <h1>
                👤 Admin Profile
            </h1>

            <p>
                Manage your administrator account information
            </p>

        </div>


        <div class="badge">
            🏥 {{profile.role}}
        </div>


    </div>





    <div class="profile-layout">



        <!-- Profile Card -->

        <div class="profile-card">


            <div class="avatar-wrapper">


                <div class="avatar">


                    <img
                    v-if="profile.profileImage"
                    :src="profile.profileImage"
                    />


                    <span v-else>
                        {{profile.name?.charAt(0)?.toUpperCase()}}
                    </span>


                </div>



                <label class="upload-label">

                    Change Photo

                    <input
                    type="file"
                    accept="image/*"
                    @change="handleImage"
                    />

                </label>



            </div>




            <button
            class="upload-btn"
            @click="uploadImage"
            >
                Upload Image
            </button>



            <button
            v-if="profile.profileImage"
            class="remove-btn"
            @click="removeImage"
            >
                Remove Image
            </button>





            <h2>
                {{profile.name}}
            </h2>



            <p class="email">
                {{profile.email}}
            </p>



            <span class="role">
                {{profile.role}}
            </span>



        </div>







        <!-- Information -->


        <div class="form-card">


            <div class="card-header">

                <h2>
                    Account Information
                </h2>

                <span>
                    Profile Settings
                </span>

            </div>





            <div class="form-grid">



                <div class="field">

                    <label>
                        Full Name
                    </label>

                    <input
                    v-model="profile.name"
                    />

                </div>





                <div class="field">

                    <label>
                        Email Address
                    </label>

                    <input
                    v-model="profile.email"
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
            >

                {{loading ? "Saving..." : "Save Changes"}}

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



.eyebrow{

font-size:12px;

font-weight:800;

letter-spacing:1px;

color:var(--secondary);

text-transform:uppercase;

}



.header h1{

font-size:30px;

margin:8px 0;

color:var(--text);

}



.header p{

color:var(--muted);

}




.badge{

background:var(--gradient-primary);

color:white;

padding:14px 22px;

border-radius:var(--radius-pill);

font-weight:700;

box-shadow:var(--shadow-lg);

}






.profile-layout{


display:grid;

grid-template-columns:320px 1fr;

gap:25px;


}






/* Profile Card */


.profile-card{


background:var(--surface);

backdrop-filter:blur(20px);

border:1px solid var(--border);

border-radius:var(--radius-xl);

padding:30px;

text-align:center;

box-shadow:var(--shadow);


}



.avatar-wrapper{

margin-bottom:20px;

}




.avatar{


width:120px;

height:120px;

margin:auto;

border-radius:35px;

overflow:hidden;

background:var(--gradient-primary);

display:flex;

align-items:center;

justify-content:center;

color:white;

font-size:45px;

font-weight:800;

box-shadow:

0 15px 35px rgba(37,99,235,.25);


}



.avatar img{

width:100%;

height:100%;

object-fit:cover;

}




.upload-label{


display:inline-block;

margin-top:15px;

padding:8px 16px;

border-radius:var(--radius-pill);

background:var(--surface-solid);

color:var(--primary);

font-size:13px;

font-weight:700;

cursor:pointer;


}



.upload-label input{

display:none;

}





.upload-btn,
.remove-btn{


width:100%;

margin-top:12px;

padding:12px;

border:none;

border-radius:var(--radius-md);

font-weight:700;

cursor:pointer;

}



.upload-btn{

background:var(--gradient-primary);

color:white;

}




.remove-btn{

background:var(--danger-bg);

color:var(--danger);

}





.profile-card h2{

margin-top:20px;

font-size:22px;

color:var(--text);

}



.email{

color:var(--muted);

font-size:14px;

}




.role{

display:inline-block;

margin-top:12px;

background:var(--info-bg);

color:var(--info);

padding:7px 18px;

border-radius:var(--radius-pill);

font-size:13px;

font-weight:700;

}






/* Form Card */


.form-card{


background:var(--white);

border-radius:var(--radius-xl);

padding:35px;

border:1px solid var(--border);

box-shadow:var(--shadow);


}



.card-header{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:25px;

}



.card-header h2{

margin:0;

color:var(--text);

}



.card-header span{

font-size:13px;

color:var(--muted);

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




.field label{

font-size:13px;

font-weight:700;

color:var(--muted);

}




.field input{


padding:14px 16px;

border-radius:var(--radius-md);

border:1px solid var(--border);

outline:none;

font-size:14px;

background:white;


}



.field input:focus{


border-color:var(--secondary);


box-shadow:

0 0 0 4px rgba(20,184,166,.15);


}




.field input:disabled{


background:var(--surface-solid);

cursor:not-allowed;

}




.save-btn{


margin-top:30px;

padding:14px 30px;

border:none;

border-radius:var(--radius-pill);

background:var(--gradient-primary);

color:white;

font-weight:700;

cursor:pointer;

box-shadow:var(--shadow-lg);


}





@media(max-width:900px){


.profile-layout{

grid-template-columns:1fr;

}



.form-grid{

grid-template-columns:1fr;

}



.header{

flex-direction:column;

align-items:flex-start;

gap:15px;

}



}


</style>