const axios = require('axios');
const logger = require('../config/winston');

const searchCreature = async (input) => {
  try {
    const {
      st, sw, serviceKey, numOfRows, pageNo,
    } = input;
    const baseUrl = process.env.creature_url;
    const url = encodeURI(`${baseUrl}/childIlstrSearch?st=${st}&sw=${sw}&serviceKey=${serviceKey}&numOfRows=${numOfRows}&pageNo=${pageNo}`);
    logger.debug(url);
    return await axios.get(url);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

const searchDetail = async (input) => {
  try {
    const {
      q1, serviceKey,
    } = input;
    const baseUrl = process.env.creature_url;
    const url = encodeURI(`${baseUrl}/childIlstrInfo?q1=${q1}&serviceKey=${serviceKey}`);
    logger.debug(url);
    return await axios.get(url);
  } catch (err) {
    logger.error(err);
    throw err;
  }
};

module.exports = {
  searchCreature,
  searchDetail,
};
