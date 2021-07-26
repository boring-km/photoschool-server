const axios = require('axios');
const logger = require('../config/winston');

const searchDetail = async (pid) => {
  try {
    const domain = process.env.woongjin_domain;
    const apiPath = process.env.woongjin_search_detail_wjpedia;
    const url = encodeURI(`${domain}${apiPath}${pid}`);
    logger.debug(url);
    return await axios.get(url);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

module.exports = {
  searchDetail,
};
