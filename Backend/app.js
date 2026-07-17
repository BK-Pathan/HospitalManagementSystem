const express = require("express");
const app = express();

const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const cors = require("cors");


// Middleware

app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


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

const patientProfileRoutes = require("./routes/patientProfileRoutes");
const publicRoutes = require("./routes/publicDoc");



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



// Admin

app.use(
"/admin",
adminRoutes
);



// Doctor

app.use(
"/doctor",
doctorRoutes
);



// Patient

app.use(
"/patient",
patientProfileRoutes
);


// Patient Profile
app.use(
"/patient",
patientProfileRoutes
);


// Patient Appointment
app.use(
"/patient",
patientRoutes
);


// Test Route

app.get("/",(req,res)=>{

res.send("Hospital API Running");

});

//For public Access
app.use("/api", publicRoutes);



// Database

connectDB();




// Server

const port = process.env.PORT || 3000;


app.listen(port,()=>{

console.log(`Server running on port ${port}`);

});