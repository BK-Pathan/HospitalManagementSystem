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

<div class="page">


    <div class="header">


        <div>

            <h2>
                👥 User Management
            </h2>


            <p>
                Manage hospital users and their access roles
            </p>


        </div>



        <div class="badge">
            Admin Panel
        </div>


    </div>





    <div class="card">


        <div class="table-wrapper">


        <table>


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


        <div class="user">


            <div class="avatar">
                👤
            </div>


            <span>
                {{user.name}}
            </span>


        </div>


        </td>





        <td>
            {{user.email}}
        </td>





        <td>


        <span 
        class="role"
        >

            {{user.role}}

        </span>


        </td>






        <td>


        <select 
        v-model="selectedRoles[user._id]"
        >


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
        class="update-btn"
        @click="changeRole(user._id)"
        >

            Update

        </button>


        </td>




        </tr>


        </tbody>



        </table>


        </div>


    </div>



</div>


</template>

<style scoped>


.page{

    min-height:100%;

}



.header{


    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:30px;


}




.header h2{


    color:var(--text);

    font-size:30px;


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






.card{


    background:var(--white);

    border-radius:20px;

    padding:30px;

    box-shadow:var(--shadow);

    border:1px solid var(--border);


}






.table-wrapper{


    overflow-x:auto;


}



table{


    width:100%;

    border-collapse:collapse;


}



thead th{


    padding:16px;

    text-align:left;

    color:white;


    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--primary-dark)
    );


}




tbody td{


    padding:16px;

    border-bottom:1px solid var(--border);

    color:var(--text);


}




tbody tr{


    transition:.3s;


}




tbody tr:hover{


    background:#f8fafc;


}






.user{


    display:flex;

    align-items:center;

    gap:12px;

    font-weight:600;


}




.avatar{


    width:42px;

    height:42px;

    border-radius:50%;


    display:flex;

    align-items:center;

    justify-content:center;


    background:

    rgba(20,184,166,.15);


}







.role{


    padding:8px 15px;

    border-radius:20px;


    background:

    rgba(15,118,110,.12);


    color:var(--primary);

    font-weight:700;

    font-size:13px;

    text-transform:capitalize;


}






select{


    padding:12px 15px;


    border-radius:10px;

    border:1px solid var(--border);

    outline:none;


    color:var(--text);

    background:white;


}



select:focus{


    border-color:var(--secondary);


    box-shadow:

    0 0 0 4px rgba(20,184,166,.15);


}





.update-btn{


    padding:12px 20px;


    border:none;

    border-radius:10px;


    background:

    linear-gradient(
        135deg,
        var(--primary),
        var(--secondary)
    );


    color:white;

    font-weight:700;

    cursor:pointer;


    transition:.3s;


}




.update-btn:hover{


    transform:translateY(-2px);

    box-shadow:0 10px 20px rgba(15,118,110,.25);


}







@media(max-width:700px){


.header{

    flex-direction:column;

    align-items:flex-start;

    gap:15px;

}


.card{

    padding:15px;

}


}



</style>