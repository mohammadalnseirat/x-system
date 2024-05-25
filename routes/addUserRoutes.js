const express = require("express");
const router = express.Router();
const userController = require("../controllers/useController");
const {requireAuthentication} = require("../middleWare/middleWare");

router.get("", requireAuthentication, userController.user_add_get);

router.post("", userController.user_post);

module.exports = router;
