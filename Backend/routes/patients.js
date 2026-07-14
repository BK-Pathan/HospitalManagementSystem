const express = require("express");
const router = express.Router();


const auth=require("../middleware/authMiddleware");
const role=require("../middleware/roleMiddleware");


const {
bookAppointment,
getMyAppointments

}=require("../controllers/patientsController");


// Book
router.post(
"/appointment",
auth,
role("patient"),
bookAppointment
);

// Own appointments
router.get(
"/appointments",
auth,
role("patient"),
getMyAppointments
);



module.exports = router;