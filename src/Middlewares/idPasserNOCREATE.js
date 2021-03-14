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

    if ((idNumber >= 0) && (idNumber < limit)) {
            next();
    } else {
        res.status(400).send({
            "error": "ID inválido"
        });
    }
}