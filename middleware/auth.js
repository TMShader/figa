const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function auth(req, res, next) {
    var token
    var api = false

    if (req.header("token") === undefined) {
        if (req.cookies["token"] != undefined) {
            token = req.cookies["token"]
        }
    } else {
        token = req.header("token");
        api = true
    }

    if (!token) {
        if (api) {
            return res.status(401).json({
                message: "Auth Error",
            });
        } else {
            req.user = {}
            req.user["loggedIn"] = false
            next()
        }
    } else {
        try {
            const decoded = jwt.verify(token, process.env.KEY);
            req.user = decoded.user;
            req.user["loggedIn"] = true
            next();
        } catch (e) {
            if (api) {
                res.status(500).send({
                    message: "Invalid Token"
                });
            } else {
                req.loggedIn = false
                next()
            }
        }
    }
};

module.exports = auth