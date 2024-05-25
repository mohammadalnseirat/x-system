// import auth user schema
const AuthUser = require("../models/authUser");
// import bcrypt
const bcrypt = require("bcrypt");
// import json web token
var jwt = require("jsonwebtoken");
// import express validator
const { validationResult } = require("express-validator");
require("dotenv").config();

const cloudinary = require("cloudinary").v2;
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET, // Click 'View Credentials' below to copy your API secret
});
// render welcome page
const get_welcome = (req, res) => {
  res.render("welcome");
};

const get_signout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
const get_login = (req, res) => {
  res.render("auth/login");
};
const get_signup = (req, res) => {
  res.render("auth/signup");
};
const post_signup = async (req, res) => {
  try {
    // check validation email & password
    const objError = validationResult(req);
    if (objError.errors.length > 0) {
      return res.json({ arrayValidationError: objError.errors });
    }
    //check email already exist in data base
    const isCurrentEmail = await AuthUser.findOne({ email: req.body.email });
    if (isCurrentEmail) {
      return res.json({ existEmail: "email already exists" });
    }

    // create a new user and login
    const newUser = await AuthUser.create(req.body);
    var token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
    res.json({ id: newUser._id });
  } catch (err) {
    // if there's any error
    console.log(err);
  }
};

const post_login = async (req, res) => {
  try {
    //get email from database using findOne method
    const loginUser = await AuthUser.findOne({ email: req.body.email });
    // check email
    if (loginUser === null) {
      res.json({ notFoundEmail: "this email not found,Try to Sign Up" });
    } else {
      const match = await bcrypt.compare(req.body.password, loginUser.password);
      if (match) {
        var token = jwt.sign({ id: loginUser._id }, process.env.JWT_SECRET_KEY);
        res.cookie("jwt", token, { httpOnly: true, maxAge: 86400000 });
        res.json({ id: loginUser._id });
      } else {
        res.json({ errorPassword: `incorrect password,for ${req.body.email}` });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// post profile image
const post_profileImage = (req, res) => {
  // req.file is the `avatar` file
  console.log(req.file.path);
  cloudinary.uploader.upload(
    req.file.path,
    { folder: "x-system/profile-image" },
    async (error, result) => {
      if (result) {
        console.log(result.secure_url);
        const token = req.cookies.jwt;
        var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const update_Profile = await AuthUser.updateOne(
          { _id: decoded.id },
          { profileImage: result.secure_url }
        );
        res.redirect("/home");
      }
    }
  );
};

module.exports = {
  get_welcome,
  get_signout,
  get_login,
  get_signup,
  post_signup,
  post_login,
  post_profileImage,
};
