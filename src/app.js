const express = require('express');

const app = express();

app.get("/user", (req, res) => {
    res.send({firstname: "Mitul", lastname: "Gadhiya"})
});

app.post("/user", (req, res) => {
    //saving data to DB
    res.send("Data successfully saved to DB.")
});

app.delete("/user", (req, res) => {
    res.send("Data deleted from DB.")
});

app.use("/ipl", (req, res) => {
    res.send("ipl scoreboard")
});

// app.use("/test", (req, res) => {
//     res.send("Hello from the server.")
// });


// app.use("/", (req, res) => {
//     res.send("Go to the dashboard.")
// });


app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
})