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


        window.notify(res.data.message);


        getUsers();


    }
    catch(error){

        console.log(error);

window.notify(
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


    <!-- Header -->

    <div class="header">


        <div>

            <span class="eyebrow">
                Hospital Admin
            </span>


            <h2>
                👥 User Management
            </h2>


            <p>
                Manage hospital users and access permissions
            </p>


        </div>



        <div class="badge">
            Admin Panel
        </div>


    </div>





    <div class="card">


        <div class="card-head">


            <div>

                <h3>
                    All Users
                </h3>

                <p>
                    Update roles and manage system access
                </p>

            </div>


            <span class="count">
                {{users.length}} Users
            </span>


        </div>






        <div class="table-wrapper">


        <table>


            <thead>

                <tr>

                    <th>
                        User
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

                            {{user.name?.charAt(0)}}

                        </div>



                        <div>

                            <strong>
                                {{user.name}}
                            </strong>


                            <small>
                                Registered User
                            </small>


                        </div>


                    </div>


                </td>






                <td>

                    {{user.email}}

                </td>






                <td>

                    <span
                    class="role"
                    :class="user.role"
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

                        Save Changes

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





/* HEADER */


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



.header h2{

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

padding:14px 24px;

border-radius:var(--radius-pill);

font-weight:700;

box-shadow:var(--shadow-lg);

}





/* CARD */


.card{


background:var(--surface);

backdrop-filter:blur(15px);

border:1px solid var(--border);

border-radius:var(--radius-xl);

padding:30px;

box-shadow:var(--shadow);


}




.card-head{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:25px;

}



.card-head h3{

margin:0;

font-size:20px;

color:var(--text);

}



.card-head p{

color:var(--muted);

font-size:13px;

}



.count{

background:var(--surface-solid);

padding:8px 16px;

border-radius:var(--radius-pill);

color:var(--primary);

font-size:13px;

font-weight:700;

}







/* TABLE */


.table-wrapper{

overflow-x:auto;

}



table{

width:100%;

border-collapse:separate;

border-spacing:0 12px;

}



thead th{


background:var(--gradient-primary);

color:white;

padding:16px;

font-size:12px;

text-transform:uppercase;

letter-spacing:.6px;

}



thead th:first-child{

border-radius:14px 0 0 14px;

}



thead th:last-child{

border-radius:0 14px 14px 0;

}





tbody tr{

background:white;

box-shadow:var(--shadow);

transition:.3s;

}



tbody tr:hover{

transform:translateY(-4px);

box-shadow:var(--shadow-lg);

}



tbody td{

padding:18px 16px;

border-top:1px solid var(--border);

border-bottom:1px solid var(--border);

color:var(--text-soft);

}



tbody td:first-child{

border-left:1px solid var(--border);

border-radius:14px 0 0 14px;

}



tbody td:last-child{

border-right:1px solid var(--border);

border-radius:0 14px 14px 0;

}





/* USER */


.user{

display:flex;

align-items:center;

gap:14px;

}



.user strong{

display:block;

color:var(--text);

}



.user small{

font-size:12px;

color:var(--muted);

}





.avatar{


width:48px;

height:48px;

border-radius:16px;

background:var(--gradient-primary);

color:white;

display:flex;

align-items:center;

justify-content:center;

font-size:18px;

font-weight:800;

}





/* ROLE */


.role{


padding:7px 16px;

border-radius:var(--radius-pill);

font-size:12px;

font-weight:800;

text-transform:capitalize;

display:inline-flex;

}



.role.admin{

background:var(--purple-bg);

color:var(--purple);

}



.role.doctor{

background:var(--info-bg);

color:var(--info);

}



.role.patient{

background:var(--success-bg);

color:var(--success);

}





/* SELECT */


select{


padding:12px 16px;

border-radius:var(--radius-md);

border:1px solid var(--border);

background:white;

outline:none;

font-weight:600;

color:var(--text);

}



select:focus{

border-color:var(--secondary);

box-shadow:

0 0 0 4px rgba(20,184,166,.15);

}





/* BUTTON */


.update-btn{


padding:12px 20px;

border:none;

border-radius:var(--radius-pill);

background:var(--gradient-primary);

color:white;

font-weight:700;

cursor:pointer;

transition:.3s;

}



.update-btn:hover{


transform:translateY(-3px);

box-shadow:var(--shadow-lg);


}





@media(max-width:800px){


.header{

flex-direction:column;

align-items:flex-start;

gap:15px;

}



.card{

padding:18px;

}



table{

min-width:900px;

}


}


</style>