const express=require("express");

const router=express.Router();


const auth=require("../middleware/authMiddleware");

const role=require("../middleware/roleMiddleware");


const {

createProfile,
getProfile,

}=require("../controllers/patientProfileController");


const{
    dashboardStats
}= require("../controllers/patientsController")


router.post(

"/profile",

auth,

role("patient"),

createProfile

);



router.get(

"/profile",

auth,

role("patient"),

getProfile

);

router.get(
"/dashboard",
auth,
role("patient"),
dashboardStats
);

module.exports=router;