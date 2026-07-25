<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api/axios";
import socket from "../socket";

const router = useRouter();

const notifications = ref([]);
const loading = ref(true);

// ======================
// LOAD
// ======================

const getNotifications = async () => {

  try {

    const res = await api.get("/notifications");

    notifications.value = res.data;

  } catch (error) {

    console.log(error);

  } finally {

    loading.value = false;

  }

};

// ======================
// ICON
// ======================

const getIcon = (type) => {

  switch(type){

    case "appointment":
      return "📅";

    case "reschedule":
      return "🔄";

    case "prescription":
      return "💊";

    case "system":
      return "⚙️";

    default:
      return "🔔";

  }

};

// ======================
// MARK READ
// ======================

const markRead = async(notification)=>{

  try{

    if(notification.isRead) return;

    await api.patch(
      `/notifications/${notification._id}/read`
    );

    notification.isRead=true;

  }

  catch(error){

    console.log(error);

  }

};

// ======================
// DELETE
// ======================

const removeNotification = async(id)=>{

  try{

    const ok=confirm(
      "Delete this notification?"
    );

    if(!ok) return;

    await api.delete(
      `/notifications/${id}`
    );

    notifications.value=
      notifications.value.filter(
        n=>n._id!==id
      );

  }

  catch(error){

    console.log(error);

  }

};

// ======================
// OPEN
// ======================

const openNotification = async(notification)=>{

  await markRead(notification);

  if(notification.redirectUrl){

    router.push(
      notification.redirectUrl
    );

  }

};

// ======================
// SOCKET
// ======================

onMounted(()=>{

  getNotifications();

  socket.on(
    "notification",
    (data)=>{

      console.log(
        "Realtime Notification:",
        data
      );

      notifications.value.unshift({

        ...data,

        createdAt:new Date(),

        isRead:false

      });

    }

  );

});

onUnmounted(()=>{

  socket.off("notification");

});
</script>

<template>

<div class="page">

<h1>

🔔 Notifications

</h1>

<div
v-if="loading"
class="loading"
>

Loading...

</div>

<div
v-else-if="notifications.length===0"
class="empty"
>

<div class="emoji">

🔔

</div>

<h2>

You're all caught up

</h2>

<p>

No new notifications

</p>

</div>

<div
v-else
class="list"
>

<div

v-for="item in notifications"

:key="item._id"

class="card"

:class="{

unread:!item.isRead

}"

>

<div
class="left"
@click="openNotification(item)"
>

<div class="icon">

{{getIcon(item.type)}}

</div>

<div class="content">

<h3>

{{item.title}}

</h3>

<p>

{{item.message}}

</p>

<small>

{{new Date(item.createdAt).toLocaleString()}}

</small>

</div>

</div>

<div class="actions">

<button

v-if="!item.isRead"

class="read"

@click="markRead(item)"

>

Mark Read

</button>

<button

class="delete"

@click="removeNotification(item._id)"

>

Delete

</button>

</div>

</div>

</div>

</div>

</template>

<style scoped>

.page{

padding:25px;

}

.page h1{

margin-bottom:25px;

color:#0f172a;

}

.loading{

padding:40px;

text-align:center;

}

.empty{

background:white;

padding:60px;

border-radius:18px;

text-align:center;

box-shadow:0 5px 20px rgba(0,0,0,.06);

}

.emoji{

font-size:70px;

margin-bottom:20px;

}

.list{

display:flex;

flex-direction:column;

gap:18px;

}

.card{

display:flex;

justify-content:space-between;

align-items:center;

background:white;

padding:22px;

border-radius:18px;

box-shadow:0 5px 18px rgba(0,0,0,.06);

transition:.3s;

}

.card:hover{

transform:translateY(-3px);

}

.unread{

border-left:5px solid #14B8A6;

background:#f0fdfa;

}

.left{

display:flex;

gap:20px;

cursor:pointer;

flex:1;

}

.icon{

font-size:34px;

display:flex;

align-items:center;

}

.content h3{

margin-bottom:6px;

color:#0f172a;

}

.content p{

margin-bottom:10px;

color:#64748b;

}

.content small{

color:#94a3b8;

}

.actions{

display:flex;

gap:10px;

}

.read{

border:none;

padding:9px 15px;

border-radius:8px;

background:#14B8A6;

color:white;

cursor:pointer;

}

.delete{

border:none;

padding:9px 15px;

border-radius:8px;

background:#ef4444;

color:white;

cursor:pointer;

}

@media(max-width:700px){

.card{

flex-direction:column;

align-items:flex-start;

gap:20px;

}

.actions{

width:100%;

}

.actions button{

flex:1;

}

}

</style>