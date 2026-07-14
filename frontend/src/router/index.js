import {createRouter, createWebHistory} from "vue-router";


import Login from "../views/Login.vue";
import Signup from "../views/Signup.vue";


const routes=[

{
    path:"/",
    component:Login
},

{
    path:"/signup",
    component:Signup
}

];


const router=createRouter({

history:createWebHistory(),

routes

});


export default router;