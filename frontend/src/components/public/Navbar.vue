<template>
  <header class="navbar">

    <div class="container">

      <!-- Logo -->
      <a href="/" class="logo">

        <div class="logo-icon">
          <span class="logo-icon-glyph">🏥</span>
        </div>

        <div>
          <h2>MediCare</h2>
          <span>Hospital & Healthcare</span>
        </div>

      </a>

      <!-- Navigation -->

      <nav :class="['nav-menu', { active: menuOpen }]">

        <router-link to="/">
          Home
        </router-link>

        <router-link to="/#doctors">
          Doctors
        </router-link>

        <router-link to="/#services">
          Services
        </router-link>

        <router-link to="/#about">
          About
        </router-link>

        <router-link to="/#contact">
          Contact
        </router-link>

      </nav>

      <!-- Buttons -->

      <div class="actions">

        <router-link
          to="/login"
          class="login-btn"
        >
          Login
        </router-link>

        <router-link
          to="/login"
          class="book-btn"
        >
          <span>Appointment</span>
        </router-link>

      </div>

      <!-- Mobile Menu -->

      <button
        class="menu-btn"
        :class="{ active: menuOpen }"
        @click="menuOpen = !menuOpen"
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

    </div>

  </header>
</template>

<script setup>
import { ref } from "vue";

const menuOpen = ref(false);
</script>

<style scoped>

/* ============================================
   Local design tokens — layered on top of the
   global --primary / --secondary / --border /
   --shadow / --text / --muted variables already
   defined app-wide, so the navbar always stays
   on-brand automatically.
   ============================================ */

.navbar,
.navbar *{

    box-sizing:border-box;

}

.navbar{

    /* Depth system: three shadow layers simulate a
       floating glass panel instead of a flat bar */
    --nav-blur: 22px;
    --nav-bg: rgba(255,255,255,.72);
    --nav-border: rgba(255,255,255,.5);

    --shadow-ambient: 0 1px 1px rgba(15,23,42,.03);
    --shadow-key: 0 18px 40px -12px rgba(15,23,42,.16);
    --shadow-rim: inset 0 1px 0 rgba(255,255,255,.9);

    --glow-primary: 0 8px 20px -6px color-mix(in srgb, var(--primary) 55%, transparent);
    --glow-primary-lg: 0 22px 45px -14px color-mix(in srgb, var(--primary) 60%, transparent);

    --ease: cubic-bezier(.22,1,.36,1);

    position:sticky;
    top:0;
    z-index:1000;

    background:var(--nav-bg);

    backdrop-filter:blur(var(--nav-blur)) saturate(1.4);
    -webkit-backdrop-filter:blur(var(--nav-blur)) saturate(1.4);

    border-bottom:1px solid var(--nav-border);

    box-shadow:var(--shadow-ambient), var(--shadow-key), var(--shadow-rim);

    overflow-x:clip;

}

.container{

    max-width:1300px;
    width:100%;
    /* width:100px; */
    margin:auto;
    height:100px;
    padding:16px 25px;

    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:16px;

    /* gives child 3D transforms somewhere to project into */
    perspective:1200px;

}

.logo,
.nav-menu,
.actions{

    flex-shrink:0;

}

/* ============ Logo ============ */

.logo{

    display:flex;
    align-items:center;
    gap:14px;

    text-decoration:none;

}

.logo-icon{

    position:relative;

    flex-shrink:0;

    width:58px;
    height:58px;

    border-radius:18px;

    display:flex;
    align-items:center;
    justify-content:center;

    background:linear-gradient(155deg,var(--primary),var(--secondary) 120%);

    color:white;

    transform-style:preserve-3d;
    transform:perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0);

    /* stacked shadows: contact shadow + long throw + inner bevel highlight
       + inner bevel shade = the "3D chip" look */
    box-shadow:
        0 2px 4px rgba(0,0,0,.12),
        var(--glow-primary),
        inset 0 2px 2px rgba(255,255,255,.45),
        inset 0 -3px 5px rgba(0,0,0,.22);

    transition:transform .5s var(--ease), box-shadow .5s var(--ease);

}

