const validator = require("validator")
const bcrypt = require('bcrypt');

const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is required.");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid.");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong.");
    }
}


const validateProfileEditData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "about", "age", "gender", "photoUrl", "skills", ];

    const isEditAllowed = Object.keys(req.body).every((field) => 
        allowedEditFields.includes(field)   
    );

    return isEditAllowed;
}

const validateOldPassword = async (req, user) => {
    const oldPassword = req.body.oldPassword;

    const isValid = await bcrypt.compare(oldPassword, user.password);

    if(!isValid){
        throw new Error("Old password is incorrect!");
    }

    return true;
}

module.exports = {
    validateSignUpData,
    validateProfileEditData,
    validateOldPassword
}