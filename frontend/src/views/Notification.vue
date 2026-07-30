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

      // console.log(
      //   "Realtime Notification:",
      //   data
      // );

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

<div class="page-header">

  <div class="header-left">

<button
  class="back-btn"
  @click="router.back()"
  aria-label="Go back"
>
  <svg 
    width="22px" 
    height="22px" 
    viewBox="0 0 32 32" 
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M14.389 7.956v4.374l1.056 0.010c7.335 0.071 11.466 3.333 12.543 9.944-4.029-4.661-8.675-4.663-12.532-4.664h-1.067v4.337l-9.884-7.001 9.884-7zM15.456 5.893l-12.795 9.063 12.795 9.063v-5.332c5.121 0.002 9.869 0.26 13.884 7.42 0-4.547-0.751-14.706-13.884-14.833v-5.381z"
      fill="currentColor"
    />
  </svg>
</button>

    <div>
      <p class="eyebrow">Inbox</p>
      <h1>🔔 Notifications</h1>
    </div>

  </div>

  <span
  class="unread-badge"
  v-if="notifications.some(n => !n.isRead)"
  >
    {{ notifications.filter(n => !n.isRead).length }} unread
  </span>

</div>

<div
v-if="loading"
class="loading"
>

  <div class="spinner"></div>
  <p>Loading notifications...</p>

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

<div
class="icon"
:class="'icon--' + (item.type || 'default')"
>

{{getIcon(item.type)}}

<span class="unread-dot" v-if="!item.isRead"></span>

</div>

<div class="content">

<div class="content-top">
  <h3>
  {{item.title}}
  </h3>

  <span class="type-tag" v-if="item.type">{{ item.type }}</span>
</div>

<p>

{{item.message}}

</p>

<small>

🕒 {{new Date(item.createdAt).toLocaleString()}}

</small>

</div>

</div>

<div class="actions">

<button

v-if="!item.isRead"

class="read"

@click="markRead(item)"

>

<svg viewBox="0 0 24 24" fill="none"><path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>

Mark Read

</button>

<button

class="delete"

@click="removeNotification(item._id)"

>

<svg viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>

Delete

</button>

</div>

</div>

</div>

</div>

</template>

<style scoped>

.page{

  --n-navy: #0f172a;
  --n-teal: #14B8A6;
  --n-teal-dark: #0d9488;
  --n-teal-light: #f0fdfa;
  --n-muted: #64748b;
  --n-faint: #94a3b8;
  --n-border: #e2e8f0;
  --n-bg: #f4f7fa;
  --n-red: #ef4444;
  --n-red-light: #fee2e2;
  --n-blue: #2563eb;
  --n-blue-light: #dbeafe;
  --n-amber: #d97706;
  --n-amber-light: #fef3c7;
  --n-slate: #475569;
  --n-slate-light: #f1f5f9;

  padding: 25px;
  background: var(--n-bg);
  min-height: 100%;

}

/* ---------- Header ---------- */

.page-header{

  display:flex;
  align-items:flex-end;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
  margin-bottom:25px;

}

.eyebrow{

  margin:0 0 4px;
  font-size:12px;
  font-weight:700;
  letter-spacing:.08em;
  text-transform:uppercase;
  color:var(--n-teal-dark);

}

.page h1{

margin:0;
color:var(--n-navy);
font-size: 26px;
font-weight: 800;
letter-spacing: -.01em;

}

.unread-badge{

  font-size:13px;
  font-weight:700;
  color:var(--n-teal-dark);
  background:var(--n-teal-light);
  border:1px solid rgba(13,148,136,.2);
  padding:7px 16px;
  border-radius:999px;
  white-space:nowrap;

}

/* ---------- Loading ---------- */

.loading{

  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:14px;
  padding:60px 0;
  color:var(--n-muted);

}

.spinner{

  width:32px;
  height:32px;
  border:3px solid var(--n-border);
  border-top-color:var(--n-teal);
  border-radius:50%;
  animation:spin .8s linear infinite;

}

@keyframes spin{
  to{ transform:rotate(360deg); }
}

/* ---------- Empty ---------- */

