const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const _ = require("underscore");

const { tokenVerification, verifyAdmin } = require('../middlewares/authorization');

const User = require("../model/user");

console.log(tokenVerification);

app.get('/user', tokenVerification, function(req, res) {

    let skip = req.query.skip || 0;

    let limit = req.query.limit || 0;

    User.find({})
        .skip(Number(skip))
        .limit(Number(limit))
        .exec(((err, users) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.count({}).exec((err, count) => {

                res.json({
                    ok: true,
                    users,
                    count
                })

            })


        }))
})

app.post('/user', [tokenVerification, verifyAdmin], function(req, res) {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: usuarioDB
        })

    });

})

app.put('/user/:id', [tokenVerification, verifyAdmin], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name',
        'email',
        'img',
        'role',
        'status'
    ]);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: usuarioDB
        })
    })


})

app.delete('/user/:id', [tokenVerification, verifyAdmin], function(req, res) {

    let id = req.params.id;

    User.findByIdAndUpdate(id, { status: false }, { new: true }, (err, user) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user
        })
    });

})


module.exports = app;