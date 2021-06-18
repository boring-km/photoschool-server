const verify = require('../auth/token_verify');
const logger = require('../config/winston');
const service = require('../services/post_services');

const getMyActivities = async (req, res) => {
    const verifyResult = await verify(req);
    if (verifyResult) {
        const { index } = req.params;
        const result = {
            numOfMyPosts: service.getMyPostsLength(verifyResult),
            posts: service.getMyPosts(verifyResult, index),
            schoolName: service.getMySchoolName(verifyResult)
        };
        logger.info(result);
        res.send(result);
    } else {
        res.status(401).send({ error: 'Token Error!' });
    }
}

module.exports = {
    getMyActivities
}