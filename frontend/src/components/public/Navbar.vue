<template>
  <header class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="navbar__inner">
      <!-- Logo -->
      <RouterLink to="/" class="navbar__logo" @click="closeMenu">
        <span class="navbar__logo-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="currentColor"
              d="M11 2h2v7h7v2h-7v7h-2v-7H4V9h7z"
            />
          </svg>
        </span>
        <span class="navbar__logo-text">
          Care<span class="navbar__logo-accent">Plus</span>
          <small>Medical</small>
        </span>
      </RouterLink>

      <!-- Desktop nav links -->
      <nav class="navbar__links" aria-label="Primary">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="navbar__link"
          :class="{ 'navbar__link--active': isActive(link) }"
          @click="handleLinkClick(link)"
        >
          {{ link.label }}
        </a>
      </nav>

      <!-- Desktop actions -->
<div class="navbar__actions">

  <button 
    class="navbar__login"
    type="button"
    @click="goLogin"
  >
    Login
  </button>

  <button 
    class="navbar__cta"
    type="button"
    @click="goLogin"
  >
    Appointment
  </button>

</div>

      <!-- Mobile toggle -->
<!-- Mobile toggle -->
<button
class="navbar__toggle"
:class="{ 'navbar__toggle--open': menuOpen }"
@click="menuOpen=!menuOpen"
>

<span></span>
<span></span>
<span></span>

</button>
    </div>

    <!-- Mobile menu -->
    <Transition name="navbar-slide">
      <div v-if="menuOpen" class="navbar__mobile">
        <a
          v-for="link in navLinks"
          :key="link.label"
          :href="link.href"
          class="navbar__mobile-link"
          :class="{ 'navbar__link--active': isActive(link) }"
          @click="handleLinkClick(link)"
        >
          {{ link.label }}
        </a>
        <div class="navbar__mobile-actions">
          <RouterLink to="/login" class="navbar__login navbar__login--mobile" @click="closeMenu">
            Login
          </RouterLink>
          <RouterLink to="/login" class="navbar__cta navbar__cta--mobile" @click="closeMenu">
            Appointment
          </RouterLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuOpen = ref(false)
const scrolled = ref(false)
const activeHash = ref('') // tracks which section is currently in view while scrolling

const navLinks = [
  { label: 'Home', href: '/', type: 'route' },
  { label: 'Departments', href: '/#departments', type: 'hash', hash: '#departments' },
  { label: 'About', href: '/#about', type: 'hash', hash: '#about' },
  { label: 'Services', href: '/#services', type: 'hash', hash: '#services' },
    { label: 'Team', href: '/#doctor', type: 'hash', hash: '#doctor' },
    { label: 'Reviews', href: '/#reviews', type: 'hash', hash: '#reviews' },
  { label: 'Contact', href: '/#contact', type: 'hash', hash: '#contact' },
]

let observer = null

function closeMenu() {
  menuOpen.value = false
}

// Highlights "Home" for the bare route, or the matching hash link
// based on which section is currently scrolled into view.
function isActive(link) {
  if (link.type === 'route') {
    return route.path === '/' && !activeHash.value
  }
  return route.path === '/' && activeHash.value === link.hash
}

// Smooth-scrolls to in-page sections instead of a hard reload,
// and still works correctly when navigating in from another route.
function handleLinkClick(link) {
  closeMenu()

  if (link.type === 'route') {
    activeHash.value = ''
    return
  }

  const scrollToHash = () => {
    const el = document.querySelector(link.hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (route.path !== '/') {
    // Navigate home first, then scroll once the page has mounted.
    router.push({ path: '/', hash: link.hash }).then(() => {
      requestAnimationFrame(scrollToHash)
    })
  } else {
    router.replace({ path: '/', hash: link.hash })
    scrollToHash()
  }
}

function handleScroll() {
  scrolled.value = window.scrollY > 8
}

function goLogin(){

    closeMenu();
    // console.log("LOGIN CLICKED");


    router.push("/login");

}

// Watches each in-page section and updates activeHash to whichever
// one is currently centered in the viewport, so the navbar link
// highlights automatically while the user scrolls (not just on click).
function setupScrollSpy() {
  const sectionHashes = navLinks.filter(l => l.type === 'hash').map(l => l.hash)
  const sections = sectionHashes
    .map(hash => ({ hash, el: document.querySelector(hash) }))
    .filter(s => s.el)

  if (!sections.length) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const match = sections.find(s => s.el === entry.target)
          if (match) activeHash.value = match.hash
        }
      })

      // Near the very top of the page, treat "Home" as active.
      if (window.scrollY < 100) activeHash.value = ''
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  )

  sections.forEach(s => observer.observe(s.el))
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  requestAnimationFrame(setupScrollSpy)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.navbar {

    position:fixed;
    top:10px;
    left:50%;
    transform:translateX(-50%);
  /* top:16px; */
  z-index:50;

  width:calc(100% - 40px);
  max-width:1200px;

  margin:0 auto;

  background:
  rgba(255,255,255,0.55);

  backdrop-filter:
  blur(24px);

  -webkit-backdrop-filter:
  blur(24px);

  border:
  1px solid rgba(255,255,255,.65);

  border-radius:24px;

  box-shadow:

  0 20px 60px rgba(15,23,42,.08),

  inset 0 1px 1px rgba(255,255,255,.8);

  transition:
  all .35s ease;

}
.navbar::before{

content:"";

position:absolute;

inset:0;

border-radius:24px;

background:

linear-gradient(
120deg,
rgba(255,255,255,.45),
transparent 40%
);

pointer-events:none;

}
.navbar--scrolled{

background:

rgba(255,255,255,.65);

box-shadow:

0 25px 70px rgba(15,23,42,.12),

inset 0 1px 1px rgba(255,255,255,.9);

}

