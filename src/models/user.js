const mongoose = require("mongoose");

const UserSchema =  new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate: function(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid.")
            }
        }
    },
    skills:{
        type: [String]
    },
    about: {
        type: String,
        default: "This is default for user."
    },
    photoUrl: {
        type: String,
        default: "https://toppng.com/show_download/239768/donna-picarro-dummy-avatar"
    }
    
}, 
{
    timestamps: true
}
)

const User = mongoose.model("User", UserSchema);

module.exports = User;

