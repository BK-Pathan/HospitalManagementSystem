# 🏥 Hospital Management System (HMS)

A complete **Full Stack Hospital Management System** developed to digitize hospital operations and provide a seamless experience for **Administrators, Doctors, and Patients**.

This system manages hospital workflows including user management, doctor management, patient records, appointments, prescriptions, and real-time notifications.

The application is built with a modern full-stack architecture using:

- Vue.js 3
- Node.js
- Express.js
- MongoDB
- Socket.IO


---

# 🚀 Project Overview

The Hospital Management System provides separate dashboards for different users with secure role-based access.

Users:

- 👨‍💼 Admin
- 👨‍⚕️ Doctor
- 🧑 Patient


Each role has specific permissions and features to manage hospital activities efficiently.


---

# ✨ Features


# 👨‍💼 Admin Dashboard

Admin manages the complete hospital system.


### Features:

- Admin authentication
- Dashboard statistics
- Manage doctors
- Manage patients
- Manage users
- Change user roles
- Manage appointments
- View hospital activities
- System control management
- Real-time notifications



---

# 👨‍⚕️ Doctor Dashboard

Doctors can manage their appointments and patient medical records.


### Features:

- Doctor authentication
- Doctor profile management
- View assigned appointments
- Accept appointments
- Reject appointments
- Manage availability schedule
- View patient history
- Create prescriptions
- View previous prescriptions
- Handle reschedule requests
- Receive instant notifications



---

# 🧑 Patient Dashboard

Patients can manage their healthcare activities.


### Features:

- Patient registration
- Secure login
- Profile management
- Browse doctors
- Book appointments
- View appointment history
- Request appointment rescheduling
- View prescriptions
- Receive appointment updates
- Real-time notifications



---

# 🔔 Real-Time Notification System

The system uses **Socket.IO** for real-time communication between users.


Notifications include:

- New appointment created
- Appointment approved
- Appointment rejected
- Appointment reschedule request
- Prescription created
- System updates


### Workflow:

```
User Action
      |
      ↓
Backend API
      |
      ↓
Socket.IO Event
      |
      ↓
Instant Notification Received
```


---

# 🛠️ Technology Stack


## Frontend Technologies

| Technology | Purpose |
|---|---|
| Vue.js 3 | Frontend Framework |
| Vite | Build Tool |
| Vue Router | Client Side Routing |
| Axios | API Communication |
| Socket.IO Client | Real-Time Notifications |
| Chart.js | Dashboard Charts |
| Vue Chart.js | Chart Integration |
| CSS3 | Styling |



---

## Backend Technologies

| Technology | Purpose |
|---|---|
| Node.js | Backend Runtime |
| Express.js | Backend Framework |
| MongoDB | Database |
| Mongoose | Database Modeling |
| Socket.IO | Real-Time Communication |
| JWT | Authentication |
| Cookie Parser | Cookie Management |
| Dotenv | Environment Variables |
| Helmet | Security Headers |
| Express Rate Limit | API Protection |
| Bcrypt | Password Encryption |



---

# 📦 Backend Installation


Go to backend folder:


```bash
cd backend
```


Install dependencies:


```bash
npm install
```


Install required packages:


```bash
npm install express mongoose dotenv cors cookie-parser bcrypt jsonwebtoken socket.io helmet express-rate-limit multer
```


Install development dependency:


```bash
npm install nodemon --save-dev
```



---

# 📦 Frontend Installation


Go to frontend folder:


```bash
cd frontend
```


Install dependencies:


```bash
npm install
```


Install required packages:


```bash
npm install axios vue-router socket.io-client chart.js vue-chartjs
```



---

# 📂 Project Structure


```
Hospital-Management-System

│
├── backend
│
│   ├── config
│   │
│   ├── controllers
│   │
│   ├── middleware
│   │
│   ├── models
│   │
│   ├── routes
│   │
│   ├── public
│   │
│   ├── app.js
│   │
│   └── package.json
│
│
├── frontend
│
│   ├── src
│   │
│   ├── components
│   │
│   ├── layouts
│   │
│   ├── views
│   │
│   ├── router
│   │
│   ├── api
│   │
│   ├── App.vue
│   │
│   └── package.json
│
│
└── README.md


# 🔐 Security Features


Implemented security features:


✅ JWT Authentication

✅ Role Based Access Control

✅ Protected Routes

✅ Password Hashing

✅ Secure Cookies

✅ Helmet Security Headers

✅ API Rate Limiting

✅ Environment Variables



---

# ⚙️ Environment Configuration


Create `.env` file inside backend folder:


```env
PORT=3000

MONGO_URI=mongodb://localhost:27017/hospitalDb

JWT_SECRET=your_secret_key
```



---

# ▶️ Running The Project


## Start Backend


```bash
cd backend

npm run dev
```


Backend runs on:


```
http://localhost:3000
```



---

## Start Frontend


```bash
cd frontend

npm run dev
```


Frontend runs on:


```
http://localhost:5173
```



---

# 👥 User Roles & Permissions


| Role | Access |
|---|---|
| Admin | Complete Hospital Management |
| Doctor | Appointments & Prescriptions |
| Patient | Booking & Medical Records |


# 🌟 Project Highlights


⭐ Full Stack Web Application

⭐ Modern Dashboard Architecture

⭐ Role Based Authentication

⭐ Real-Time Communication

⭐ REST API Architecture

⭐ Secure Backend

⭐ Hospital Workflow Automation

⭐ Responsive User Interface



---

# 👨‍💻 Developer


## Bismillah Khan

Full Stack Web Developer


### Skills:

- Vue.js
- React.js
- Node.js
- Express.js
- MongoDB
- REST APIs
- Socket.IO



---

# 🔮 Future Improvements


- Online Payment Integration
- Video Consultation
- AI Medical Assistant
- Email Notifications
- Mobile Application
- Advanced Analytics Dashboard



---

# ⭐ Support

If you like this project, consider giving it a star ⭐
