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

<div>

<h2>Signup</h2>


<input
v-model="name"
placeholder="Name"
/>


<input
v-model="email"
placeholder="Email"
/>


<input
type="password"
v-model="password"
placeholder="Password"
/>


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



<button @click="signup">
Signup
</button>

<p>
Already have account?
<a href="/">
Login
</a>
</p>


</div>


</template>