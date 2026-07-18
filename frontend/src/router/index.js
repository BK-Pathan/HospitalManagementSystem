import { createRouter, createWebHistory } from "vue-router";


import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";


// Layouts
import AdminLayout from "../layouts/AdminLayout.vue";
import PatientLayout from "../layouts/PatientLayout.vue";


// Admin Pages
import AdminDashboard from "../views/admin/AdminDashboard.vue";
import Patients from "../views/admin/Patinets.vue";
import Appointments from "../views/admin/Appointments.vue";
import UserManagement from "../views/admin/UserManagement.vue";
import PatientProfile from "../views/admin/PatientsManagement.vue"
// Patient Pages
import PatientDashboard from "../views/patient/PatientDashboard.vue";
import Doctors from "../views/patient/Doctors.vue";
import BookAppointment from "../views/patient/BookAppointment.vue";
import MyAppointments from "../views/patient/MyAppointments.vue";
import Profile from "../views/patient/Profile.vue";

//Doctor pages
import DoctorLayout from "../layouts/DoctorLayout.vue";
import DoctorDashboard from "../views/Doctors/DoctorDashboard.vue";
import DoctorProfile from "../views/Doctors/DoctorProfile.vue";
import DoctorAppointments from "../views/Doctors/Appointments.vue";

//Public pages
import Home from "../views/public/Home.vue"
import Doctor from "../views/public/Doctors.vue";


const routes = [

{
    path: "/",
    name: "Home",
    component: Home,
},
{
     path:"/doctors",
 component:Doctor
},
{
    path:"/login",
    component:Login
},


{
    path:"/signup",
    component:Signup
},



// ================= ADMIN =================

{
    path:"/admin",
    component:AdminLayout,

    children:[

        {
            path:"",
            component:AdminDashboard
        },
{
    path:"users",
    component:UserManagement
},

        {
            path:"doctors",
            component:()=>import("../views/admin/Doctors.vue")
        },


        {
            path:"patients",
            component:Patients
        },
{
    path:"patientprofile",
    component:PatientProfile
},


        {
            path:"appointments",
            component:Appointments
        }

    ]

},




// ================= PATIENT =================

{
    path:"/patient",
    component:PatientLayout,

    children:[


        {
            path:"",
            component:PatientDashboard
        },


        {
            path:"profile",
            component:Profile
        },


        {
            path:"doctors",
            component:Doctors
        },


        {
             path:"book-appointment/:doctorId",
            component:BookAppointment
        },


        {
            path:"appointments",
            component:MyAppointments
        }


    ]

},
// ================= DOCTOR =================


{
path:"/doctor",

component:DoctorLayout,


children:[


{
path:"",
component:DoctorDashboard
},



{
path:"profile",
component:DoctorProfile
},



{
path:"appointments",
component:DoctorAppointments
}



]


}




];


const router = createRouter({

    history:createWebHistory(),

 routes,

scrollBehavior(to){

if(to.hash){

return {
el:to.hash,
behavior:"smooth"
}

}

return {
top:0
}

}

})


// ================= AUTH GUARD =================

router.beforeEach((to, from, next) => {


    const user = JSON.parse(localStorage.getItem("user"));


    // Admin routes protection
    if(to.path.startsWith("/admin")){


        if(!user){

            return next("/");

        }


        if(user.role !== "admin"){

            return next("/");

        }


    }



    // Doctor routes protection
    if(to.path.startsWith("/doctor")){


        if(!user){

            return next("/");

        }


        if(user.role !== "doctor"){

            return next("/");

        }


    }



    // Patient routes protection
    if(to.path.startsWith("/patient")){


        if(!user){

            return next("/");

        }


        if(user.role !== "patient"){

            return next("/");

        }


    }



    next();

});



export default router;