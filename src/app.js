const express = require('express');

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from the server.")
});

app.use("/ipl", (req, res) => {
    res.send("ipl scoreboard")
});

app.use("/", (req, res) => {
    res.send("Go to the dashboard.")
});


app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
})