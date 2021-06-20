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

const searchPosts = async (req, res) => {
    const { searchType, sortType, searchText, index } = req.params;
    const result = {
        posts: await service.getSearchedPosts(searchType, sortType, searchText, index)
    };
    res.json(result);
}

const registerPost = async (req, res) => {
    const verifyResult = await verify(req);
    const { apiId, title } = req.body;
    if (verifyResult) {
        const result = { result: await service.registerPost(verifyResult, apiId, title) };
        res.json(result);
    } else {
        res.status(401).json({ error: 'Token Error!' });
    }
}

const updateTitle = async (req, res) => {
    const verifyResult = await verify(req);
    const { postId, title } = req.body;
    if (verifyResult) {
        const result = { result: await service.updateTitle(verifyResult, postId, title) };
        res.json(result);
    } else {
        res.status(401).json({ error: 'Token Error!' });
    }
}

const updateImage = async (req, res) => {
    const verifyResult = await verify(req);
    const { postId, tbImgURL, imgURL } = req.body;
    if (verifyResult) {
        const result = { result: await service.updateImage(verifyResult, postId, tbImgURL, imgURL) };
        res.json(result);
    } else {
        res.status(401).json({ error: 'Token Error!' });
    }
}

const deletePost = async (req, res) => {
    const verifyResult = await verify(req);
    const { postId } = req.params;
    if (verifyResult) {
        const result = { result: await service.deletePost(verifyResult, postId) };
        res.json(result);
    } else {
        res.status(401).json({ error: 'Token Error!' });
    }
}

module.exports = {
    getMyActivities,
    getPostsByApiId,
    getAwardPosts,
    getSchoolRank,
    getAllPosts,
    searchPosts,
    registerPost,
    updateTitle,
    updateImage,
    deletePost
}