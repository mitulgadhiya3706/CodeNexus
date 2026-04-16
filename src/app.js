const express = require('express');

const app = express();


/*WILDCARD ERROR HANDLING */

app.get("/getUserData", (req, res) => {
    throw new Error("abcde");
    res.send("user data sent")
})

app.use("/", (err, req, res, next) => {
    if(err){
        res.status(500).send("Something went wrong.")
    }
})




/*AUTHENTICATION */

// const {adminAuth, userAuth} = require("./middlewares/auth");

// app.use("/admin", adminAuth);

// app.get("/user", userAuth,  (req,res) => {
//     res.send("userrr data.")
// });

// app.get("/admin/getAllData", (req,res) => {
//     adminAuth;
//     res.send("all data sent.")
// });

// app.get("/admin/deleteUser", (req, res) => {
//     res.send("deleted a user.")
// });




/*ROUTING */

// app.use("/user", 
    
//     (req, res, next) => {
//     console.log("Route handler 1 is running.");
//     next();
//     // res.send("Response 1.");
//     },

//     (req,res, next) => {
//     console.log("Route handler 2 is running.");
//     // res.send("Response 2.")]
//     next();
//     },

//     (req,res, next) => {
//     console.log("Route handler 3 is running.");
//     // res.send("Response 3.")
//     next();
//     },

//     (req,res, next) => {
//     console.log("Route handler 4 is running.");
//     // res.send("Response 4.")
//     next();
//     }
// );




// app.get("/user", (req, res) => {
//     res.send({firstname: "Mitul", lastname: "Gadhiya"})
// });

// app.post("/user", (req, res) => {
//     //saving data to DB
//     res.send("Data successfully saved to DB.") 
// });

// app.delete("/user", (req, res) => {
//     res.send("Data deleted from DB.")
// });

// app.use("/ipl", (req, res) => {
//     res.send("ipl scoreboard")
// });

// app.use("/test", (req, res) => {
//     res.send("Hello from the server.")
// });

// app.use("/", (req, res) => {
//     res.send("Go to the dashboard.")
// });


app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
})