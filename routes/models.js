const express = require("express");
const router = express.Router();
module.exports = router;

router.get("/m/:model", (req, res) => {
	res.render("model", { model: req.params.model });
});