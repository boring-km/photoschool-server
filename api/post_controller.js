const verify = require('../auth/token_verify');
const logger = require('../config/winston');
const service = require('../services/post_services');

const getMyActivities = async (req, res) => {
    const verifyResult = await verify(req);
    if (verifyResult) {
        const { index } = req.params;
        const result = {
            numOfMyPosts: await service.getMyPostsLength(verifyResult),
            posts: await service.getMyPosts(verifyResult, index),
            schoolName: await service.getMySchoolName(verifyResult)
        };
        logger.info(`getMyActivities: ${result}`);
        res.json(result);
    } else {
        res.status(401).json({ error: 'Token Error!' });
    }
}

const getPostsByApiId = async (req, res) => {
    const { apiId, index } = req.params;
    const result = {
        numOfPosts: await service.getPostLengthByApi(apiId),
        posts: await service.getPostsByApi(apiId, index)
    };
    res.json(result);
}

const getAwardPosts = async (req, res) => {
    const { index } = req.params;
    const result = {
        numOfPosts: await service.getAwardPostsLength(),
        posts: await service.getAwardPosts(index)
    };
    res.json(result);
}

const getSchoolRank = async (req, res) => {
    const result = {
        topSchools: await service.getTop10Schools()
    };
    res.json(result);
}

const getAllPosts = async (req, res) => {
    const { index } = req.params;
    const result = {
        numOfPosts: await service.getAllPostLength(),
        posts: await service.getAllPosts(index)
    };
    res.json(result);
}

module.exports = {
    getMyActivities,
    getPostsByApiId,
    getAwardPosts,
    getSchoolRank,
    getAllPosts
}