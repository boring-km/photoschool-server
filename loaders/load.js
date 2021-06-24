const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('../config/winston');
// db connection test
const db = require('./db');

function load(app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  logger.debug('Express 초기화 완료됨');
  db((connection) => {
    connection.query('select 1 + 1 as solution', (err) => {
      if (err) throw err;
      logger.info('DB 연결됨');
    });
    connection.release();
  });
}

module.exports = { load };
