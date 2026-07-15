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

const routes = [


{
    path:"/",
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
            path:"doctors",
            component:()=>import("../views/admin/Doctors.vue")
        },


        {
            path:"patients",
            component:Patients
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

    routes

});



export default router;