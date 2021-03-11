let sessions = require('../Controllers/multisession.controller');

module.exports = (req, res, next) => {
    let reqAuth = req.query.id;
    let max = sessions.getSessions() + 1;
    let sessionsX = [];

    for (let i = 1; i < max; i++) {
        sessionsX.push(i);
    }

    function verify(t) {
        for (let key in sessionsX) {
            if (sessionsX[key] == t) { return true; }
        }
        return false;
    }

    if (!reqAuth) {
        return res.status(400).send({ error: "ID não informado." });
    }
    if ( ( (reqAuth >= 0) && (verify(req) ) ) || (reqAuth==0)) {
        return next();
    } else {
        return res.status(400).send({ error: "ID inválido" });
    }
}