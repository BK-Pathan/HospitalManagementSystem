const express = require("express");

const router = express.Router();


const auth = require("../middleware/authMiddleware");

const role = require("../middleware/roleMiddleware");


const {

createPrescription,
getPatientPrescriptions

}=require("../controllers/prescriptionController");





// ===============================
// Doctor Create Prescription
// ===============================
router.post(
"/",
auth,
role("doctor"),
(req,res,next)=>{

console.log(
"POST /prescription ROUTE HIT"
);

next();

},
createPrescription
);



router.get(
"/patient/:patientId",
auth,
role("doctor","patient"),
(req,res,next)=>{


console.log(
"GET PRESCRIPTION ROUTE HIT"
);


next();


},
getPatientPrescriptions
);

module.exports = router;