const express=require("express");
const router=express.Router();

const auth=require("../middleware/authMiddleware");
const role=require("../middleware/roleMiddleware");

const {
createProfile

}=require("../controllers/patientProfileController");


router.post(
"/profile",
auth,
role("patient"),
createProfile
);


module.exports=router;