.logo-icon-glyph{

    font-size:28px;

    filter:drop-shadow(0 2px 2px rgba(0,0,0,.25));

    transform:translateZ(10px);

}

.logo:hover .logo-icon{

    transform:perspective(600px) rotateX(10deg) rotateY(-14deg) translateZ(2px);

    box-shadow:
        0 6px 10px rgba(0,0,0,.14),
        var(--glow-primary-lg),
        inset 0 2px 2px rgba(255,255,255,.5),
        inset 0 -3px 5px rgba(0,0,0,.22);

}

.logo > div{

    min-width:0;

}

.logo h2{

    color:var(--primary);

    font-size:26px;
    line-height:1.15;
    margin:0;
    font-weight:800;
    letter-spacing:-.02em;

    white-space:nowrap;

}

.logo span{

    color:var(--muted);

    font-size:12.5px;
    font-weight:600;
    letter-spacing:.02em;

    white-space:nowrap;
    display:block;

}

/* ============ Menu ============ */

.nav-menu{

    display:flex;
    gap:8px;

}

.nav-menu a{

    position:relative;

    padding:10px 16px;
    border-radius:10px;

    text-decoration:none;

    color:var(--text);

    font-weight:600;
    font-size:15px;

    transition:color .3s var(--ease), background .3s var(--ease), transform .3s var(--ease);

}

.nav-menu a::before{

    /* soft "raised pill" that appears on hover, giving the
       impression the link lifts toward the user */
    content:"";

    position:absolute;
    inset:0;

    border-radius:10px;

    background:color-mix(in srgb, var(--primary) 8%, transparent);

    box-shadow:0 6px 14px -6px color-mix(in srgb, var(--primary) 35%, transparent);

    opacity:0;

    transform:translateY(4px) scale(.95);

    transition:opacity .3s var(--ease), transform .3s var(--ease);

    z-index:-1;

}

.nav-menu a::after{

    content:"";

    position:absolute;

    bottom:2px;
    left:16px;
    right:16px;

    height:2.5px;
    border-radius:2px;

    background:linear-gradient(90deg,var(--primary),var(--secondary));

    transform:scaleX(0);
    transform-origin:left;

    transition:transform .35s var(--ease);

}

.nav-menu a:hover{

    color:var(--primary);

    transform:translateY(-2px);

}

.nav-menu a:hover::before{

    opacity:1;

    transform:translateY(0) scale(1);

}

.nav-menu a:hover::after{

    transform:scaleX(1);

}

.nav-menu a.router-link-exact-active{

    color:var(--primary);

}

.nav-menu a.router-link-exact-active::after{

    transform:scaleX(1);

}

/* ============ Buttons ============ */

.actions{

    display:flex;
    align-items:center;
    gap:10px;

}

.actions a{

    text-decoration:none;

}

/* Both buttons share one compact glass sizing scale so they
   always stay visually paired, regardless of their color */

/* .login-btn, */
.book-btn{

    display:inline-flex;
    align-items:center;
    justify-content:center;

    padding:8px 28px;

    font-size:13.5px;
    font-weight:700;
    line-height:1.3;

    border-radius:40px;

}

.login-btn{

    border:1px solid rgba(255,255,255,.6);

    color:var(--primary);

    background:color-mix(in srgb, var(--primary) 10%, rgba(255,255,255,.35));

    backdrop-filter:blur(14px) saturate(1.6);
    -webkit-backdrop-filter:blur(14px) saturate(1.6);

    box-shadow:
        0 4px 12px -6px rgba(15,23,42,.18),
        inset 0 1px 0 rgba(255,255,255,.7),
        inset 0 -1px 2px rgba(255,255,255,.2);

    transition:transform .35s var(--ease), box-shadow .35s var(--ease), background .35s var(--ease), color .35s var(--ease);

    /* display:inline-flex;
    align-items:center; */
    justify-content:center;

    padding:8px 13px;

    font-size:13.5px;
    font-weight:700;
    line-height:1.3;
text-align:center;
    border-radius:40px;
}

