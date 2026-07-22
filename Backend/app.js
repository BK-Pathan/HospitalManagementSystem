const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const cors = require("cors");

const app = express();


// Create HTTP Server
const server = http.createServer(app);


// Socket.IO Setup
const io = new Server(server, {

    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }

});



// Socket Connection

io.on("connection", (socket) => {


    console.log(
        "New Socket Connected:",
        socket.id
    );


    socket.on(
        "joinRoom",
        (userId) => {


            socket.join(userId);


            console.log(
                "User joined room:",
                userId
            );


        }
    );


});


// Controllers ke liye access
global.io = io;

setTimeout(()=>{


console.log("Sending test notification");


global.io
.to("6a563b70507905e7c60c3bfc")
.emit(
"notification",
{
title:"Test Notification",
message:"Socket working"
});


},5000);


// Middleware

app.use(express.json());

app.use(express.static("public"));

app.use(
    express.urlencoded({
        extended: true
    })
);


app.use(cors({

    origin:"http://localhost:5173",
    credentials:true

}));


app.use(cookieParser());





// Routes Import


const indexRoute = require("./routes/index");
const patientRoutes = require("./routes/patients");

const servicesRouter = require("./routes/services");
const appointmentsRouter = require("./routes/appointments");

const aboutRouter = require("./routes/about");
const contactRouter = require("./routes/contact");

const facilitiesRouter = require("./routes/facilities");
const newsRouter = require("./routes/news");


const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");


const adminRoutes = require("./routes/admin");

const doctorRoutes = require("./routes/doctorRoutes");

const prescriptionRoutes = require("./routes/prescriptionRoutes");


const patientProfileRoutes = require("./routes/patientProfileRoutes");

const publicRoutes = require("./routes/publicDoc");


const feedbackRoutes = require("./routes/feedbackRoutes");

const userRoutes = require("./routes/userProfileRoutes");


const notificationRoutes = require("./routes/notificationRoutes");






// Routes Setup


app.use("/auth", authRouter);


app.use("/users", userRouter);



app.use("/", indexRoute);



app.use("/services", servicesRouter);



app.use("/appointments", appointmentsRouter);



app.use("/about", aboutRouter);



app.use("/contact", contactRouter);



app.use("/facilities", facilitiesRouter);



app.use("/news", newsRouter);



app.use("/prescription", prescriptionRoutes);



app.use("/users", userRoutes);



app.use(
    "/notifications",
    notificationRoutes
);




// Admin Routes

app.use(
    "/admin",
    adminRoutes
);




// Doctor Routes

app.use(
    "/doctor",
    doctorRoutes
);




// Patient Profile Routes

app.use(
    "/patient",
    patientProfileRoutes
);



// Patient Appointment Routes

app.use(
    "/patient",
    patientRoutes
);



// Feedback Routes

app.use(
    "/feedback",
    feedbackRoutes
);



// Public Access

app.use(
    "/api",
    publicRoutes
);





// Database Connection

connectDB();





// Server Start

const port = process.env.PORT || 3000;


server.listen(port, () => {


    console.log(
        `Server running on port ${port}`
    );


});