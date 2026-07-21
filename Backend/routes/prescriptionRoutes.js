const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");


const {
createPrescription,
getMyPrescriptions,
getPatientPrescriptions
}=require("../controllers/prescriptionController");



// Doctor create prescription

router.post(
"/",
auth,
role("doctor"),
createPrescription
);




// Patient own prescriptions

router.get(
"/my",
auth,
role("patient"),
getMyPrescriptions
);




// Doctor view patient prescriptions

router.get(
"/patient/:patientId",
auth,
role("doctor","patient"),
getPatientPrescriptions
);



module.exports = router;