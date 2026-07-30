<script setup>

import {computed, ref} from "vue";
import {useRouter} from "vue-router";
import api from "../api/axios";

const role = computed(() => 
    localStorage.getItem("role")?.toLowerCase()
);
const router = useRouter();

// Mobile drawer state (UI-only, no backend / data change)
const isMobileOpen = ref(false);

const toggleMobile = () => {
    isMobileOpen.value = !isMobileOpen.value;
};

const closeMobile = () => {
    isMobileOpen.value = false;
};

// Logout function
const logout = async()=>{

    try{

        await api.post("/auth/logout");


        // remove frontend data
        localStorage.removeItem("user");
        localStorage.removeItem("role");


        // redirect login
        router.push("/");


    }
    catch(error){

        console.log("Logout Error:", error);

    }

};

const menu = computed(()=>{
    const currentRole = role.value;


if(currentRole=== "admin"){

return [
  {
    heading: "🏠 Overview",
    items: [
      {
        name: "📊 Dashboard",
        path: "/admin"
      }
    ]
  },
  {
    heading: "👥 User Management",
    items: [
      {
        name: "👥 Users",
        path: "/admin/users"
      },
      {
        name: "👨‍⚕️ Doctors Profile & List",
        path: "/admin/doctors"
      },

      {
        name: "🧑‍🤝‍🧑 Patient Profile & List",
        path: "/admin/patientprofile"
      }
    ]
  },
  {
    heading: "📅 Appointments",
    items: [
      {
        name: "📅 Appointments",
        path: "/admin/appointments"
      }
    ]
  },
  {
    heading: "⚙️ Account",
    items: [
      {
        name: "👤 Admin Profile",
        path: "/admin/profile"
      }
    ]
  }
];

}

if(currentRole==="patient"){

return [
    {
        heading:"🏠 Overview",
        items:[
            {
                name:"🏠 Dashboard",
                path:"/patient"
            }
        ]
    },

    {
        heading:"🏥 Medical",
        items:[
            {
                name:"👨‍⚕️ Doctors",
                path:"/patient/doctors"
            },
            {
                name:"📅 My Appointments",
                path:"/patient/appointments"
            },
            {
                name:"💊 Prescription History",
                path:"/patient/prescriptions"
            }
        ]
    },
        {
        heading:"👤 Account",
        items:[
            {
                name:"👤 Profile",
                path:"/patient/profile"
            }
        ]
    },
];

}


if(currentRole==="doctor"){

return [

{
heading:"🏠 Overview",
items:[
{
name:"🏠 Dashboard",
path:"/doctor"
}
]
},


{
heading:"📅 Management",
items:[

{
name:"📅 Appointments",
path:"/doctor/appointments"
},

{
name:"🔄 Reschedule Requests",
path:"/doctor/reschedule-requests"
}

]

},


{
heading:"👤 Account",
items:[

{
name:"👤 Profile",
path:"/doctor/profile"
},

{
name:"⭐ Feedback",
path:"/doctor/feedback"
}

]

}

]

}


return [];

});


</script>




<template>

<!-- Mobile Hamburger -->
<!-- Mobile Arrow Toggle -->

<button
class="sidebar-arrow"
:class="{ hide: isMobileOpen }"
@click="toggleMobile"
>

    <span>
        {{ isMobileOpen ? '‹' : '›' }}
    </span>

</button>


<!-- Overlay -->
<div
class="sidebar-overlay"
v-if="isMobileOpen"
@click="closeMobile"
></div>




<!-- Sidebar -->

<div 
class="sidebar" 
:class="{ open:isMobileOpen }"
>


    <div class="brand">


        <div class="logo-icon">
            🏥
        </div>


        <div>

            <h2>
                Hospital
            </h2>

            <p>
                Management System
            </p>

        </div>



        <!-- ONLY CLOSE BUTTON -->
        <button 
        class="close-btn"
        @click="closeMobile"
        >
            ✕
        </button>


    </div>





<p class="menu-label">Main Menu</p>

<div class="menu">

    <div
        v-for="section in menu"
        :key="section.heading"
        class="menu-section"
    >

        <p class="menu-heading">
            {{ section.heading }}
        </p>

        <router-link
            v-for="item in section.items"
            :key="item.path"
            :to="item.path"
            class="menu-item"
            @click="closeMobile"
        >
            <span class="menu-item__text">
                {{ item.name }}
            </span>
        </router-link>

    </div>

</div>





    <button
    class="logout"
    @click="logout"
    >

        <span class="logout-icon">🚪</span> Logout

    </button>



</div>


</template>




<style scoped>

