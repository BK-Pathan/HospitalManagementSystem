<script setup>

import {ref,onMounted,reactive,watch} from "vue";
import api from "../../api/axios";


const users = ref([]);

const selectedRoles = ref({});

const search = ref("");

const currentPage = ref(1);

const totalPages = ref(1);

const totalUsers = ref(0);

const limit = 5;



const openRows = reactive({});


const toggleRow = (id)=>{

openRows[id] = !openRows[id];

};




// Get Users

const getUsers = async()=>{


try{


const res = await api.get("/admin/users",{

params:{

page:currentPage.value,

limit,

search:search.value

}

});



users.value = res.data.users;


totalPages.value = res.data.totalPages;

totalUsers.value = res.data.totalUsers;



users.value.forEach(user=>{

selectedRoles.value[user._id] = user.role;

});



}

catch(error){

console.log(error);

}


};





// Search watcher

watch(search,()=>{

currentPage.value=1;

getUsers();

});





// Pagination

const changePage=(page)=>{


if(page < 1 || page > totalPages.value)
return;


currentPage.value = page;

getUsers();


};





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


window.notify(

error.response?.data?.message ||
"Role update failed"

);


}


};





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

<div class="search-box">


<input

v-model="search"

type="text"

placeholder="Search users..."

>


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
            :class="{ expanded: openRows[user._id] }"
            >



                <td data-label="User" class="cell-user">

                    <div class="user-row">

                        <div class="user">


                            <div class="avatar" :class="user.role">

                                {{user.name?.charAt(0)}}

                            </div>



                            <div class="user-info">

                                <strong>
                                    {{user.name}}
                                </strong>

                                <span class="role-pill-mobile" :class="user.role">
                                    {{ user.role }}
                                </span>

                                <small class="email-mobile">
                                    {{ user.email }}
                                </small>

                                <small class="user-sub">
                                    Registered User
                                </small>


                            </div>


                        </div>


                        <button
                        class="expand-btn"
                        @click="toggleRow(user._id)"
                        :aria-expanded="!!openRows[user._id]"
                        >
                            <span class="chevron">›</span>
                        </button>


                    </div>


                </td>






                <td data-label="Email" class="cell-email">

                    {{user.email}}

                </td>






                <td data-label="Current Role" class="cell-role">

                    <span
                    class="role"
                    :class="user.role"
                    >

                        {{user.role}}

                    </span>


                </td>







                <td data-label="Change Role" class="cell-select">


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






                <td data-label="Action" class="cell-action">


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

<div class="pagination">


<button

@click="changePage(currentPage-1)"

:disabled="currentPage===1"

>

Prev

</button>



<span>

Page {{currentPage}} of {{totalPages}}

</span>



<button

@click="changePage(currentPage+1)"

:disabled="currentPage===totalPages"

>

Next

</button>



</div>
        </div>



    </div>




</div>


</template>

<style scoped>


.page{

min-height:100%;

}





/* ================= HEADER ================= */


.header{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:28px;

gap:16px;

flex-wrap:wrap;

}



.eyebrow{

font-size:11.5px;

font-weight:800;

letter-spacing:1.2px;

color:var(--secondary);

text-transform:uppercase;

}



.header h2{

font-size:28px;

font-weight:800;

margin:8px 0 4px;

color:var(--text);

}



.header p{

color:var(--muted);

font-size:13.5px;

}




.badge{

background:var(--gradient-primary);

color:white;

padding:12px 22px;

border-radius:var(--radius-pill);

font-weight:700;

font-size:13px;

box-shadow:var(--shadow-lg);

white-space:nowrap;

}





/* ================= CARD ================= */


.card{


background:var(--surface);

backdrop-filter:blur(15px);

border:1px solid var(--border);

border-radius:var(--radius-xl);

padding:26px;

box-shadow:var(--shadow);


}




.card-head{

display:flex;

justify-content:space-between;

align-items:center;

margin-bottom:22px;

padding-bottom:18px;

border-bottom:1px solid var(--border);

flex-wrap:wrap;

gap:12px;

}



.card-head h3{

margin:0;

font-size:18px;

font-weight:700;

color:var(--text);

}



.card-head p{

color:var(--muted);

font-size:12.5px;

margin-top:3px;

}



.count{

background:var(--surface-solid);

padding:7px 16px;

border-radius:var(--radius-pill);

color:var(--primary);

font-size:12.5px;

font-weight:700;

border:1px solid var(--border);

white-space:nowrap;

}







/* ================= TABLE ================= */


