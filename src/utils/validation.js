const validation = require("validator")

const validateSignUpData = (req) => {

    const { firstName, lastName, emailId, password } = req.body;

    if(!firstName || !lastName){
        throw new Error("Name is required.");
    }
    else if(!validation.isEmail(emailId)){
        throw new Error("Email is not valid.");
    }
    else if(!validation.isStrongPassword(password)){
        throw new Error("Password is not strong.");
    }
}

module.exports = {
    validateSignUpData
}