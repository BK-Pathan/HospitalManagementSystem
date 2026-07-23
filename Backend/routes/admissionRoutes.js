const router=require("express").Router();
const auth = require ("../middleware/authMiddleware")
const role = require("../middleware/roleMiddleware")

const {
createAdmission,
dischargePatient,
getAllPatients,
getAdmissions,
getDoctorAdmissions
}=require("../controllers/admissionController");


router.post("/",createAdmission);

router.get("/",getAdmissions);


router.put(
"/discharge/:id",
dischargePatient
);
// doc side
router.get(
"/doctor",
auth,
role("doctor"),
getDoctorAdmissions
);

module.exports=router;