.navbar__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.85rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

/* Logo */
.navbar__logo {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  flex-shrink: 0;
}

.navbar__logo-icon{

background:

linear-gradient(
135deg,
#2563eb,
#60a5fa
);

box-shadow:

0 10px 25px rgba(37,99,235,.35);

}

.navbar__logo-text {
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.1;
  color: #0d3b40;
  letter-spacing: -0.01em;
  display: flex;
  flex-direction: column;
}

.navbar__logo-accent {
  color: #17909c;
}

.navbar__logo-text small {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: #5c8a8f;
  text-transform: uppercase;
}

/* Desktop links */
.navbar__links {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex: 1;
  justify-content: center;
}

.navbar__link {
  position: relative;
  font-size: 0.95rem;
  font-weight: 500;
  color: #33555a;
  text-decoration: none;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  transition: color 0.2s ease, background 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
}

.navbar__link:hover {
  color: #0f7680;
  background: rgba(23, 144, 156, 0.08);
}

.navbar__link--active {
  color: #fff;
  font-weight: 600;
  background: linear-gradient(135deg, #17909c, #2563eb);
  box-shadow: 0 8px 20px rgba(23, 144, 156, 0.35);
}

.navbar__link--active:hover {
  color: #fff;
  background: linear-gradient(135deg, #17909c, #2563eb);
}

/* Actions */
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  flex-shrink: 0;
}

/* .navbar__login {
  font-size: 0.9rem;
  font-weight: 600;
  color: #33555a;
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar__login:hover {
  color: #0f7680;
} */

.navbar__cta,
.navbar__login
{

display:inline-flex;

align-items:center;

justify-content:center;

padding:.65rem 1.5rem;

border-radius:999px;

background:

linear-gradient(
135deg,
#2563eb,
#60a5fa
);

color:white;

font-size:.9rem;

font-weight:600;

box-shadow:

0 15px 35px rgba(37,99,235,.35);

transition:.3s ease;

}

.navbar__cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px -8px rgba(15, 118, 128, 0.75);
}

/* Mobile toggle */
.navbar__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.navbar__toggle span {
  display: block;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  background: #0d3b40;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.navbar__toggle--open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.navbar__toggle--open span:nth-child(2) {
  opacity: 0;
}

.navbar__toggle--open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile menu panel */
.navbar__mobile{

background:

rgba(255,255,255,.65);

backdrop-filter:

blur(25px);

-webkit-backdrop-filter:

blur(25px);

border-radius:

0 0 24px 24px;

border:

1px solid rgba(255,255,255,.5);

}

.navbar-slide-enter-active,
.navbar-slide-leave-active {
  transition: max-height 0.25s ease, opacity 0.25s ease;
  overflow: hidden;
}

.navbar-slide-enter-from,
.navbar-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.navbar-slide-enter-to,
.navbar-slide-leave-from {
  max-height: 420px;
  opacity: 1;
}

@media (max-width: 860px) {
  .navbar__links,
  .navbar__actions {
    display: none;
  }

  .navbar__toggle {
    display: flex;
  }

  .navbar__mobile {
    display: flex;
    flex-direction: column;
    padding: 0.5rem 1.5rem 1.25rem;
    background: rgba(255, 255, 255, 0.96);
    border-top: 1px solid rgba(15, 118, 128, 0.08);
  }

  .navbar__mobile-link {
    padding: 0.75rem 0.9rem;
    font-size: 1rem;
    font-weight: 500;
    color: #33555a;
    text-decoration: none;
    border-bottom: 1px solid rgba(15, 118, 128, 0.08);
    border-radius: 999px;
    transition: color 0.2s ease, background 0.25s ease;
  }

  .navbar__mobile-link.navbar__link--active {
    color: #fff;
    font-weight: 600;
    background: linear-gradient(135deg, #17909c, #2563eb);
    border-bottom-color: transparent;
    box-shadow: 0 8px 20px rgba(23, 144, 156, 0.3);
  }

  .navbar__mobile-actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .navbar__login--mobile {
    text-align: center;
    padding: 0.7rem 0;
    border: 1px solid rgba(15, 118, 128, 0.25);
    border-radius: 999px;
  }

  .navbar__cta--mobile {
    width: 100%;
  }
}

@media (max-width: 400px) {
  .navbar__logo-text small {
    display: none;
  }
}

.navbar__login,
.navbar__cta{
  border:none;
  cursor:pointer;
  font-family:inherit;
}
</style>