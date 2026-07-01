require("dotenv").config();
const express = require('express');
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket")

const allowedOrigins = [
    process.env.FRONTEND_URL?.replace(/\/+$/, ""),
    "http://localhost:5173",
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));

// Webhook route needs raw body
app.use("/payment/webhook", express.raw({ type: "application/json" }));

// All other routes use JSON
app.use(express.json());

app.use(cookieParser());
app.set("trust proxy", 1);

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user')
const chatRouter = require("./routes/chat");
const paymentRouter = require("./routes/payment");

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', chatRouter);
app.use('/', paymentRouter);

// Health check route
app.get("/", (req, res) => {
    res.send("CodeNexus Backend Running 🚀");
});

const server = http.createServer(app);
initializeSocket(server);

connectDB()
    .then(() => {
        console.log("Database connection established...")
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}...`);
        });
    })
    .catch((err) => {
        console.error("Database can't be connected!!");
    })  