.login-btn:hover{

    background:color-mix(in srgb, var(--primary) 22%, rgba(255,255,255,.4));
    color:var(--primary);

    transform:translateY(-3px);

    box-shadow:
        var(--glow-primary),
        inset 0 1px 0 rgba(255,255,255,.8),
        inset 0 -1px 2px rgba(255,255,255,.25);

}

.login-btn:active{

    transform:translateY(-1px);

}

.book-btn{

    position:relative;
    overflow:hidden;

    border:1px solid rgba(255,255,255,.35);

    background:linear-gradient(135deg,
        color-mix(in srgb, var(--primary) 82%, transparent),
        color-mix(in srgb, var(--secondary) 82%, transparent) 120%);

    backdrop-filter:blur(14px) saturate(1.6);
    -webkit-backdrop-filter:blur(14px) saturate(1.6);

    color:white;

    /* layered elevation: contact shadow, colored ambient glow,
       top-edge highlight, bottom-edge shade -> reads as a
       physically raised glass button */
    box-shadow:
        0 1px 1px rgba(0,0,0,.08),
        var(--glow-primary),
        inset 0 1.5px 1px rgba(255,255,255,.55),
        inset 0 -2px 4px rgba(0,0,0,.15);

    transition:transform .35s var(--ease), box-shadow .35s var(--ease);

}

.book-btn span{

    position:relative;
    z-index:1;

}

.book-btn::before{

    /* sheen sweep on hover */
    content:"";

    position:absolute;

    top:0;
    left:-60%;

    width:40%;
    height:100%;

    background:linear-gradient(115deg, transparent, rgba(255,255,255,.55), transparent);

    transform:skewX(-20deg);

    transition:left .6s var(--ease);

}

.book-btn:hover{

    transform:translateY(-4px) scale(1.015);

    box-shadow:
        0 4px 6px rgba(0,0,0,.1),
        var(--glow-primary-lg),
        inset 0 1.5px 1px rgba(255,255,255,.5),
        inset 0 -2px 4px rgba(0,0,0,.18);

}

.book-btn:hover::before{

    left:120%;

}

.book-btn:active{

    transform:translateY(-1px) scale(1);

}

/* ============ Mobile ============ */

.menu-btn{

    display:none;

    width:48px;
    height:48px;

    align-items:center;
    justify-content:center;
    flex-direction:column;
    gap:5px;

    background:rgba(255,255,255,.6);
    border:1px solid var(--nav-border);
    border-radius:12px;

    cursor:pointer;

    box-shadow:var(--shadow-ambient), 0 6px 14px -8px rgba(15,23,42,.25);

    transition:box-shadow .3s var(--ease), transform .3s var(--ease);

}

.menu-btn:hover{

    transform:translateY(-2px);

}

.menu-btn span{

    width:22px;
    height:2.5px;
    border-radius:2px;

    background:var(--primary);

    transition:transform .35s var(--ease), opacity .35s var(--ease);

}

.menu-btn.active span:nth-child(1){ transform:translateY(7.5px) rotate(45deg); }
.menu-btn.active span:nth-child(2){ opacity:0; }
.menu-btn.active span:nth-child(3){ transform:translateY(-7.5px) rotate(-45deg); }

@media(max-width:1200px){

.nav-menu,
.actions{

display:none;

}

.nav-menu.active{

display:flex;

flex-direction:column;
gap:4px;

position:absolute;

left:20px;
right:20px;
top:88px;

background:rgba(255,255,255,.92);
backdrop-filter:blur(var(--nav-blur));

padding:18px;

border:1px solid var(--nav-border);
border-radius:20px;

box-shadow:var(--shadow-key), var(--shadow-rim);

}

.nav-menu.active a::before{

display:none;

}

.nav-menu.active + .actions{

display:flex;

flex-direction:column;

position:absolute;

left:20px;
right:20px;
top:calc(88px + 240px);

padding:0 2px;

}

.menu-btn{

display:flex;

}

}

/* Respect reduced-motion preferences */
@media (prefers-reduced-motion: reduce){

  .navbar *{

    transition-duration:.01ms !important;
    animation-duration:.01ms !important;

  }

}

</style>