const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

app.post("/login", (req, res) => {

    User.findOne({ email: req.body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Invalid user or password"
                }
            });
        }

        if (!bcrypt.compareSync(req.body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Invalid user or password"
                }
            });
        }

        let token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        res.json({
            ok: true,
            user: userDB,
            token: token
        })

    });



})


module.exports = app;