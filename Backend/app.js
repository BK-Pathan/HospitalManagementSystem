const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();


// ==============================
// Login Rate Limiter
// ==============================
const loginLimiter = rateLimit({

    windowMs: 30 * 60 * 1000, // 30 minutes

    max:3,


    message:{
        message:"Too many login attempts. Try again later."
    },


    handler:(req,res)=>{


        const retryAfter =
        Math.ceil(
            (req.rateLimit.resetTime - Date.now()) / 1000
        );


        res.setHeader(
            "Retry-After",
            retryAfter
        );


        res.status(429).json({

            message:
            `Account temporarily locked. Try again after ${Math.ceil(retryAfter / 60)} minutes.`

        });


    },


    standardHeaders:true,

    legacyHeaders:false,


    skipSuccessfulRequests:true

});

// ==============================
// Signup Rate Limiter
// ==============================


const signupLimiter = rateLimit({

    windowMs: 25 * 60 * 1000, // 15 minutes


    max: 3,


    handler:(req,res)=>{


        const retryAfter =
        Math.ceil(
            (req.rateLimit.resetTime - Date.now()) / 1000
        );


        res.status(429).json({

            message:
            `Too many signup attempts. Try again after ${Math.ceil(retryAfter / 60)} minutes.`

        });


    },


    standardHeaders:true,

    legacyHeaders:false


});

// ==============================
// HTTP SERVER
// ==============================

const server = http.createServer(app);


// ==============================
// SOCKET.IO
// ==============================

const io = new Server(server, {

    cors:{
        origin:"http://localhost:5173",
        credentials:true
    }

});


io.on("connection",(socket)=>{


    // console.log(
    //     "New Socket Connected:",
    //     socket.id
    // );


    socket.on(
        "joinRoom",
        (userId)=>{

            socket.join(userId);


            // console.log(
            //     "User joined room:",
            //     userId
            // );

        }
    );


});


global.io = io;



// ==============================
// MIDDLEWARE
// ==============================

app.use(helmet());
app.use(express.json());


app.use(express.static("public"));


app.use(
    express.urlencoded({
        extended:true
    })
);


app.use(cors({

    origin:"http://localhost:5173",
    credentials:true

}));


app.use(cookieParser());




// ==============================
// ROUTES IMPORT
// ==============================


const authRouter = require("./routes/auth");

const indexRoute = require("./routes/index");
const patientRoutes = require("./routes/patients");

const userRouter = require("./routes/user");

const servicesRouter = require("./routes/services");
const appointmentsRouter = require("./routes/appointments");

const aboutRouter = require("./routes/about");
const contactRouter = require("./routes/contact");

const facilitiesRouter = require("./routes/facilities");
const newsRouter = require("./routes/news");

const adminRoutes = require("./routes/admin");

const doctorRoutes = require("./routes/doctorRoutes");

const prescriptionRoutes = require("./routes/prescriptionRoutes");

const patientProfileRoutes = require("./routes/patientProfileRoutes");

const publicRoutes = require("./routes/publicDoc");

const feedbackRoutes = require("./routes/feedbackRoutes");

const userRoutes = require("./routes/userProfileRoutes");

const notificationRoutes = require("./routes/notificationRoutes");

const roomRoutes=require("./routes/roomRoutes");
const bedRoutes=require("./routes/bedRoutes");
const admissionRoutes=require("./routes/admissionRoutes");




// ==============================
// ROUTES SETUP
// ==============================


// Apply limiter ONLY on login

app.use(
    "/auth/login",
    loginLimiter
);


// Signup Protection

app.use(
    "/auth/register",
    signupLimiter
);


app.use(
    "/auth",
    authRouter
);



app.use("/users", userRouter);


app.use("/", indexRoute);


app.use("/services", servicesRouter);


app.use("/appointments", appointmentsRouter);


app.use("/about", aboutRouter);


app.use("/contact", contactRouter);


app.use("/facilities", facilitiesRouter);


app.use("/news", newsRouter);


app.use("/prescription", prescriptionRoutes);


app.use("/api/rooms",roomRoutes);


app.use("/api/beds",bedRoutes);


app.use("/api/admissions",admissionRoutes);



app.use("/users", userRoutes);



app.use(
    "/notifications",
    notificationRoutes
);



app.use(
    "/admin",
    adminRoutes
);



app.use(
    "/doctor",
    doctorRoutes
);



app.use(
    "/patient",
    patientProfileRoutes
);



app.use(
    "/patient",
    patientRoutes
);



app.use(
    "/feedback",
    feedbackRoutes
);



app.use(
    "/api",
    publicRoutes
);




// ==============================
// DATABASE
// ==============================

connectDB().then((connected) => {
    if (!connected) {
        console.warn("Server is running without a MongoDB connection.");
    }





// ==============================
// SERVER START
// ==============================

const startServer = (port) => {
    server.once("error", (err) => {
        if (err.code === "EADDRINUSE") {
            const nextPort = port + 1;
            console.warn(`Port ${port} is busy. Trying ${nextPort} instead.`);
            startServer(nextPort);
        } else {
            console.error("Server error:", err);
            process.exit(1);
        }
    });

    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer(Number(process.env.PORT) || 3000);
});