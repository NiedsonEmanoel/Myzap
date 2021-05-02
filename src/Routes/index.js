const express = require('express');
const path = require('path');
const baseDir = path.resolve('./', 'Views', 'build');
const app = express.Router();

app.use('/webhook', require('./webhooks/webhooks'));
app.use('/api', require('./apis/api'));

app.get('/files/:id', (req, res, next) => { // localhost:3000/files/8796755665?file=a.html
    try {
        let { id } = req.params;
        let fileQuery = req.query.file;
        let download = req.query.download;
        id = id;

        const file = path.resolve(__dirname, '../Uploads/', id, fileQuery);

        switch (download) {
            case 'true':
                res.download(file);
                break;
        
            default:
                res.sendFile(file);
                break;
        }

        
    } catch (error) {
        next(error);
    }
});

app.use(express.static(`${baseDir}`));
app.get('/*', (req, res) => res.sendFile('index.html', { root: baseDir }))

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send({
        "error": {
            message: error.message
        }
    });
});

module.exports = app;