const express = require("express");
const router = express.Router();


const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");


const {
getMyAppointments
}=require("../controllers/doctorsController");



router.get(
"/appointments",
auth,
role("doctor"),
getMyAppointments
);



module.exports = router;