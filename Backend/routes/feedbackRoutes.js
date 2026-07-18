const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
createFeedback
}=require("../controllers/feedbackController");



router.post(
"/create",
auth,
createFeedback
);


module.exports = router;