const express = require("express");
const router = express.Router();
const userController = require("../controllers/useController");
// import express validator
const { check } = require("express-validator");
// import funtion from middleware
const { requireAuthentication } = require("../middleWare/middleWare");
const { checkIfUser } = require("../middleWare/middleWare");
const authController = require("../controllers/authController");
const multer = require("multer");
const upload = multer({ storage: multer.diskStorage({}) });

router.get("*", checkIfUser);
router.post("*", checkIfUser);

// node level 3
// update profile image
router.post(
  "/upload-profile",
  upload.single("profileImage"),
  authController.post_profileImage
);
// Node Level 2
// sign out :remove jwt from cookies in web browser
router.get("/signout", authController.get_signout);
// render welcome page
router.get("/", authController.get_welcome);
// render login page
router.get("/login", authController.get_login);
// render signup page
router.get("/signup", authController.get_signup);

// post request in signup page:
router.post(
  "/signup",
  [
    check("email", "Please provide a valid email").isEmail(),
    check(
      "password",
      "Password must be at least 8 characters with 1 upper case letter and 1 number"
    ).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/),
  ],
  authController.post_signup
);
// post request in login page:
router.post("/login", authController.post_login);

// Node Level 1
// for Get Reguest to get data from database Start Here

// Render The Main Page
router.get("/home", requireAuthentication, userController.user_index_get);

// Render The Edit Page
router.get("/edit/:id", requireAuthentication, userController.user_edit_get);

// to get data from databas for one item
router.get("/view/:id", requireAuthentication, userController.user_view_get);

// for Get Reguest to get data from database End Here

// for Post Request Start Here
// For Search in dataBase
router.post("/search", userController.user_search_post);
// for Post Request End Here

// for Delete (delete data from DataBase) Request Start Here
router.delete("/edit/:id", userController.user_delete);
// for Delete (delete data from DataBase) Request End Here

// For Put (Update Data In DataBase) Request Start Here
router.put("/edit/:id", userController.user_put);
// For Put (Update Data In DataBase) Request End Here

module.exports = router;
