const service = require('../services/school_services');
const verify = require('../auth/token_verify');

const searchSchool = async (req, res) => {
  try {
    const { schoolName } = req.params;
    const result = {
      schools: await service.searchSchoolName(schoolName),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const getMySchoolInfo = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    if (verifyResult) {
      const school = await service.getMySchoolInfo(verifyResult);
      res.json({ result: school });
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const getSchoolRank = async (req, res) => {
  try {
    const { index } = req.params;
    const result = {
      topSchools: await service.getSchoolRank(index),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const getSchoolRankOriginal = async (req, res) => {
  try {
    const result = {
      topSchools: await service.getSchoolRank(0),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

module.exports = {
  searchSchool,
  getMySchoolInfo,
  getSchoolRank,
  getSchoolRankOriginal,
};
