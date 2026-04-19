const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");

app.use(express.json())                     //middleware to parse JSON req. body  (convert JSON -> JS object)

app.post("/signup", async (req, res) => {

    //Creating a new instance of User model
    const user = new User(req.body);

    try{
        await user.save();
        res.send("User added successfully.")
    } catch(err){
        res.status(400).send("Error saving the user:" + err.message);
    }
});


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

        const ALLOWED_UPDATES = ["userId", "about", "skills", "photoUrl", "age", "gender"];
        const isAllowedUpdates = Object.keys(data).every((key) => 
            ALLOWED_UPDATES.includes(key));

        if(!isAllowedUpdates){
            throw new Error ("Updates not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("Skills can't be more than 10")
        }

        const user = await User.findByIdAndUpdate(userId, data);
        res.send("User updated successfully.")

    } catch(err){
        res.status(400).send("Something went wrong!!")
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
