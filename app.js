const express = require("express");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const app = express();

app.get("/",(req,res)=>{
    res.send("welcome")
})

app.use(cookieParser());
app.use(express.json());
app.use("/user",userRoutes);
module.exports = app;
