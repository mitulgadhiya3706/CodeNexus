const express = require("express");
const authRouter = express.Router();

const User = require('../models/user');
const { validateSignUpData } = require('../utils/validation');
const bcrypt = require('bcrypt');


authRouter.post("/signup", async (req, res) => {
    
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


authRouter.post("/login", async (req, res) => {
    try{
        const { emailId, password} = req.body;

        const user = await User.findOne({ emailId: emailId });
        if(!user){
            throw new Error("Invalid credentials");
        }

        const isValidPassword = await user.validatePassword(password); 
        if(isValidPassword){
            
            const token = await user.getJWT();
            
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


authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now())});
    res.send("Logout successful");
});

module.exports = authRouter;