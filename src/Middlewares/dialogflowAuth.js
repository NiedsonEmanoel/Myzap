module.exports = (req, res, next) => {
    let reqAuth = req.headers.authorization;
    
    if (!reqAuth) {
        return res.status(401).send({ error: "Token não informado." });
    }
    if(reqAuth === process.env.TOKENDialogflow) {
        return next();
    }else{
        return res.status(401).send({ error: "Token inválido"});
    }
}