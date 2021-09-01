const express = require("express");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");
const router = express.Router();

router.use(cookieParser())
router.use((req, res, next) => auth(req, res, next))

module.exports = router;

router.get("/", (req, res) => {
	const { username, loggedIn } = req.user
	res.render("index", {
		loggedIn, username
	});
});

router.get("/testing-three", (req, res) => {
	res.render("test");
});

router.get("/login", (req, res) => {
	res.render("login");
});