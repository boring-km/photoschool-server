const verify = require('../auth/token_verify');
const logger = require('../config/winston');
const service = require('../services/user_service');

const signUpCheck = async (req, res) => {
    const verifyResult = await verify(req);
    logger.info("사용자 가입 확인");
    if (verifyResult) {
        const result = await service.isIncludeEmail(verifyResult);
        logger.info(`등록여부: ${result}`);
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

module.exports = {
    signUpCheck,
    getUserNickName
}