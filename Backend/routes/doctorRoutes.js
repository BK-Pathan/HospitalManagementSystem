// module.exports = router;

const express = require("express");
const router = express.Router();


const auth=require("../middleware/authMiddleware");
const role=require("../middleware/roleMiddleware");


const {
createProfile,
getProfile,
dashboardStats,
getAvailableDoctors,
getDoctorById,
getTodaysAppointments,
getUpcomingAppointments,
getPatientStats,
appointmentAnalytics
}=require("../controllers/doctorsController");

const {
getMyAppointments,
updateAppointmentStatus,
approveReschedule
}=require("../controllers/DoctorsAppointmentController");

const {
getPatientHistory
}=require("../controllers/patientHistoryController");

const {
getDoctorFeedback,
getDoctorFeedbackAnalytics
}=require("../controllers/feedbackController");


router.post(
"/profile",
auth,
role("doctor"),
createProfile
);



router.get(
"/profile",
auth,
role("doctor"),
getProfile
);



router.get(
"/appointments",
auth,
role("doctor"),
getMyAppointments
);

router.put(
"/appointment/:id",
auth,
role("doctor"),
updateAppointmentStatus
);

router.get(
"/dashboard",
auth,
role("doctor"),
dashboardStats
);


router.get(
"/available",
auth,
role("patient"),
getAvailableDoctors
);

router.get(
"/today-appointments",
auth,
role("doctor"),
getTodaysAppointments
);

router.get(
"/upcoming-appointments",
auth,
role("doctor"),
getUpcomingAppointments
);

router.get(
"/patient-history/:patientId",
auth,
role("doctor"),
getPatientHistory
);

router.get(
"/patient-stats/:patientId",
auth,
role("doctor"),
getPatientStats
);

router.get(
"/appointment-analytics",
auth,
role("doctor"),
appointmentAnalytics
);

router.get(

"/feedback",

auth,

role("doctor"),

getDoctorFeedback

);

router.get(

"/feedback-analytics",

auth,

role("doctor"),

getDoctorFeedbackAnalytics

);

router.get(
"/:id",
auth,
role("patient"),
getDoctorById
);

module.exports=router;