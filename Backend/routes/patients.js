const express=require("express");
const router=express.Router();


const auth=require("../middleware/authMiddleware");
const role=require("../middleware/roleMiddleware");


const {

getDoctors,
getDoctorById,
bookAppointment,
getMyAppointments

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



// My Appointments

router.get(
"/appointments",
auth,
role("patient"),
getMyAppointments
);



module.exports=router;