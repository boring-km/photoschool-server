const controller = require('./api');
const express = require('express');
const logger = require('./config/winston');

async function startServer() {
    const app = express();
    require('./loaders/load').load(app);
    app.use('/', controller);

    app.use(function(req, res, next) {
        res.status(500).send({ error: 'Server Error!' });
    });

    app.listen(process.env.PORT, err => {
       if (err) {
           logger.error(err);
           return;
       }
       logger.debug('Node.js 서버 시작됨!');
    });
}
startServer().then(_ => null);