.table-wrapper{

overflow-x:auto;

}



table{

width:100%;

border-collapse:separate;

border-spacing:0 10px;

}



thead th{


background:#0f172a;

color:white;

padding:14px 16px;

font-size:11px;

font-weight:700;

text-transform:uppercase;

letter-spacing:.6px;

text-align:left;

white-space:nowrap;

}



thead th:first-child{

border-radius:12px 0 0 12px;

}



thead th:last-child{

border-radius:0 12px 12px 0;

text-align:center;

}





tbody tr{

background:white;

box-shadow:0 1px 3px rgba(15,23,42,.05);

transition:.25s ease;

}



tbody tr:hover{

transform:translateY(-3px);

box-shadow:0 12px 28px rgba(15,23,42,.1);

}



tbody td{

padding:15px 16px;

border-top:1px solid var(--border);

border-bottom:1px solid var(--border);

color:var(--text-soft);

font-size:14px;

vertical-align:middle;

}



tbody td:first-child{

border-left:1px solid var(--border);

border-radius:12px 0 0 12px;

}



tbody td:last-child{

border-right:1px solid var(--border);

border-radius:0 12px 12px 0;

text-align:center;

}





/* ================= USER CELL ================= */


.user-row{

display:flex;

align-items:center;

justify-content:space-between;

gap:12px;

width:100%;

}



.user{

display:flex;

align-items:center;

gap:13px;

min-width:0;

}



.user strong{

display:block;

color:var(--text);

font-size:14.5px;

font-weight:700;

}



.user small{

font-size:11.5px;

color:var(--muted);

}



/* mobile-only inline info, hidden on desktop */

.role-pill-mobile,
.email-mobile,
.expand-btn{

display:none;

}



.avatar{


width:42px;

height:42px;

flex-shrink:0;

border-radius:13px;

background:var(--gradient-primary);

color:white;

display:flex;

align-items:center;

justify-content:center;

font-size:16px;

font-weight:800;

box-shadow:0 6px 14px rgba(37,99,235,.25);

}



