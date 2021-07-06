const verify = require('../auth/token_verify');
const service = require('../services/user_service');

const signUpCheck = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    if (verifyResult) {
      const result = await service.isIncludeEmail(verifyResult);
      res.json({ isRegistered: result });
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const getUserNickName = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    if (verifyResult) {
      const result = await service.findNickName(verifyResult);
      res.json({ nickname: result.nickname, isAdmin: result.isAdmin });
    } else {
      res.json(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const registerUser = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { nickname, schoolId } = req.body;
    if (verifyResult) {
      const result = await service.insertUser(verifyResult, nickname, schoolId);
      res.json({ result });
    } else {
      res.json(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

module.exports = {
  signUpCheck,
  getUserNickName,
  registerUser,
};
