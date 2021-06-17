const controller = require('./api');
const express = require('express');

async function startServer() {
    const app = express();
    require('./loaders/load').load(app);
    app.use('/', controller);

    app.listen(process.env.PORT, err => {
       if (err) {
           console.log(err);
           return;
       }
        console.log('Node.js 서버 시작됨!');
    });
}
startServer().then(_ => null);
