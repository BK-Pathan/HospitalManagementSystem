<script setup>
import { reactive } from "vue";

const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: ""
});

const submitForm = () => {
  console.log(form);

  alert("Message submitted successfully!");

  form.name = "";
  form.email = "";
  form.subject = "";
  form.message = "";
};
</script>

<template>
<section id="contact" class="contact-section">

<div class="container">

<div class="left">

<span class="subtitle">
CONTACT US
</span>

<h2>
Let's Talk About
<span>Your Health</span>
</h2>

<p>
Have questions or need medical assistance?
Our team is always ready to help you.
</p>

<div class="info">

<div class="info-card">

<div class="icon">📍</div>

<div>

<h4>Address</h4>

<p>
123 Medical Street,
Lahore, Pakistan
</p>

</div>

</div>

<div class="info-card">

<div class="icon">📞</div>

<div>

<h4>Phone</h4>

<p>+92 300 1234567</p>

</div>

</div>

<div class="info-card">

<div class="icon">✉️</div>

<div>

<h4>Email</h4>

<p>info@medicare.com</p>

</div>

</div>

<div class="info-card">

<div class="icon">🕒</div>

<div>

<h4>Working Hours</h4>

<p>24/7 Emergency Services</p>

</div>

</div>

</div>

</div>

<div class="right">

<form @submit.prevent="submitForm">

<input
v-model="form.name"
type="text"
placeholder="Your Name"
required
>

<input
v-model="form.email"
type="email"
placeholder="Email Address"
required
>

<input
v-model="form.subject"
type="text"
placeholder="Subject"
required
>

<textarea
v-model="form.message"
rows="6"
placeholder="Write your message..."
required
></textarea>

<button type="submit">

Send Message

</button>

</form>

</div>

</div>

</section>
</template>

<style scoped>

.contact-section{

padding:110px 8%;

background:#f8fbff;

}

.container{

max-width:1300px;

margin:auto;

display:grid;

grid-template-columns:1fr 1fr;

gap:70px;

align-items:center;

}

.subtitle{

display:inline-block;

color:#2563eb;

font-weight:700;

letter-spacing:2px;

margin-bottom:15px;

}

.left h2{

font-size:44px;

margin-bottom:20px;

color:#222;

}

.left h2 span{

color:#2563eb;

}

.left>p{

color:#666;

line-height:1.8;

margin-bottom:40px;

}

.info{

display:grid;

gap:20px;

}

.info-card{

display:flex;

gap:20px;

padding:22px;

background:white;

border-radius:18px;

box-shadow:0 12px 30px rgba(0,0,0,.07);

}

.icon{

width:60px;

height:60px;

border-radius:50%;

background:#edf4ff;

display:flex;

align-items:center;

justify-content:center;

font-size:24px;

}

.info-card h4{

margin-bottom:6px;

}

.info-card p{

color:#666;

line-height:1.6;

}

form{

background:white;

padding:40px;

border-radius:24px;

box-shadow:0 20px 45px rgba(0,0,0,.08);

display:flex;

flex-direction:column;

gap:18px;

}

input,
textarea{

padding:16px;

border:1px solid #ddd;

border-radius:12px;

font-size:16px;

outline:none;

transition:.3s;

font-family:inherit;

}

input:focus,
textarea:focus{

border-color:#2563eb;

}

button{

padding:16px;

border:none;

border-radius:50px;

background:#2563eb;

color:white;

font-size:16px;

font-weight:600;

cursor:pointer;

transition:.3s;

}

button:hover{

background:#1747c7;

}

@media(max-width:992px){

.container{

grid-template-columns:1fr;

}

.left{

text-align:center;

}

.left h2{

font-size:36px;

}

}

</style>