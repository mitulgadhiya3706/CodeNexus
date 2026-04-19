const mongoose = require("mongoose");


const connectDB = async() => {
    mongoose.connect("mongodb+srv://codenexus:codenexus7070@codenexuscluster.pzel7kt.mongodb.net/codenexus")
}

module.exports = connectDB;