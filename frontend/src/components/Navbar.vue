<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";
import socket from "../socket";

const router = useRouter();

const role = computed(() => localStorage.getItem("role"));

const user = ref({});

const notifications = ref([]);

const showDropdown = ref(false);

// =========================
// PROFILE
// =========================

const getProfile = async () => {
  try {
    const res = await api.get("/auth/profile");

    user.value = res.data;

    localStorage.setItem(
      "user",
      JSON.stringify(res.data)
    );

  } catch (error) {
    console.log(error);
  }
};

// =========================
// NOTIFICATIONS
// =========================

const getNotifications = async () => {
  try {

    const res = await api.get("/notifications");

    notifications.value = res.data;

  } catch (error) {
    console.log(error);
  }
};

const unreadCount = computed(() => {
  return notifications.value.filter(
    n => !n.isRead
  ).length;
});

const badgeText = computed(() => {
  return unreadCount.value > 9
    ? "9+"
    : unreadCount.value;
});

const toggleDropdown = () => {

  showDropdown.value =
    !showDropdown.value;

};

const openNotificationPage = () => {

  showDropdown.value = false;

  router.push("/notifications");

};

const openNotification = async (notification) => {

  try {

    if (!notification.isRead && notification._id) {

      await api.patch(
        `/notifications/${notification._id}/read`
      );

      notification.isRead = true;

    }

    showDropdown.value = false;

    if (notification.redirectUrl) {

      router.push(notification.redirectUrl);

    } else {

      router.push("/notifications");

    }

  } catch (error) {

    console.log(error);

  }

};

// =========================
// USER INFO
// =========================

const name = computed(() => user.value.name || "");

const title = computed(() => {

  if (role.value === "admin")
    return "Admin Panel";

  if (role.value === "doctor")
    return "Doctor Panel";

  if (role.value === "patient")
    return "Patient Panel";

  return "Hospital";

});

const userRole = computed(() => {

  if (role.value === "admin")
    return "Admin";

  if (role.value === "doctor")
    return "Doctor";

  if (role.value === "patient")
    return "Patient";

  return "";

});

// =========================
// SOCKET
// =========================

onMounted(() => {

  getProfile();

  getNotifications();

  socket.on(
    "notification",
    (data) => {

      console.log(
        "Realtime Notification:",
        data
      );

      notifications.value.unshift({

        ...data,

        createdAt: new Date(),

        isRead: false

      });

    }

  );

});

onUnmounted(() => {

  socket.off("notification");

});
</script>

<template>

<nav class="navbar">

<div class="brand-section">

<!-- <div class="logo">
🏥
</div> -->

<div>

<h2>{{ title }}</h2>

<p>
Hospital Management System
</p>

</div>

</div>

<!-- Notification -->

<div class="notification-wrapper">

<div
class="notification-icon"
:class="{ ringing: unreadCount }"
@click="openNotificationPage"
>

🔔

<span
v-if="unreadCount"
class="notification-badge"
>
{{ badgeText }}
</span>

</div>

<div
v-if="showDropdown"
class="dropdown-backdrop"
@click="showDropdown=false"
></div>

<div
v-if="showDropdown"
class="notification-dropdown"
>

<div class="dropdown-header">

<h3>
Notifications
</h3>

<span class="dropdown-close" @click="showDropdown=false">✕</span>

</div>

<div class="dropdown-body">

<div
v-if="notifications.length===0"
class="empty"
>

No Notifications

</div>

<div

v-for="item in notifications.slice(0,5)"

:key="item._id"

class="notification-item"

:class="{
unread:!item.isRead
}"

@click="openNotification(item)"

>

<h4>

{{ item.title }}

</h4>

<p>

{{ item.message }}

</p>

<small>

{{ new Date(item.createdAt).toLocaleString() }}

</small>

</div>

</div>

<button
class="view-btn"
@click="openNotificationPage"
>

View All Notifications

</button>

</div>

</div>

<!-- User -->

<div class="user-section">

<div class="user-icon">

<img
v-if="user.profileImage"
:src="user.profileImage"
alt="Profile"
/>

<span v-else>
👤
</span>

</div>

<div class="user-info">

<span class="welcome">

Welcome back

</span>

<div class="role">

<span class="role-badge">

{{ userRole }}

</span>

<h4>

{{ name }}

</h4>

</div>

</div>

</div>

</nav>

</template>

<style scoped>

/* =========================
        NAVBAR
========================= */

.navbar{

    height:78px;
    min-height:78px;
    flex-shrink:0;

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:0 32px;

    position:sticky;
    top:0;
    z-index:50;


    background:
    rgba(255,255,255,.72);


    backdrop-filter:
    blur(22px) saturate(160%);


    -webkit-backdrop-filter:
    blur(22px) saturate(160%);


    border-bottom:
    1px solid rgba(226,232,240,.7);


    box-shadow:
    0 12px 30px rgba(15,23,42,.06);

    box-sizing:border-box;

}



