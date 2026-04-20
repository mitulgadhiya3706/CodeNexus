const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");    
const bcrypt = require("bcrypt");


app.use(express.json())                     //middleware to parse JSON req. body  (convert JSON -> JS object)

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
            res.send("Login successfully");
        }else{
            throw new Error("Invalid credentials");
        }
    } catch(err) {
        res.status(400).send("Error:" + err.message);
    }
})

//Get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;

    try{    

        // const user = await User.findOne({});         //to get only one Doc.
        // if(!user){
        //     res.status(404).send("User not found");
        // }else{
        //     res.send(user);
        // }


        const users = await User.find({ emailId: userEmail });  

        if(users.length === 0){
            res.status(404).send("User not found.");
        }else{
            res.send(users);
        }

    } catch(err){
        res.status(400).send("Something went wrong!!");
    }
})


//Feed API - GET feed - get all the usersfrom the database
app.get("/feed", async (req, res) => {
    try{
        const users = await User.find({});
        res.send(users);
    } catch(err){
        res.status(400).send("Something went wrong!!");
    }
})


//Delete user from database
app.delete("/user", async (req, res) => {
    const userId = req.body.userId;

    try{
        const user = await User.findByIdAndDelete({_id: userId});
        // const user = await User.findByIdAndDelete(userId);  
        res.send("User deleted.")
    } catch(err){
        res.status(400).send("Something went wrong!!");
    }
})


//PATCH
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;

    try{

        const ALLOWED_UPDATES = ["about", "skills", "photoUrl", "age", "gender"];
        const isAllowedUpdates = Object.keys(data).every((key) => 
            ALLOWED_UPDATES.includes(key));

        if(!isAllowedUpdates){
            throw new Error ("Updates not allowed");
        }

        if (data.skills && data.skills.length > 10) {
            throw new Error("Skills can't be more than 10")
        }

        const user = await User.findByIdAndUpdate(userId, data);
        res.send("User updated successfully.")

    } catch(err){
        res.status(400).send("Error:" +err.message)
    }
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
