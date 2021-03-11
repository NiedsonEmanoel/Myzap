let sessions = require('../Controllers/multisession.controller');

module.exports = (req, res, next) => {
    let reqAuth = req.query.id;
    
    if (!reqAuth) {
        return res.status(400).send({ error: "ID não informado." });
    }
    if((reqAuth >= 0) && (reqAuth <= sessions.getSessions())) {
        return next();
    }else{
        return res.status(400).send({ error: "ID inválido"});
    }
}