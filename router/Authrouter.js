const express = require("express");
const {
	getUser,
	CreateUser,
	getingToken,
	signinUser,
} = require("../Controllers/AuthController");
const { upload } = require("../utils/multerConfig");
const router = express.Router();

router.get("/", getUser);
router.get("/:id/:token", getingToken);
router.route("/register").post(upload, CreateUser);
router.route("/signin").post(signinUser);

module.exports = router;
