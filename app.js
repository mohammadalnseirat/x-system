require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3007;
const mongoose = require("mongoose");
// For Send Data To DataBase Start Here
app.use(express.urlencoded({ extended: true }));
// For Send Data To DataBase End Here
// import cookie get jwt from browser
var cookieParser = require("cookie-parser");
app.use(cookieParser());
// For Using EJS
app.set("view engine", "ejs");
// For Using MethodOverride
var methodOverride = require("method-override");
app.use(methodOverride("_method"));
// For Static Files and refresh start here
app.use(express.static("puplic"));
const path = require("path");
const livereload = require("livereload");
const liveReloadServer = livereload.createServer();

liveReloadServer.watch(path.join(__dirname, "puplic"));
const connectLivereload = require("connect-livereload");
// const { error } = require("console");
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

// for using json
app.use(express.json());
// For Static Files and refresh End here
const allRoutes = require("./routes/allRoutes");
const addUserRoute = require("./routes/addUserRoutes");

// Connect To DataBase Start Here
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`http://localhost:${port}/`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
// Connect To DataBase End Here

app.use(allRoutes);
app.use("/user/add.html", addUserRoute);
