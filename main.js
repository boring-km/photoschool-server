const express = require('express');
const controller = require('./api');
const logger = require('./config/winston');

async function startServer() {
  const app = express();
  // eslint-disable-next-line global-require
  require('./loaders/load').load(app);
  app.use('/', controller);

  app.use((req, res) => {
    res.status(500).send({ error: 'Server Error!' });
  });

  app.listen(process.env.PORT, (err) => {
    if (err) {
      logger.error(err);
      return;
    }
    logger.debug('Node.js 서버 시작됨!');
  });
}
startServer().then(() => null);
