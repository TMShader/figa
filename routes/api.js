const express = require("express");
const {
    check,
    validationResult
} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sanitize = require('mongo-sanitize');
const router = express.Router();
const auth = require("../middleware/auth");

const User = require("../model/user.js");
const Link = require("../model/link.js");
const {
    default: fetch
} = require("node-fetch");

router.post("/start-login",
    [
        check("username", "Please Enter a valid username").not().isEmpty(),
        // check("uuid", "Invalid UUID").isLength({
        //     min: 36,
        //     max: 36
        // })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            const code = await generateCode()
            var {
                username,
                // uuid
            } = req.body;

            username = sanitize(username)
            // uuid = sanitize(uuid)

            await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`, {
                    method: "GET"
                })
                .then(res => res.json())
                .then((json) => uuid = json["id"])

            uuid = uuid.replace(
                /(........)(....)(....)(....)(............)/gi,
                "$1-$2-$3-$4-$5"
            )

            link = await Link.findOne({
                uuid
            });

            if (link) {
                return res.status(400).json({
                    message: "User already getting logged in"
                });
            }

            link = new Link({
                code,
                // username,
                uuid
            })

            await link.save();

            return res.status(200).json({
                message: "Success!",
                uuid
            });
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                message: "Error in starting login"
            });
        }
    });

router.post(
    "/stop-login",
    [
        // check("uuid", "Invalid UUID").isLength({
        //     min: 36,
        //     max: 36
        // }),
        check("code", "Please enter a valid code").isLength({
            min: 6,
            max: 6
        }).isInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

        try {
            var {
                uuid,
                code,
                username
            } = req.body;

            uuid = sanitize(uuid)
            code = sanitize(code)
            username = sanitize(username)

            console.log(uuid)

            let link = await Link.findOne({
                uuid
            });

            if (!link) {
                return res.status(404).json({
                    message: "Link not found"
                });
            }

            if (link.code != code) {
                return res.status(400).json({
                    message: "Wrong code"
                });
            }

            await link.remove();

            let user = await User.findOne({
                uuid
            });

            if (!user) {
                console.log(username)
                
                user = new User({
                    uuid,
                    username
                })

                await user.save();
            }

            jwt.sign({
                    user: {
                        id: user.id,
                        username: user.username,
                        uuid: user.uuid
                    }
                },
                process.env.KEY, {
                    expiresIn: "10 days"
                },
                (err, token) => {
                    if (err) throw err;
                    res.status(200).json({
                        token
                    });
                }
            );
        } catch (e) {
            console.log(e)
            return res.status(500).json({
                message: "Error in stopping link"
            });
        }
    }
)

router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findOne({
            uuid: req.user.uuid
        });

        return res.status(200).json(user);
    } catch (e) {
        return res.status(400).json({
            message: "Error in Fetching user"
        });
    }
});

router.get("/code/:uuid", async (req, res) => {
    if (req.header("token") == process.env.TOKEN) {
        try {
            let uuid = req.params.uuid;
            uuid = sanitize(uuid)

            const link = await Link.findOne({
                uuid
            });

            if (link) {
                return res.status(200).json(link);
            } else {
                return res.status(404).json({
                    message: "No pending links"
                });
            }
        } catch (e) {
            return res.status(500).json({
                message: "Error in Fetching link"
            });
        }
    } else {
        return res.status(401).json({
            message: "Authentication failed"
        });
    }
});

module.exports = router;

async function generateCode() {
    code = Math.floor(100000 + Math.random() * 900000);
    code = 123456

    link = await Link.findOne({
        code
    });

    if (link) {
        await generateCode();
    } else {
        return code
    }
}