.avatar.admin{

background:linear-gradient(135deg,#8b5cf6,#7c3aed);

box-shadow:0 6px 14px rgba(124,58,237,.3);

}



.avatar.doctor{

background:linear-gradient(135deg,#0ea5e9,#0284c7);

box-shadow:0 6px 14px rgba(2,132,199,.3);

}



.avatar.patient{

background:linear-gradient(135deg,#22c55e,#16a34a);

box-shadow:0 6px 14px rgba(22,163,74,.3);

}





/* ================= ROLE BADGE (desktop table cell) ================= */


.role{


padding:6px 14px;

border-radius:var(--radius-pill);

font-size:11.5px;

font-weight:800;

text-transform:capitalize;

display:inline-flex;

align-items:center;

gap:6px;

white-space:nowrap;

}



.role::before{

content:"";

width:6px;

height:6px;

border-radius:50%;

background:currentColor;

flex-shrink:0;

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





/* ================= SELECT ================= */


select{


padding:10px 14px;

border-radius:10px;

border:1.5px solid var(--border);

background:white;

outline:none;

font-weight:600;

font-size:13.5px;

color:var(--text);

cursor:pointer;

transition:.25s;

min-width:130px;

}



select:hover{

border-color:var(--secondary);

}



select:focus{

border-color:var(--secondary);

box-shadow:

0 0 0 4px rgba(20,184,166,.15);

}





/* ================= BUTTON ================= */


.update-btn{


padding:10px 20px;

border:none;

border-radius:var(--radius-pill);

background:var(--gradient-primary);

color:white;

font-weight:700;

font-size:13px;

cursor:pointer;

transition:.25s ease;

white-space:nowrap;

}



.update-btn:hover{


transform:translateY(-2px);

box-shadow:var(--shadow-lg);

filter:brightness(1.05);


}



.update-btn:active{

transform:translateY(0);

}





/* ================= TABLET ================= */


@media(max-width:1024px){


.card{

padding:20px;

}


}





/* ================= MOBILE HEADER/CARD ================= */


@media(max-width:800px){


.header{

flex-direction:column;

align-items:flex-start;

gap:14px;

}



.badge{

width:50%;

text-align:center;

}



.card{

padding:16px;

border-radius:16px;

}



.card-head{

flex-direction:column;

align-items:flex-start;

}


}





/* ================= MOBILE TABLE -> COLLAPSED CARDS ================= */

@media(max-width:700px){

thead{
    display:none;
}

table,
tbody{
    display:block;
    width:100%;
}


tbody{
    display:flex;
    flex-direction:column;
    gap:12px;
}


tr{
    display:flex;
    flex-direction:column;
    width:100%;
}


tbody tr{

    margin-bottom:0;
    border-radius:18px;
    padding:14px;
    border:1px solid var(--border);
    background:#fff;
    box-shadow:0 5px 18px rgba(15,23,42,.06);

}


tbody tr:hover{

    transform:none;

}


/* Sirf User cell hamesha visible - baaki hide by default */

tbody td{

    border:none !important;
    border-radius:0 !important;
    padding:0;

}


.cell-user{

    padding:0;

}


.cell-email,
.cell-role{

    display:none;

}


/* Change Role + Action sirf tab dikhein jab row expand ho */

.cell-select,
.cell-action{

    display:none;

    padding-top:14px;

    margin-top:14px;

    border-top:1px dashed var(--border) !important;

}


tr.expanded .cell-select,
tr.expanded .cell-action{

    display:block;

}


.cell-select{

    display:none;

}

tr.expanded .cell-select{

    display:block;

}


/* User row layout */

.user-row{

    align-items:flex-start;

}


.user{

    flex:1;

    min-width:0;

}


.user-info{

    display:flex;

    flex-direction:column;

    gap:3px;

    min-width:0;

}


.user-info strong{

    font-size:14.5px;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}


.user-sub{

    display:none;

}


.email-mobile{

    display:block;

    font-size:12px;

    color:var(--muted);

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}


.role-pill-mobile{

    display:inline-flex;

    align-items:center;

    gap:5px;

    width:fit-content;

    padding:3px 10px;

    border-radius:var(--radius-pill);

    font-size:10.5px;

    font-weight:800;

    text-transform:capitalize;

}


.role-pill-mobile::before{

    content:"";

    width:5px;

    height:5px;

    border-radius:50%;

    background:currentColor;

}


.role-pill-mobile.admin{

    background:var(--purple-bg);

    color:var(--purple);

}


.role-pill-mobile.doctor{

    background:var(--info-bg);

    color:var(--info);

}


.role-pill-mobile.patient{

    background:var(--success-bg);

    color:var(--success);

}


/* Expand arrow button */

.expand-btn{

    display:flex;

    align-items:center;

    justify-content:center;

    width:34px;

    height:34px;

    flex-shrink:0;

    border:none;

    border-radius:50%;

    background:var(--surface-solid);

    color:var(--primary);

    cursor:pointer;

    transition:.25s ease;

}


.expand-btn:active{

    transform:scale(.92);

}


.chevron{

    font-size:20px;

    font-weight:700;

    line-height:1;

    transition:transform .25s ease;

}


tr.expanded .expand-btn{

    background:var(--gradient-primary);

    color:white;

}


tr.expanded .chevron{

    transform:rotate(90deg);

}


select{

    width:10%;

    max-width:100%;

    padding:11px;

    border-radius:10px;

}


.update-btn{

    width:50%;

    margin-top:10px;

    padding:11px;

    border-radius:10px;

}


}





/* ================= SMALL MOBILE ================= */


@media(max-width:420px){

.card{
    padding:14px;
}


.header h2{
    font-size:20px;
}


.avatar{

    width:36px;
    height:36px;
    font-size:14px;

}


.user-info strong{

    font-size:13.5px;

}


select{

    font-size:13px;

}


.update-btn{

    font-size:13px;

}

}

/* ================= SEARCH ================= */


.search-box{

margin-bottom:20px;

}


.search-box input{


width:100%;

max-width:350px;

padding:12px 16px;

border-radius:12px;

border:1px solid var(--border);

outline:none;

font-size:14px;

}



.search-box input:focus{

border-color:var(--secondary);

box-shadow:0 0 0 4px rgba(20,184,166,.15);

}





/* ================= PAGINATION ================= */


.pagination{


display:flex;

justify-content:center;

align-items:center;

gap:15px;

margin-top:25px;

}



.pagination button{


padding:9px 18px;

border:none;

border-radius:10px;

background:var(--gradient-primary);

color:white;

font-weight:700;

cursor:pointer;

}



.pagination button:disabled{


opacity:.5;

cursor:not-allowed;

}



.pagination span{

font-size:14px;

font-weight:600;

color:var(--text);

}




@media(max-width:700px){


.pagination{

gap:10px;

flex-wrap:wrap;

}


.pagination button{

padding:8px 14px;

}


.search-box input{

max-width:100%;

}


}
</style>