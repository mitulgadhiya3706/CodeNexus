const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
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
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter strong password.")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/000/439/863/original/vector-users-icon.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo url is not valid.");
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gitHubUrl: {
        type: String,
        default: "https://github.com/",
        validate(value) {
            if (value && !validator.isURL(value)) {
                throw new Error("gitHubUrl  is not valid ");
            }
        },
    },
    linkedInUrl: {
        type: String,
        default: "https://www.linkedin.com/",
        validate(value) {
            if (value && !validator.isURL(value)) {
                throw new Error("linkedInUrl  is not valid ");
            }
        },
    },
    gender: {
        type: String,
        validate: function (value) {
            if (!["Male", "Female", "Others"].includes(value)) {
                throw new Error("Gender data is not valid.")
            }
        }
    },
    skills: {
        type: [String]
    },
    about: {
        type: String,
        default: "This is default for user."
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    membershipType: {
        type: String,
        enum: ["silver", "gold", ""],
        default: "",
    },


},
    {
        timestamps: true
    }
);

UserSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "codenexus@7070", { expiresIn: "1d" });
    return token;
}

UserSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

const User = mongoose.model("User", UserSchema);

module.exports = User;