.sidebar{

    --accent-a:#38bdf8;
    --accent-b:#2563eb;

    width:270px;

    height:100vh;
    min-height:100vh;

    position:fixed;
    left:0;
    top:0;
    bottom:0;

    z-index:100;

    display:flex;
    flex-direction:column;

    overflow:hidden;

    background:
    linear-gradient(
        165deg,
        #0b1220 0%,
        #0f1f3d 45%,
        #17347a 100%
    );

    backdrop-filter:blur(20px);

    color:white;

    padding:25px 18px;

    border-right:1px solid rgba(255,255,255,.1);

    box-sizing:border-box;

    box-shadow:
    14px 0 45px rgba(2,6,23,.35);

    transition:
    transform .35s cubic-bezier(.4,0,.2,1);

}

/* subtle premium texture overlay */
.sidebar::before{
    content:"";
    position:absolute;
    inset:0;
    background:
    radial-gradient(circle at 15% 0%, rgba(56,189,248,.10), transparent 45%),
    radial-gradient(circle at 100% 100%, rgba(37,99,235,.12), transparent 50%);
    pointer-events:none;
}


/* =========================
        BRAND
========================= */


.brand{

    display:flex;

    align-items:center;

    gap:15px;

    padding-bottom:24px;

    border-bottom:

    1px solid rgba(255,255,255,.1);

    position:relative;

    z-index:1;

}



.logo-icon{


    width:56px;

    height:56px;

    border-radius:16px;


    display:flex;

    align-items:center;

    justify-content:center;


    font-size:28px;


    background:


    linear-gradient(
        135deg,
        var(--accent-a),
        var(--accent-b)
    );


    box-shadow:

    0 10px 24px rgba(37,99,235,.5),
    inset 0 1px 0 rgba(255,255,255,.25);

    transition:transform .3s ease;


}


.brand:hover .logo-icon{

    transform:scale(1.05) rotate(-3deg);

}



