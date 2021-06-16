const jwtTest = require('./jwt');
const express = require('express');

async function startServer() {
    const app = express();
    require('./loaders/express').load(app);
    app.use('/jwt', jwtTest);

    app.listen(process.env.PORT, err => {
       if (err) {
           console.log(err);
           return;
       }
        console.log('Node.js 서버 시작됨!');
    });
}
startServer().then(_ => null);
