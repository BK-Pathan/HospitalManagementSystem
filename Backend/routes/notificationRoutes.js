const express = require("express");

const router = express.Router();


const auth = require("../middleware/authMiddleware");


const {

getMyNotifications,
markAsRead,
deleteNotification,
getUnreadCount

} = require("../controllers/notificationController");




// =====================================
// Get All Notifications
// =====================================

router.get(
"/",
auth,
getMyNotifications
);




// =====================================
// Get Unread Count
// =====================================

router.get(
"/unread-count",
auth,
getUnreadCount
);




// =====================================
// Mark Notification Read
// =====================================

router.patch(
"/:id/read",
auth,
markAsRead
);




// =====================================
// Delete Notification
// =====================================

router.delete(
"/:id",
auth,
deleteNotification
);



module.exports = router;