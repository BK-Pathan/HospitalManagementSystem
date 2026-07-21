const express=require("express");
const router=express.Router();


const auth=require("../middleware/authMiddleware");
const role=require("../middleware/roleMiddleware");


const {

getDoctors,
getDoctorById,
bookAppointment,
getMyAppointments,
requestReschedule,
getPatientDashboard,
getDoctorProfileForPatient
}=require("../controllers/patientsController");

// All Doctors

router.get(
"/doctors",
auth,
role("patient"),
getDoctors
);

// Single Doctor

router.get(
"/doctors/:id",
auth,
role("patient"),
getDoctorById
);



// Book Appointment

router.post(
"/appointment",
auth,
role("patient"),
bookAppointment
);

router.put(

"/reschedule/:id",

auth,

role("patient"),

requestReschedule

);

// My Appointments

router.get(
"/appointments",
auth,
role("patient"),
getMyAppointments
);


router.get(

"/doctors/profile/:id",

auth,

role("patient"),

getDoctorProfileForPatient

);


router.get(

"/dashboard",

auth,

role("patient"),

getPatientDashboard

);


module.exports=router;