const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;

module.exports = async function checkToken(req, res, next) {
    const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'] || req.headers.authorization;
    if (!token) {
        res.status(401).json({ status: 401, msg: 'Access denied' });
    } else {
        jwt.verify(token, secret, (err) => {
            if (err) {
                res.status(401).json({ status: 401, msg: 'Access denied' });
            } else {
                next();
            }
        })
    }
}