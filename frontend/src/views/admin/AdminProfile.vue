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


alert(
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



alert(
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


<img
v-if="profile.profileImage"
:src="profile.profileImage"
alt="Profile"
/>


<span v-else>

{{profile.name?.charAt(0)?.toUpperCase()}}

</span>


</div>




  <input
type="file"
accept="image/*"
@change="handleImage"
/>


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

    Save Changes

    </button>



    </div>



    </div>



    </template>





<style scoped>


.avatar{

width:100px;
height:100px;
border-radius:50%;
overflow:hidden;
margin:auto;
background:var(--secondary);
color:white;
display:flex;
justify-content:center;
align-items:center;
font-size:40px;
font-weight:bold;

}


.avatar img{

width:100%;
height:100%;
object-fit:cover;

}



.upload-btn{

margin-top:15px;
background:#2563eb;
color:white;

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
overflow:hidden;

}


.avatar img{

width:100%;
height:100%;
object-fit:cover;

}

</style>