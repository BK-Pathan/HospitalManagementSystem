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
@click="toggleDropdown"
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
class="notification-dropdown"
>

<h3>
Notifications
</h3>

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

Welcome

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

height:82px;

display:flex;

justify-content:space-between;

align-items:center;

padding:0 32px;

position:relative;

z-index:50;


background:

rgba(255,255,255,.75);


backdrop-filter:

blur(20px);


-webkit-backdrop-filter:

blur(20px);


border-bottom:

1px solid rgba(226,232,240,.8);


box-shadow:

0 10px 35px rgba(15,23,42,.08);

}



/* =========================
        BRAND
========================= */


.brand-section{

display:flex;

align-items:center;

gap:15px;

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


font-size:20px;

color:#0f172a;

font-weight:700;


}



.brand-section p{


font-size:13px;

color:#64748b;


margin-top:3px;


}




/* =========================
        NOTIFICATION
========================= */


.notification-wrapper{

position:relative;

margin-left:auto;

margin-right:30px;

}



.notification-icon{


width:45px;

height:45px;


border-radius:50%;


display:flex;

align-items:center;

justify-content:center;


font-size:24px;


cursor:pointer;


background:

#f8fafc;


transition:.3s;


border:

1px solid #e2e8f0;


}



.notification-icon:hover{


background:#eff6ff;


transform:

translateY(-3px);


}



/* BADGE */


.notification-badge{


position:absolute;


top:-5px;

right:-5px;


min-width:21px;

height:21px;


padding:0 5px;


display:flex;

justify-content:center;

align-items:center;


border-radius:50%;


background:

linear-gradient(

135deg,

#ef4444,

#dc2626

);


color:white;


font-size:11px;


font-weight:700;


box-shadow:

0 5px 15px rgba(239,68,68,.35);


}




/* =========================
        DROPDOWN
========================= */


.notification-dropdown{


position:absolute;


top:58px;


right:0;


width:380px;


background:

rgba(255,255,255,.9);


backdrop-filter:

blur(20px);


-webkit-backdrop-filter:

blur(20px);


border-radius:20px;


overflow:hidden;


border:

1px solid rgba(226,232,240,.8);



box-shadow:

0 25px 70px rgba(15,23,42,.18);


}



.notification-dropdown h3{


padding:18px;


font-size:18px;


color:#0f172a;


border-bottom:

1px solid #e2e8f0;


}




/* =========================
        ITEMS
========================= */


.notification-item{


padding:16px;


cursor:pointer;


border-bottom:

1px solid #f1f5f9;


transition:.3s;


}



.notification-item:hover{


background:#f8fafc;


transform:

translateX(4px);


}



.notification-item.unread{


background:

linear-gradient(

90deg,

#eff6ff,

white

);


border-left:

4px solid #2563eb;


}



.notification-item h4{


font-size:15px;


color:#0f172a;


margin-bottom:6px;


}



.notification-item p{


font-size:13px;


color:#64748b;


line-height:1.5;


}



.notification-item small{


display:block;


margin-top:8px;


font-size:11px;


color:#94a3b8;


}



/* =========================
        VIEW BUTTON
========================= */


.view-btn{


width:100%;


padding:15px;


border:none;


cursor:pointer;


font-weight:700;


color:white;


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


gap:14px;


}



.user-icon{

width:46px;
height:46px;

border-radius:50%;

display:flex;
justify-content:center;
align-items:center;

overflow:hidden;

font-size:22px;

background:
linear-gradient(
135deg,
#eff6ff,
#dbeafe
);

border:
1px solid #bfdbfe;

}


.user-icon img{

width:100%;
height:100%;

object-fit:cover;

border-radius:50%;

}



.welcome{


font-size:12px;


color:#94a3b8;


}



.role{


display:flex;


align-items:center;


gap:10px;


}



.role h4{


font-size:15px;


color:#0f172a;


}



.role-badge{


padding:5px 12px;


border-radius:30px;


font-size:11px;


font-weight:700;


color:white;


background:


linear-gradient(

135deg,

#2563eb,

#06b6d4

);


box-shadow:

0 5px 15px rgba(37,99,235,.25);


}




/* =========================
        EMPTY
========================= */


.empty{


padding:30px;


text-align:center;


color:#64748b;


}



/* =========================
        RESPONSIVE
========================= */


@media(max-width:768px){


.navbar{


padding:0 15px;


}


.brand-section p{


display:none;


}


.brand-section h2{


font-size:16px;


}



.notification-wrapper{


margin-right:10px;


}



.notification-dropdown{


width:300px;


}



.user-info{


display:none;


}


}


</style>