.brand h2{

    font-size:22px;

    font-weight:800;

    margin:0;

    letter-spacing:.4px;

    background:linear-gradient(90deg,#ffffff,#cfe4ff);

    -webkit-background-clip:text;

    background-clip:text;

    color:transparent;

}



.brand p{

    margin-top:3px;

    font-size:11.5px;

    color:#93c5fd;

    letter-spacing:.02em;

}


.close-btn{

    display:none;

    position:absolute;

    top:0;

    right:0;


    width:32px;

    height:32px;


    align-items:center;

    justify-content:center;


    background:rgba(255,255,255,.08);


    border:1px solid rgba(255,255,255,.12);

    border-radius:9px;


    color:white;

    font-size:14px;

    cursor:pointer;

    transition:.25s;


}


.close-btn:hover{

    background:rgba(255,255,255,.18);

    transform:rotate(90deg);

}





/* =========================
        MENU
========================= */


.menu-label{

    margin:24px 0 10px 4px;

    font-size:10.5px;

    font-weight:700;

    text-transform:uppercase;

    letter-spacing:.12em;
    min-height:0;

    color:rgba(255,255,255,.35);

    position:relative;
    z-index:1;

}


.menu{

    display:flex;

    flex-direction:column;

    gap:6px;

    flex:1;

    min-height:0;

    overflow-y:auto;

    overflow-x:hidden;

    padding-right:5px;

    position:relative;
    z-index:1;

    /* Firefox: thin + transparent by default */
    scrollbar-width:thin;
    scrollbar-color:transparent transparent;

}


.menu-item{


    position:relative;


    display:flex;

    align-items:center;

    gap:10px;


    padding:13px 14px;


    border-radius:12px;


    color:#cbd8f0;


    text-decoration:none;


    font-size:14.5px;


    font-weight:500;


    transition:.3s ease;


    overflow:hidden;


    border-left:3px solid transparent;

}


.menu-item__dot{

    width:6px;

    height:6px;

    border-radius:50%;

    background:currentColor;

    opacity:.35;

    flex-shrink:0;

    transition:.3s ease;

}


.menu-item__text{

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}




.menu-item::before{


    content:"";


    position:absolute;


    inset:0;


    background:


    linear-gradient(

        90deg,

        rgba(255,255,255,.12),

        transparent

    );


    opacity:0;


    transition:.3s;


}



.menu-item:hover::before{


    opacity:1;


}



.menu-item:hover{


    transform:translateX(5px);


    color:rgb(17, 70, 113);


    border-left-color:var(--accent-a);


}


.menu-item:hover .menu-item__dot{

    opacity:.8;

}




/* Active */


.router-link-active{


    background:linear-gradient(135deg,#ffffff,#eef4ff);


    color:var(--accent-b);


    font-weight:700;


    box-shadow:


    0 10px 26px rgba(2,6,23,.35);


    border-left-color:var(--accent-b);


}


.router-link-active .menu-item__dot{

    background:var(--accent-b);

    opacity:1;

}



.router-link-active:hover{


    transform:none;


}




/* =========================
        LOGOUT
========================= */


.logout{

    flex-shrink:0;

    margin-top:auto;

    display:flex;

    align-items:center;

    justify-content:center;

    gap:8px;

    padding:14px;

    border:1px solid rgba(255,255,255,.12);

    border-radius:13px;

    cursor:pointer;

    font-size:14.5px;

    font-weight:700;

    background:

    rgba(255,255,255,.06);

    color:#fecaca;

    transition:.3s;

    position:relative;
    z-index:1;

}


.logout-icon{

    font-size:15px;

}



.logout:hover{


    background:


    linear-gradient(

        135deg,

        #ef4444,

        #dc2626

    );


    color:white;

    border-color:transparent;


    transform:

    translateY(-3px);


    box-shadow:0 12px 26px rgba(220,38,38,.35);


}





/* =========================
    TRANSPARENT SCROLLBAR
========================= */


.menu::-webkit-scrollbar{

    width:5px;

}


.menu::-webkit-scrollbar-track{

    background:transparent;

}



.menu::-webkit-scrollbar-thumb{

    background:transparent;

    border-radius:20px;

    transition:background .25s ease;

}


/* thumb sirf hover / scroll ke waqt dikhega, halka transparent tone mein */
.menu:hover::-webkit-scrollbar-thumb{

    background:rgba(255,255,255,.18);

}


.menu::-webkit-scrollbar-thumb:hover{

    background:rgba(255,255,255,.32);

}


/* Firefox hover state */
.menu:hover{
    scrollbar-color:rgba(255,255,255,.22) transparent;
}



/* =========================
      MOBILE ARROW TOGGLE
========================= */

.sidebar-arrow{

    display:none;

    position:fixed;

    left:0;

    top:50%;

    transform:translateY(-50%);


    width:34px;

    height:70px;


    z-index:120;


    border:none;

    outline:none;


    cursor:pointer;


    border-radius:0 20px 20px 0;


    align-items:center;

    justify-content:center;


    background:

    linear-gradient(
        145deg,
        #0f172a,
        #2563eb
    );


    color:white;


    font-size:32px;


    font-weight:700;


    box-shadow:

    0 15px 35px rgba(2,6,23,.45);


    transition:

    .35s ease;

}



.sidebar-arrow:hover{


    width:44px;


    background:

    linear-gradient(
        145deg,
        #2563eb,
        #06b6d4
    );


}



.sidebar-arrow span{


    line-height:1;


    margin-top:-4px;


}





/* =========================
        OVERLAY
========================= */


.sidebar-overlay{


    display:none;


    position:fixed;


    inset:0;


    background:

    rgba(2,6,23,.55);


    backdrop-filter:blur(4px);


    z-index:99;


}





/* =========================
        RESPONSIVE
========================= */


@media(max-width:1024px){

    .sidebar{

        width:270px;

        height:100vh;

        min-height:100vh;

        transform:translateX(-100%);

    }


    .sidebar.open{

        transform:translateX(0);

    }


    .sidebar-arrow{

        display:flex;

    }


    .sidebar-overlay{

        display:block;

    }


    .close-btn{

        display:flex;

    }

}



@media(max-width:768px){

    .sidebar{

        width:260px;

        height:100vh;

        min-height:100vh;

        padding:22px 16px;

    }


    .brand h2{

        font-size:20px;

    }


    .menu-item{

        padding:12px 13px;

        font-size:14px;

    }

}



@media(max-width:420px){

    .sidebar{

        width:82vw;

        height:100vh;

        min-height:100vh;

        padding:20px 15px;

    }


    .logo-icon{

        width:48px;

        height:48px;

        font-size:24px;

    }


    .brand h2{

        font-size:18px;

    }


    .sidebar-arrow{

        width:30px;

        height:62px;

        font-size:28px;

    }

}
.sidebar-arrow.hide{

    opacity:0;

    pointer-events:none;

    transform:
    translate(-20px,-50%);

}
.menu-section{
    margin-bottom:18px;
    position:relative;
    z-index:1;
}

.menu-heading{
    font-size:11px;
    font-weight:700;
    color:#94a3b8;
    text-transform:uppercase;
    letter-spacing:1px;
    margin:12px 10px 8px;
    padding-bottom:6px;
    border-bottom:1px solid rgba(255,255,255,.06);
}
</style>