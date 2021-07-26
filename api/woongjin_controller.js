const service = require('../services/woongjin_services');

const searchDetail = async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await service.searchDetail(pid);
    res.send(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

module.exports = {
  searchDetail,
};
