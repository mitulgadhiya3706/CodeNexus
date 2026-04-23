const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");    
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth");


app.use(express.json());                     //middleware to parse JSON req. body  (convert JSON -> JS object)
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    
    try{
        //validation of Data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        //Creating a new instance of User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });

        await user.save();
        res.send("User added successfully.")    
    } catch(err){
        res.status(400).send("Error saving the user:" + err.message);
    }
});


//Login
app.post("/login", async (req, res) => {
    try{
        const { emailId, password} = req.body;

        const user = await User.findOne({ emailId: emailId });
        if(!user){
            throw new Error("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if(isValidPassword){
            //Create JWT token
            const token = await jwt.sign({_id: user._id}, "codenexus@7070", {expiresIn: "1d"});
            
            //Add the token to cookie and send the response back to the user
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)});  //cookie will be removed after 8 hours
            res.send("Login successfully");
        }else{
            throw new Error("Invalid credentials");
        }
    } catch(err) {
        res.status(400).send("Error:" + err.message);
    }
})

app.get("/profile", userAuth, async (req, res) => {
    try{
        
        const user = req.user;
        res.send(user);
    } catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})


app.post("/sendConnectionRequest", userAuth,  async (req, res) => {
    const user = req.user; 

    console.log("Sending a connection request.")

    res.send(user.firstName+ " sent the connection request.")
    
})

connectDB()
    .then(() => {
        console.log("Database connection established...")
        app.listen(7777, () => {
            console.log("Server is running on port 7777...");
        });
    })
    .catch((err) => {
        console.error("Database can't be connected!!");        
    })
