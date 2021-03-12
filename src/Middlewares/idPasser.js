let sessions = require('../Controllers/multisession.controller');

module.exports = (req, res, next) => {
    let idText = req.query.id;
    let limit = sessions.getLimit();
    let idNumber;

    try {
        idNumber = new Number(idText);
    } catch{
        res.status(400).send({
            "error": "ID inválido"
        });
    }

    let started = sessions.getSessions();

    if ((idNumber >= 0) && (idNumber < limit)) {
        if (started.includes(idText)) {
            next();
        } else {
            res.status(400).send({
                "error": "Sessão não inicializada"
            });
        }
    } else {
        res.status(400).send({
            "error": "ID inválido"
        });
    }
}