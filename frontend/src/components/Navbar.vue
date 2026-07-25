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

<div class="logo">
🏥
</div>

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

👤

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

.navbar{

height:80px;

display:flex;

justify-content:space-between;

align-items:center;

padding:0 30px;

background:white;

border-bottom:1px solid #eee;

box-shadow:0 4px 20px rgba(0,0,0,.05);

}

.brand-section{

display:flex;

align-items:center;

gap:15px;

}

.logo{

width:52px;

height:52px;

border-radius:15px;

display:flex;

justify-content:center;

align-items:center;

font-size:24px;

background:#14B8A6;

color:white;

}

.notification-wrapper{

position:relative;

}

.notification-icon{

position:relative;

font-size:28px;

cursor:pointer;

}

.notification-badge{

position:absolute;

top:-6px;

right:-8px;

width:20px;

height:20px;

background:red;

color:white;

border-radius:50%;

display:flex;

justify-content:center;

align-items:center;

font-size:11px;

font-weight:bold;

}

.notification-dropdown{

position:absolute;

top:45px;

right:0;

width:360px;

background:white;

border-radius:15px;

box-shadow:0 10px 30px rgba(0,0,0,.15);

overflow:hidden;

z-index:999;

}

.notification-dropdown h3{

padding:15px;

border-bottom:1px solid #eee;

}

.notification-item{

padding:15px;

cursor:pointer;

border-bottom:1px solid #f3f3f3;

transition:.3s;

}

.notification-item:hover{

background:#f8fafc;

}

.notification-item.unread{

background:#ecfeff;

border-left:4px solid #14B8A6;

}

.notification-item h4{

margin-bottom:5px;

}

.notification-item p{

font-size:14px;

color:#666;

}

.notification-item small{

font-size:12px;

color:#999;

}

.view-btn{

width:100%;

padding:14px;

border:none;

background:#14B8A6;

color:white;

cursor:pointer;

font-weight:bold;

}

.user-section{

display:flex;

align-items:center;

gap:12px;

}

.user-icon{

width:42px;

height:42px;

border-radius:50%;

display:flex;

justify-content:center;

align-items:center;

background:#f1f5f9;

}

.role{

display:flex;

align-items:center;

gap:10px;

}

.role-badge{

padding:4px 10px;

border-radius:20px;

background:#14B8A6;

color:white;

font-size:12px;

}

.empty{

padding:25px;

text-align:center;

color:#777;

}

</style>