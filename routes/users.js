const express = require("express");
const auth = require("../middleware/auth");
const cookieParser = require("cookie-parser");
const router = express.Router();

router.use(cookieParser())
router.use((req, res, next) => auth(req, res, next))

module.exports = router;

router.get("/:user", (req, res) => {
	const { username, loggedIn } = req.user
	//var uuid = await getId(req.params.user);
	res.render("user", {
		username, loggedIn,
		page: req.get("host") + req.originalUrl,
		fullPage: req.protocol + "://" + req.get("host") + req.originalUrl,
		user: req.params.user,
		uuid: "8e437b09425747dba1ef50f5eeef7cfa",
		formattedUuid: "8e437b09-4257-47db-a1ef-50f5eeef7cfa"
		//uuid: uuid,
		/*formattedUuid: uuid.replace(
			/(........)(....)(....)(....)(............)/gi,
			"$1-$2-$3-$4-$5"
		),*/
	});
});

router.get("/old_u/:user", (req, res) => {
	getModel(req.params.user, function (resp) {
		res.render("user", {
			model: resp[0],
			texture: resp[1],
			user: req.params.user,
		});
	});
});

module.exports = router;