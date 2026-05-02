const express = require("express");
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require("validator");

const { userAuth } = require('../middlewares/auth');
const { validateProfileEditData } = require('../utils/validation');
const { validateOldPassword } = require('../utils/validation');

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    } catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        if(!validateProfileEditData(req)){
            throw new Error("Invalid edit request.");
        }

        const loggedInUser = req.user;

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();
        
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfully.`,
            data: loggedInUser,
        });

    } catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
});


profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
    try{
        const { oldPassword, newPassword } = req.body;
        const user = req.user;

        await validateOldPassword(req, user);
        
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Password is not strong.")
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        res.send("Password updated successfully.");

    } catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

module.exports = profileRouter;