.empty{

background: linear-gradient(180deg, #ffffff 0%, #fbfdfe 100%);

padding:60px;

border-radius:18px;

text-align:center;

box-shadow:0 1px 2px rgba(15,23,42,.04), 0 8px 20px -10px rgba(15,23,42,.1);

border:1px solid var(--n-border);

}

.empty h2{

  margin:0 0 6px;
  color:var(--n-navy);
  font-size:19px;

}

.empty p{

  margin:0;
  color:var(--n-muted);

}

.emoji{

font-size:70px;

margin-bottom:20px;

}

.list{

display:flex;

flex-direction:column;

gap:14px;

}

.card{

display:flex;

justify-content:space-between;

align-items:center;

gap:16px;

background: linear-gradient(180deg, #ffffff 0%, #fbfdfe 100%);

padding:20px 22px;

border-radius:16px;

border:1px solid var(--n-border);

box-shadow:0 1px 2px rgba(15,23,42,.04), 0 6px 16px -10px rgba(15,23,42,.08);

transition: box-shadow .25s ease, transform .25s ease, border-color .25s ease;

}

.card:hover{

transform:translateY(-2px);

box-shadow:0 1px 2px rgba(15,23,42,.04), 0 14px 24px -12px rgba(15,23,42,.14);

}

.unread{

border-left:4px solid var(--n-teal);

background: linear-gradient(180deg, var(--n-teal-light) 0%, #ffffff 55%);

}

.left{

display:flex;

gap:16px;

cursor:pointer;

flex:1;

min-width:0;

}

.icon{

position:relative;

font-size:22px;

width:48px;

height:48px;

min-width:48px;

border-radius:50%;

display:flex;

align-items:center;

justify-content:center;

background:var(--n-slate-light);

}

.icon--appointment{

  background:var(--n-blue-light);

}

.icon--reschedule{

  background:var(--n-amber-light);

}

.icon--prescription{

  background:var(--n-teal-light);

}

.icon--system{

  background:var(--n-slate-light);

}

.unread-dot{

  position:absolute;
  top:-1px;
  right:-1px;
  width:11px;
  height:11px;
  border-radius:50%;
  background:var(--n-red);
  border:2px solid #fff;

}

.content{

  min-width:0;

}

.content-top{

  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
  margin-bottom:6px;

}

.content h3{

margin:0;

color:var(--n-navy);

font-size:15.5px;

font-weight:700;

overflow-wrap:break-word;

}

.type-tag{

  font-size:10.5px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.03em;
  color:var(--n-muted);
  background:var(--n-bg);
  border:1px solid var(--n-border);
  padding:2px 8px;
  border-radius:999px;

}

.content p{

margin-bottom:8px;

color:var(--n-muted);

font-size:14px;

line-height:1.5;

overflow-wrap:break-word;

}

.content small{

color:var(--n-faint);

font-size:12.5px;

}

.actions{

display:flex;

flex-direction:column;

gap:8px;

flex-shrink:0;

}

.read,
.delete{

border:none;

padding:9px 16px;

border-radius:9px;

cursor:pointer;

font-weight:600;

font-size:13px;

display:inline-flex;

align-items:center;

justify-content:center;

gap:6px;

white-space:nowrap;

transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;

}

.read svg,
.delete svg{

  width:14px;
  height:14px;

}

.read{

background: linear-gradient(135deg, var(--n-teal), var(--n-teal-dark));

color:white;

box-shadow:0 6px 14px -6px rgba(13,148,136,.4);

}

.delete{

background:var(--n-red-light);

color:var(--n-red);

}

.read:hover,
.delete:hover{

  transform:translateY(-2px);
  filter:brightness(1.03);

}

.read:active,
.delete:active{

  transform:translateY(0);

}

/* ================= RESPONSIVE ================= */

@media(max-width:900px){

    .page{
        padding:20px;
    }


    .card{

        padding:18px;

    }


    .left{

        gap:14px;

    }


    .icon{

        font-size:20px;
        width:42px;
        height:42px;
        min-width:42px;

    }

}



@media(max-width:700px){

    .page{

        padding:15px;

    }

    .page-header{

        margin-bottom:20px;

    }


    .page h1{

        font-size:22px;

    }

    .unread-badge{

        font-size:12px;
        padding:6px 13px;

    }


    .card{

        flex-direction:column;

        align-items:stretch;

        gap:14px;

        padding:16px;

        border-radius:14px;

    }


    .left{

        width:100%;

        gap:12px;

    }


    .icon{

        font-size:19px;
        width:38px;
        height:38px;
        min-width:38px;

    }


    .content h3{

        font-size:15px;

    }


    .content p{

        font-size:13.5px;

        line-height:1.5;

    }


    .content small{

        font-size:12px;

    }


    .actions{

        width:100%;

        flex-direction:row;

        gap:10px;

    }


    .actions button{

        flex:1;

        padding:10px;

        font-size:13px;

    }


    .empty{

        padding:40px 20px;

    }


    .emoji{

        font-size:55px;

    }

}



@media(max-width:380px){

    .page{

        padding:10px;

    }


    .page h1{

        font-size:19px;

    }


    .card{

        padding:13px;

    }


    .content-top{

        gap:6px;

    }


    .content h3{

        font-size:14px;

    }


    .content p{

        font-size:12.5px;

    }


    .actions{

        flex-direction:column;

    }


    .actions button{

        width:100%;

    }

}

.header-left{
  display:flex;
  align-items:center;
  gap:16px;
}


.back-btn{

  width:46px;
  height:46px;

  border-radius:14px;

  border:1px solid rgba(226,232,240,.8);

  background:rgba(255,255,255,.85);

  backdrop-filter:blur(10px);

  display:flex;
  align-items:center;
  justify-content:center;

  cursor:pointer;

  color:#0f172a;

  box-shadow:
  0 4px 12px rgba(15,23,42,.08),
  inset 0 1px 0 rgba(255,255,255,.7);

  transition:
  transform .25s ease,
  background .25s ease,
  color .25s ease,
  box-shadow .25s ease;

}


.back-btn svg{

  width:24px;
  height:24px;

  transition:transform .25s ease;

}


/* Hover */

.back-btn:hover{

  background:
  linear-gradient(
    135deg,
    #14B8A6,
    #0d9488
  );

  color:white;

  transform:translateX(-4px);

  box-shadow:
  0 10px 22px rgba(13,148,136,.25);

}


.back-btn:hover svg{

  transform:translateX(-2px);

}


/* Click */

.back-btn:active{

  transform:scale(.94);

}
</style>