<script setup>

import {ref} from "vue";
import api from "../api/axios";
import {useRouter} from "vue-router";
const role = ref("patient");

const router = useRouter();
const email = ref("");
const password = ref("");

const login = async()=>{
try{

const res = await api.post("/auth/login",{

email: email.value,
password: password.value,
role:role.value
});

console.log(res.data);

// role check

const userRole = res.data.user.role;
if(userRole === "admin"){
    router.push("/admin");
}


else if(userRole === "doctor"){

    router.push("/doctor");

}


else if(userRole === "patient"){

    router.push("/patient");

}



}
catch(error){

console.log("FULL ERROR:", error);


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


<div>


<h2>Login</h2>


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


<button @click="login">
Login
</button>


</div>


</template>