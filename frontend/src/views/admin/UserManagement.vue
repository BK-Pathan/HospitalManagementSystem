<script setup>

import {ref,onMounted} from "vue";
import api from "../../api/axios";


const users = ref([]);

const selectedRoles = ref({});


// Get all users

const getUsers = async()=>{

    try{

        const res = await api.get("/admin/users");

        users.value = res.data;


        // default roles set
        users.value.forEach(user=>{

            selectedRoles.value[user._id] = user.role;

        });


    }
    catch(error){

        console.log(error);

    }

}



// Change Role

const changeRole = async(userId)=>{


    try{


        const role = selectedRoles.value[userId];


        const res = await api.put(
            `/admin/user/${userId}/role`,
            {
                role
            }
        );


        alert(res.data.message);


        getUsers();


    }
    catch(error){

        console.log(error);

        alert(
            error.response?.data?.message || 
            "Role update failed"
        );

    }


}



onMounted(()=>{

    getUsers();

});


</script>



<template>


<div>


<h2>
User Management
</h2>



<table border="1">


<thead>

<tr>

<th>
Name
</th>


<th>
Email
</th>


<th>
Current Role
</th>


<th>
Change Role
</th>


<th>
Action
</th>


</tr>

</thead>



<tbody>


<tr
v-for="user in users"
:key="user._id"
>


<td>
{{user.name}}
</td>


<td>
{{user.email}}
</td>


<td>
{{user.role}}
</td>


<td>


<select v-model="selectedRoles[user._id]">


<option value="admin">
Admin
</option>


<option value="doctor">
Doctor
</option>


<option value="patient">
Patient
</option>


</select>


</td>


<td>


<button
@click="changeRole(user._id)"
>
Update
</button>


</td>


</tr>


</tbody>


</table>



</div>


</template>