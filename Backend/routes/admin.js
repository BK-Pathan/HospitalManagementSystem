const express = require("express");
const router = express.Router();


const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");


const {
    dashboardStats,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getAllDoctors,
    getAllPatients,
    getAllAppointments,
    changeRole,
    getAllUsers,
    cancelAppointment,
    doctorPerformance,
    createPatient,
    doctorAvailabilityStatus,
    requestReschedule
} = require("../controllers/adminController");

// Dashboard Statistics
router.get(
    "/dashboard",
    auth,
    role("admin"),
    dashboardStats
);

router.get(
    "/dashboard-stats",
    auth,
    role("admin"),
    dashboardStats
);

// Create Doctor
router.post(
    "/doctor",
    auth,
    role("admin"),
    createDoctor
);

// Update Doctor
router.put(
    "/doctor/:id",
    auth,
    role("admin"),
    updateDoctor
);

// Delete Doctor
router.delete(
    "/doctor/:id",
    auth,
    role("admin"),
    deleteDoctor
);

// View Doctors
router.get(
    "/doctors",
    auth,
    role("admin"),
    getAllDoctors
);

// View Patients
router.get(
    "/patients",
    auth,
    role("admin"),
    getAllPatients
);

// View Appointments
router.get(
    "/appointments",
    auth,
    role("admin"),
    getAllAppointments
);
router.put(
"/user/:id/role",
auth,
role("admin"),
changeRole
);

// View All Users

router.get(
"/users",
auth,
role("admin"),
getAllUsers
);

router.put(
"/appointment/:id/cancel",
auth,
role("admin"),
cancelAppointment
);

router.get(
"/doctor-performance",
auth,
role("admin"),
doctorPerformance
);

router.post(
"/patient",
auth,
role("admin"),
createPatient
);

router.get(
"/doctor-status",
auth,
role("admin"),
doctorAvailabilityStatus
);

// const {
// requestReschedule
// }=require("../controllers/appointmentController");


// router.put(
// "/reschedule/:id",
// auth,
// role("patient"),
// requestReschedule
// );

module.exports = router;
