const fs = require('fs')
const path = require('path')
module.exports = {
    async createCredential(req, res, next) {
        try {
            const { base64, name, id } = req.body;
            let matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let s = new Buffer.from(matches[2], 'base64');

            fs.unlinkSync(path.resolve(__dirname, '..', 'tokens', name), () => { })
            fs.writeFileSync(path.resolve(__dirname, '..', 'tokens', name), s, 'binary', () => { });
            res.status(200).send({
                "message":"success"
            })

        } catch (e) {
            next(e);
        }
    }
}