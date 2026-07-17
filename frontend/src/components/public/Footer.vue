<template>
  <footer class="footer">

    <div class="container">

      <!-- Hospital Info -->
      <div class="footer-col">

        <div class="logo">
          🏥 MediCare
        </div>

        <p>
          Providing quality healthcare with compassion, advanced technology,
          and experienced medical professionals. Your health is always our priority.
        </p>

        <div class="socials">

          <a href="#">
            <i class="fab fa-facebook-f"></i>
          </a>

          <a href="#">
            <i class="fab fa-twitter"></i>
          </a>

          <a href="#">
            <i class="fab fa-instagram"></i>
          </a>

          <a href="#">
            <i class="fab fa-linkedin-in"></i>
          </a>

        </div>

      </div>

      <!-- Quick Links -->
      <div class="footer-col">

        <h3>Quick Links</h3>

        <ul>

         <router-link to="/">
Home
</router-link>


<router-link to="/doctors">
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

        </ul>

      </div>

      <!-- Departments -->
      <div class="footer-col">

        <h3>Departments</h3>

        <ul>

          <li>Cardiology</li>

          <li>Neurology</li>

          <li>Dental Care</li>

          <li>Orthopedics</li>

          <li>Emergency Care</li>

        </ul>

      </div>

      <!-- Contact -->
      <div class="footer-col">

        <h3>Contact</h3>

        <ul>

          <li>📍 Lahore, Pakistan</li>

          <li>📞 +92 300 1234567</li>

          <li>✉️ info@medicare.com</li>

          <li>🕒 Open 24/7</li>

        </ul>

      </div>

    </div>

    <div class="bottom">

      <p>
        © {{ year }} MediCare Hospital. All Rights Reserved.
      </p>

    </div>

  </footer>
</template>

<script setup>
const year = new Date().getFullYear();
</script>

<style scoped>

.footer{

background:#0f172a;

color:#cbd5e1;

padding:80px 8% 20px;

}

.container{

max-width:1300px;

margin:auto;

display:grid;

grid-template-columns:2fr 1fr 1fr 1fr;

gap:40px;

}

.logo{

font-size:30px;

font-weight:700;

color:white;

margin-bottom:20px;

}

.footer-col p{

line-height:1.8;

margin-bottom:25px;

}

.footer-col h3{

color:white;

margin-bottom:20px;

font-size:20px;

}

.footer-col ul{

list-style:none;

padding:0;

margin:0;

}

.footer-col ul li{

margin-bottom:14px;

}

.footer-col a{

text-decoration:none;

color:#cbd5e1;

transition:.3s;

}

.footer-col a:hover{

color:#60a5fa;

padding-left:5px;

}

.socials{

display:flex;

gap:15px;

}

.socials a{

width:42px;

height:42px;

border-radius:50%;

background:#1e293b;

display:flex;

align-items:center;

justify-content:center;

color:white;

font-size:18px;

transition:.3s;

}

.socials a:hover{

background:#2563eb;

transform:translateY(-5px);

}

.bottom{

margin-top:60px;

padding-top:20px;

border-top:1px solid rgba(255,255,255,.1);

text-align:center;

font-size:15px;

color:#94a3b8;

}

@media(max-width:992px){

.container{

grid-template-columns:1fr 1fr;

}

}

@media(max-width:768px){

.container{

grid-template-columns:1fr;

text-align:center;

}

.socials{

justify-content:center;

}

}

</style>