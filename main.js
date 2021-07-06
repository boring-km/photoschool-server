const express = require('express');
const cron = require('node-cron');
const controller = require('./api');
const logger = require('./config/winston');
const batchService = require('./services/batch_services');

async function startServer() {
  const app = express();
  // eslint-disable-next-line global-require
  require('./loaders/load').load(app);
  app.use('/', controller);

  app.use((req, res) => {
    res.status(500).send({ error: 'Server Error!' });
  });
  cron.schedule('0 0 0 1 * *', async () => {
    await batchService.getNewAwards();
    logger.info('Award 배치 동작');
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
