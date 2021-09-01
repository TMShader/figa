const express = require("express");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");
const router = express.Router();

router.use(cookieParser())
router.use((req, res, next) => auth(req, res, next))

module.exports = router;

router.get("/m/:model", (req, res) => {
	const { username, loggedIn } = req.user
	res.render("model", {
		username, loggedIn,
		model: req.params.model
	});
});