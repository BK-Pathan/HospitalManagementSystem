const router=require("express").Router();

const {
createBed,
getBeds,
getAvailableBeds
}=require("../controllers/bedController");


router.post("/",createBed);

router.get("/",getBeds);

router.get("/available", getAvailableBeds);
module.exports=router;