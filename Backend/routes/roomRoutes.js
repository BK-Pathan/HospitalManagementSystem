const router = require("express").Router();

const {
createRoom,
getRooms,
getAvailableBeds
}=require("../controllers/roomController");


router.post("/",createRoom);

router.get("/",getRooms);

router.get(
"/available",
getAvailableBeds
);

module.exports=router;