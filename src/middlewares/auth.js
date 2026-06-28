const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try{
        let token = req.cookies?.token;
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if(!token){
            return res.status(401).send("Please Login!");
        }

        const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
       

        const { _id } = decodedObj;

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found.")
        }

        req.user = user;
        next();
    }catch(err){
        res.status(401).send("ERROR: "+ err.message);
    }
}

module.exports = {
    userAuth
}
