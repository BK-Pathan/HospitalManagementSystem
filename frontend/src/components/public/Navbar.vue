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

const navLinks = [
  { label: 'Home', href: '/', type: 'route' },
  { label: 'Doctors', href: '/#doctors', type: 'hash', hash: '#doctors' },
  { label: 'Services', href: '/#services', type: 'hash', hash: '#services' },
  { label: 'About', href: '/#about', type: 'hash', hash: '#about' },
  { label: 'Contact', href: '/#contact', type: 'hash', hash: '#contact' },
]

function closeMenu() {
  menuOpen.value = false
}

// Highlights "Home" for the bare route, or the matching hash link
// when the current URL hash matches.
function isActive(link) {
  if (link.type === 'route') {
    return route.path === '/' && !route.hash
  }
  return route.path === '/' && route.hash === link.hash
}

// Smooth-scrolls to in-page sections instead of a hard reload,
// and still works correctly when navigating in from another route.
function handleLinkClick(link) {
  closeMenu()

  if (link.type === 'route') {
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
    console.log("LOGIN CLICKED");


    router.push("/login");

}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(15, 118, 128, 0.08);
  transition: box-shadow 0.25s ease, background 0.25s ease;
}

.navbar--scrolled {
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 8px 24px -12px rgba(13, 95, 105, 0.25);
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

.navbar__logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  color: #ffffff;
  background: linear-gradient(135deg, #38b6c4, #0f7680);
  box-shadow: 0 4px 10px -3px rgba(15, 118, 128, 0.55);
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
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.navbar__link {
  position: relative;
  font-size: 0.95rem;
  font-weight: 500;
  color: #33555a;
  text-decoration: none;
  padding: 0.35rem 0;
  transition: color 0.2s ease;
}

.navbar__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 2px;
  background: #17909c;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s ease;
}

.navbar__link:hover {
  color: #0f7680;
}

.navbar__link:hover::after {
  transform: scaleX(1);
}

.navbar__link--active {
  color: #0f7680;
  font-weight: 600;
}

.navbar__link--active::after {
  transform: scaleX(1);
}

/* Actions */
.navbar__actions {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  flex-shrink: 0;
}

.navbar__login {
  font-size: 0.9rem;
  font-weight: 600;
  color: #33555a;
  text-decoration: none;
  transition: color 0.2s ease;
}

.navbar__login:hover {
  color: #0f7680;
}

.navbar__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 1.35rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #2bb4c2, #0f7680);
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 8px 18px -8px rgba(15, 118, 128, 0.65);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
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
.navbar__mobile {
  display: none;
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
    padding: 0.75rem 0;
    font-size: 1rem;
    font-weight: 500;
    color: #33555a;
    text-decoration: none;
    border-bottom: 1px solid rgba(15, 118, 128, 0.08);
  }

  .navbar__mobile-link.navbar__link--active {
    color: #0f7680;
    font-weight: 600;
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