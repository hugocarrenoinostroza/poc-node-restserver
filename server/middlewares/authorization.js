const jwt = require('jsonwebtoken');

let tokenVerification = (req, res, next) => {

    let token = req.get("authorization");

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();

    });

}

let verifyAdmin = (req, res, next) => {

    if (req.user.role !== 'ADMIN_ROLE') {

        return res.status(401).json({
            ok: false,
            err: 'User Must be an Admin'
        });

    }

    next();

}

module.exports = {
    tokenVerification,
    verifyAdmin
}