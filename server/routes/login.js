const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


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



});

app.post("/google", async(req, res) => {

    let user = await verify(req.body.idtoken)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        })


    User.findOne({ email: user.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (userDB) {
            if (!userDB.google) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Must use normal authentication"
                    }
                })
            } else {

                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            }


        } else {

            let newUser = new User({
                name: user.name,
                email: user.email,
                img: user.img,
                google: user.google,
                password: ':)'
            });

            newUser.save((err, userDB) => {
                let token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                res.json({
                    ok: true,
                    user: userDB,
                    token
                })
            });
        }



    })

});



async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
        password: ':)'
    }
}


module.exports = app;