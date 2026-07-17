const express = require("express");
const router = express.Router();

const {
getAllDoctors
}=require("../controllers/publicController");

router.get(
    "/doctors",
    getAllDoctors
);


module.exports = router;