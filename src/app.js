const express = require('express');
const connectDB = require("./config/database")
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const initializeSocket = require("./utils/socket")


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());      //middleware to parse JSON req. body  (convert JSON -> JS object)
app.use(cookieParser());

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

const server = http.createServer(app);
initializeSocket(server);

connectDB()
    .then(() => {
        console.log("Database connection established...")
        server.listen(process.env.PORT, () => {
            console.log("Server is running on port 7777...");
        });
    })
    .catch((err) => {
        console.error("Database can't be connected!!");        
    })  