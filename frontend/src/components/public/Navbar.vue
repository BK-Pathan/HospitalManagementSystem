<template>
  <header class="navbar">

    <div class="container">

      <!-- Logo -->
      <a href="#" class="logo">

        <div class="logo-icon">
          🏥
        </div>

        <div>
          <h2>MediCare</h2>
          <span>Hospital & Healthcare</span>
        </div>

      </a>

      <!-- Navigation -->

      <nav :class="['nav-menu', { active: menuOpen }]">

        <a href="#">Home</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#doctors">Doctors</a>
        <a href="#contact">Contact</a>

      </nav>

      <!-- Buttons -->

      <div class="actions">

        <router-link
          to="/login"
          class="login-btn"
        >
          Login
        </router-link>

        <a
          href="#contact"
          class="book-btn"
        >
          Book Appointment
        </a>

      </div>

      <!-- Mobile Menu -->

      <button
        class="menu-btn"
        @click="menuOpen = !menuOpen"
      >
        ☰
      </button>

    </div>

  </header>
</template>

<script setup>
import { ref } from "vue";

const menuOpen = ref(false);
</script>

<style scoped>

.navbar{

    position:sticky;
    top:0;
    z-index:1000;

    background:rgba(255,255,255,.95);

    backdrop-filter:blur(18px);

    border-bottom:1px solid var(--border);

    box-shadow:var(--shadow);

}

.container{

    max-width:1300px;
    margin:auto;

    padding:18px 25px;

    display:flex;
    align-items:center;
    justify-content:space-between;

}

/* Logo */

.logo{

    display:flex;
    align-items:center;
    gap:14px;

    text-decoration:none;

}

.logo-icon{

    width:58px;
    height:58px;

    border-radius:18px;

    display:flex;
    align-items:center;
    justify-content:center;

    font-size:28px;

    background:linear-gradient(135deg,var(--primary),var(--secondary));

    color:white;

    box-shadow:0 12px 25px rgba(20,184,166,.25);

}

.logo h2{

    color:var(--primary);

    font-size:28px;
    margin:0;
    font-weight:800;

}

.logo span{

    color:var(--muted);

    font-size:13px;

}

/* Menu */

.nav-menu{

    display:flex;
    gap:35px;

}

.nav-menu a{

    text-decoration:none;

    color:var(--text);

    font-weight:600;

    transition:.3s;

    position:relative;

}

.nav-menu a::after{

    content:"";

    position:absolute;

    bottom:-8px;
    left:0;

    width:0;
    height:3px;

    background:var(--secondary);

    transition:.3s;

}

.nav-menu a:hover{

    color:var(--primary);

}

.nav-menu a:hover::after{

    width:100%;

}

/* Buttons */

.actions{

    display:flex;
    gap:15px;

}

.actions a{

    text-decoration:none;

}

.login-btn{

    padding:12px 28px;

    border:2px solid var(--primary);

    border-radius:40px;

    color:var(--primary);

    font-weight:700;

    transition:.3s;

}

.login-btn:hover{

    background:var(--primary);

    color:white;

}

.book-btn{

    padding:12px 28px;

    border-radius:40px;

    background:linear-gradient(135deg,var(--primary),var(--secondary));

    color:white;

    font-weight:700;

    box-shadow:0 10px 25px rgba(20,184,166,.25);

    transition:.3s;

}

.book-btn:hover{

    transform:translateY(-3px);

}

/* Mobile */

.menu-btn{

    display:none;

    background:none;

    border:none;

    font-size:34px;

    cursor:pointer;

    color:var(--primary);

}

@media(max-width:992px){

.nav-menu,
.actions{

display:none;

}

.nav-menu.active{

display:flex;

flex-direction:column;

position:absolute;

left:20px;
right:20px;
top:90px;

background:white;

padding:30px;

border-radius:20px;

box-shadow:var(--shadow);

}

.actions{

display:none;

}

.nav-menu.active + .actions{

display:flex;

}

.menu-btn{

display:block;

}

}

</style>