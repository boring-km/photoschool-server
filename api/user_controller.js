const verify = require('../auth/token_verify');
const service = require('../services/user_service');

const signUpCheck = async (req, res) => {
    const verifyResult = await verify(req);
    if (verifyResult) {
        const result = await service.isIncludeEmail(verifyResult);
        res.json({ isRegistered: result });
    } else {
        res.status(401).json({ error: 'Token Error!' });
    }
}

const getUserNickName = async (req, res) => {
    const verifyResult = await verify(req);
    if (verifyResult) {
        const result = await service.findNickName(verifyResult);
        res.json({ nickname: result });
    } else {
        res.json(401).json({ error: 'Token Error!' });
    }
}

const registerUser = async (req, res) => {
    const verifyResult = await verify(req);
    const { nickname, schoolId } = req.body;
    if (verifyResult) {
        const result = await service.insertUser(verifyResult, nickname, schoolId);
        res.json({ result: result });
    } else {
        res.json(401).json({ error: 'Token Error!' });
    }
}

module.exports = {
    signUpCheck,
    getUserNickName,
    registerUser
}