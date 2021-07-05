const service = require('../services/creature_services');
const logger = require('../config/winston');

const searchCreature = async (req, res) => {
  try {
    const result = await service.searchCreature(req.query);
    logger.debug(JSON.stringify(result.data));
    res.send(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const searchDetail = async (req, res) => {
  try {
    const result = await service.searchDetail(req.query);
    res.send(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

module.exports = {
  searchCreature,
  searchDetail,
};
