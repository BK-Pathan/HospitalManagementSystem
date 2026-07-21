const express = require("express");
const router = express.Router();


const auth = require("../middleware/authMiddleware");


const {
requestReschedule,
approveReschedule,
rejectReschedule,
getDoctorRescheduleRequests,
getDoctorAvailability,
getDoctorRescheduleHistory
}=require("../controllers/appointmentsController");



router.post(
"/:id/reschedule",
auth,
requestReschedule
);


router.put(
"/:id/approve-reschedule",
auth,
approveReschedule
);


router.put(
"/:id/reject-reschedule",
auth,
rejectReschedule
);

router.get(
"/doctor/reschedule-requests",
auth,
getDoctorRescheduleRequests
);

router.get(
"/doctor/:id/availability",
auth,
getDoctorAvailability
);

router.get(
"/doctor/reschedule-history",
auth,
getDoctorRescheduleHistory
);

module.exports = router;