/* =========================
        BRAND
========================= */


.brand-section{

display:flex;

align-items:center;

gap:15px;

min-width:0;

}



.logo{


width:54px;

height:54px;


border-radius:16px;


display:flex;

justify-content:center;

align-items:center;


font-size:26px;


background:

linear-gradient(

135deg,

#2563eb,

#06b6d4

);


color:white;


box-shadow:

0 15px 30px rgba(37,99,235,.35);


}




.brand-section h2{
    font-family:Arial, Helvetica, sans-serif;
font-size:19px;

color:#0f172a;

font-weight:800;

letter-spacing:.1px;

white-space:nowrap;

overflow:hidden;

text-overflow:ellipsis;


}



.brand-section p{


font-size:12.5px;

color:#64748b;


margin-top:3px;

white-space:nowrap;

font-weight:500;


}




/* =========================
        NOTIFICATION
========================= */


.notification-wrapper{

position:relative;

margin-left:auto;

margin-right:22px;

flex-shrink:0;

}



.notification-icon{


width:44px;

height:44px;


border-radius:50%;


display:flex;

align-items:center;

justify-content:center;


font-size:21px;


cursor:pointer;


background:

#f8fafc;


transition:.3s;


border:

1px solid #e2e8f0;


}



.notification-icon:hover{


background:#eff6ff;


border-color:#bfdbfe;


transform:

translateY(-3px) scale(1.04);


box-shadow:0 10px 22px rgba(37,99,235,.15);


}


.notification-icon.ringing{

    box-shadow:0 0 0 4px rgba(37,99,235,.08);

}



/* BADGE */


.notification-badge{


position:absolute;


top:-4px;

right:-4px;


min-width:20px;

height:20px;


padding:0 5px;


display:flex;

justify-content:center;

align-items:center;


border-radius:50%;


background:

linear-gradient(

135deg,

#f87171,

#dc2626

);


color:white;


font-size:10.5px;


font-weight:800;


border:2px solid white;


box-shadow:

0 4px 12px rgba(220,38,38,.45);


animation:badge-pulse 2.2s ease-in-out infinite;


}


@keyframes badge-pulse{

0%,100%{ transform:scale(1); }

50%{ transform:scale(1.12); }

}




/* =========================
        DROPDOWN BACKDROP
        (click-outside catcher, mobile only)
========================= */


.dropdown-backdrop{

display:none;

position:fixed;

inset:0;

z-index:59;

background:transparent;

}




/* =========================
        DROPDOWN
========================= */


.notification-dropdown{


position:absolute;


top:56px;


right:0;


width:380px;

max-width:calc(100vw - 24px);

max-height:min(70vh,520px);

display:flex;

flex-direction:column;


background:

rgba(255,255,255,.92);


backdrop-filter:

blur(24px) saturate(160%);


-webkit-backdrop-filter:

blur(24px) saturate(160%);


border-radius:18px;


overflow:hidden;


border:

1px solid rgba(226,232,240,.8);



box-shadow:

0 28px 70px rgba(15,23,42,.2);


z-index:60;


animation:dropdown-in .22s ease;


}


@keyframes dropdown-in{

from{ opacity:0; transform:translateY(-6px); }

to{ opacity:1; transform:translateY(0); }

}


.dropdown-header{

display:flex;

align-items:center;

justify-content:space-between;

padding:16px 18px;

border-bottom:

1px solid #e2e8f0;

flex-shrink:0;

background:linear-gradient(180deg,rgba(248,250,252,.9),transparent);

}


.dropdown-header h3{

font-size:16px;

font-weight:700;

color:#0f172a;

}


.dropdown-close{

display:none;

width:30px;

height:30px;

align-items:center;

justify-content:center;

border-radius:8px;

background:#f1f5f9;

color:#475569;

font-size:13px;

cursor:pointer;

transition:.2s;

}


.dropdown-close:hover{

background:#e2e8f0;

}


.dropdown-body{

overflow-y:auto;

flex:1;

}




/* =========================
        ITEMS
========================= */


.notification-item{


padding:15px 18px;


cursor:pointer;


border-bottom:

1px solid #f1f5f9;


transition:.25s;


}



.notification-item:hover{


background:#f8fafc;


transform:

translateX(3px);


}



.notification-item.unread{


background:

linear-gradient(

90deg,

#eff6ff,

white

);


border-left:

3px solid #2563eb;


}



.notification-item h4{


font-size:14.5px;

font-weight:700;


color:#0f172a;


margin-bottom:5px;


}



.notification-item p{


font-size:13px;


color:#64748b;


line-height:1.5;


}



.notification-item small{


display:block;


margin-top:7px;


font-size:11px;


color:#94a3b8;


}



