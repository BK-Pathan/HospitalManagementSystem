import {createRouter,createWebHistory} from "vue-router";

import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";

import AdminLayout from "../layouts/AdminLayout.vue";

import AdminDashboard from "../views/admin/AdminDashboard.vue";
// import Doctors from "../views/admin/Doctors.vue";
import Patients from "../views/admin/Patinets.vue";
// import Appointments from "../views/admin/Appointments.vue";
import PatientDashboard from "../views/patient/PatientDashboard.vue";
import Doctors from "../views/patient/Doctors.vue";
import BookAppointment from "../views/patient/BookAppointment.vue";
import MyAppointments from "../views/patient/MyAppointments.vue";

const routes=[
{
path:"/",
component:Login
},

{
path:"/signup",
component:Signup
},

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
    component: () => import("../views/admin/Doctors.vue")
},

{
 path:"patients",
 component:Patients
}

// {
// path:"appointments",
// component:Appointments
// }

]

},
{
path:"/patient",
component:PatientDashboard,

children:[

{
path:"",
component:Doctors
},

{
path:"book/:doctorId",
component:BookAppointment
},


{
path:"appointments",
component:MyAppointments
}


]

}


];

export default createRouter({

history:createWebHistory(),

routes

});