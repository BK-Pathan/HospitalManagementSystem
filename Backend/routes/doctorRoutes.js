// const express = require("express");
// const router = express.Router();


// const auth = require("../middleware/authMiddleware");
// const role = require("../middleware/roleMiddleware");


// const {
// getMyAppointments
// }=require("../controllers/doctorsController");



// router.get(
// "/appointments",
// auth,
// role("doctor"),
// getMyAppointments
// );



// module.exports = router;

const express = require("express");
const router = express.Router();


const auth=require("../middleware/authMiddleware");
const role=require("../middleware/roleMiddleware");


const {

createProfile,
getProfile,
getMyAppointments,
getAvailableDoctors,
getDoctorById

}=require("../controllers/doctorsController");



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


router.get(
"/available",
auth,
role("patient"),
getAvailableDoctors
);

router.get(
"/:id",
auth,
role("patient"),
getDoctorById
);

module.exports=router;