/* =========================
        VIEW BUTTON
========================= */


.view-btn{


width:100%;


padding:14px;


border:none;


cursor:pointer;


font-weight:700;

font-size:13.5px;


color:white;


flex-shrink:0;


background:


linear-gradient(

135deg,

#2563eb,

#06b6d4

);


transition:.3s;


}



.view-btn:hover{


filter:

brightness(1.1);


}




/* =========================
        USER
========================= */


.user-section{


display:flex;


align-items:center;


gap:12px;


flex-shrink:0;

padding-left:14px;

border-left:1px solid rgba(226,232,240,.9);


}



.user-icon{

width:44px;
height:44px;

flex-shrink:0;

border-radius:50%;

display:flex;
justify-content:center;
align-items:center;

overflow:hidden;

font-size:20px;

background:
linear-gradient(
135deg,
#eff6ff,
#dbeafe
);

border:
2px solid white;

box-shadow:0 0 0 2px #bfdbfe, 0 6px 16px rgba(37,99,235,.18);

transition:.25s;

}


.user-icon:hover{

box-shadow:0 0 0 2px #93c5fd, 0 8px 20px rgba(37,99,235,.25);

}


.user-icon img{

width:100%;
height:100%;

object-fit:cover;

border-radius:50%;

}



.user-info{

min-width:0;

}



.welcome{


font-size:11.5px;


color:#94a3b8;

font-weight:500;


}



.role{


display:flex;


align-items:center;


gap:9px;

margin-top:2px;


}



.role h4{


font-size:14.5px;

font-weight:700;


color:#0f172a;

white-space:nowrap;

overflow:hidden;

text-overflow:ellipsis;

max-width:140px;


}



.role-badge{


padding:4px 11px;


border-radius:30px;


font-size:10.5px;


font-weight:800;

letter-spacing:.02em;


color:white;

white-space:nowrap;


background:


linear-gradient(

135deg,

#2563eb,

#06b6d4

);


box-shadow:

0 5px 14px rgba(37,99,235,.3);


}




/* =========================
        EMPTY
========================= */


.empty{


padding:34px 20px;


text-align:center;


color:#94a3b8;

font-size:13.5px;


}


/* =========================
        RESPONSIVE
========================= */


@media(max-width:1024px){

.navbar{

    padding:0 20px;

}


.brand-section{

    flex:1;

}


.notification-wrapper{

    margin-right:15px;

}



}



/* =========================
      MOBILE FIXED ALIGNMENT
========================= */
/* =========================
   PERFECT MOBILE ALIGNMENT
   Hospital | Bell | User
========================= */


@media(max-width:768px){


.navbar{

    height:58px;
    min-height:58px;

    padding:0 12px;


    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:10px;

}



/* LEFT */

.brand-section{

    flex:1;

    min-width:0;

    display:flex;

    align-items:center;

}



.brand-section h2{

    font-size:15px;

    font-weight:800;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}



.brand-section p{

    display:none;

}



/* CENTER NOTIFICATION */


.notification-wrapper{

    flex-shrink:0;

    margin:0;

}



.notification-icon{

    width:40px;

    height:40px;

    font-size:18px;

}





/* RIGHT USER */


.user-section{

    flex-shrink:0;

    display:flex;

    align-items:center;

    gap:7px;

    padding-left:0;

    border-left:none;

}



.user-icon{

    width:40px;

    height:40px;

}



.user-info{

    display:block;

    max-width:70px;

}



.welcome{

    display:none;

}



.role{

    display:block;

}



.role-badge{

    display:none;

}



.role h4{

    display:block;

    font-size:12px;

    font-weight:700;

    max-width:70px;

    white-space:nowrap;

    overflow:hidden;

    text-overflow:ellipsis;

}




}





/* SMALL MOBILE */

@media(max-width:480px){


.navbar{

    height:54px;
    min-height:54px;

    padding:0 10px;

    gap:6px;

}



.brand-section h2{

    font-size:14px;

}



.notification-icon{

    width:36px;

    height:36px;

    font-size:17px;

}



.user-icon{

    width:36px;

    height:36px;

}



.user-info{

    max-width:65px;

}



.role h4{

    font-size:11px;

    max-width:65px;

}



}




/* VERY SMALL MOBILE */

@media(max-width:360px){


.navbar{

    padding:0 8px;

}



/* Hospital kabhi hide nahi hoga */

.brand-section{

    flex:1;

    display:flex;

}



.brand-section h2{

    font-size:13px;

}



/* Bell */

.notification-icon{

    width:34px;

    height:34px;

}



/* User */

.user-section{

    gap:5px;

}



.user-icon{

    width:34px;

    height:34px;

}



.user-info{

    display:block;

    max-width:50px;

}



.role h4{

    font-size:10px;

    max-width:50px;

}



}
</style>