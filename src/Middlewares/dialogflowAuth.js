module.exports = (req, res, next) => {
    let reqAuth = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'] || req.headers.authorization;
    
    if (!reqAuth) {
        return res.status(401).send({ error: "Access denied" });
    }
    if(reqAuth === process.env.TOKENDialogflow) {
        return next();
    }else{
        return res.status(401).send({ error: "Access denied"});
    }
}