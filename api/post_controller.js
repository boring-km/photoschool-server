const verify = require('../auth/token_verify');
const service = require('../services/post_services');

const getMyActivities = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    if (verifyResult) {
      const { index } = req.params;
      const result = {
        posts: await service.getMyPosts(verifyResult, index),
        awards: await service.getMyAwards(verifyResult),
        schoolName: await service.getMySchoolName(verifyResult),
      };
      res.json(result);
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const getPostsByApiId = async (req, res) => {
  try {
    const { apiId, index } = req.params;
    const result = {
      posts: await service.getPostsByApi(apiId, index),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const getAwardPosts = async (req, res) => {
  try {
    const { index } = req.params;
    const result = {
      posts: await service.getAwardPosts(index),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const { index } = req.params;
    const result = {
      posts: await service.getAllPosts(index),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const searchPosts = async (req, res) => {
  try {
    const {
      searchType, sortType, searchText, index,
    } = req.params;
    const result = {
      posts: await service.getSearchedPosts(searchType, sortType, searchText, index),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const searchDetail = async (req, res) => {
  try {
    const { postId } = req.params;
    const result = {
      post: await service.searchDetailPost(postId, true),
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const checkLike = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { postId } = req.params;
    if (verifyResult) {
      const result = { result: await service.checkDoLikeBefore(verifyResult, postId) };
      res.json(result);
    } else {
      res.json(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const registerPost = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { apiId, title } = req.body;
    if (verifyResult) {
      const result = { result: await service.registerPost(verifyResult, apiId, title) };
      res.json(result);
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const likeOrNotLikePost = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { postId } = req.body;
    if (verifyResult) {
      const result = { result: await service.likeOrNotLikePost(verifyResult, postId) };
      res.json(result);
    } else {
      res.json(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const updateTitle = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { postId, title } = req.body;
    if (verifyResult) {
      const result = { result: await service.updateTitle(verifyResult, postId, title) };
      res.json(result);
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const updateImage = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { postId, tbImgURL, imgURL } = req.body;
    if (verifyResult) {
      const result = { result: await service.updateImage(verifyResult, postId, tbImgURL, imgURL) };
      res.json(result);
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const deletePost = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { postId } = req.params;
    if (verifyResult) {
      const result = { result: await service.deletePost(verifyResult, postId) };
      res.json(result);
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

module.exports = {
  getMyActivities,
  getPostsByApiId,
  getAwardPosts,
  getAllPosts,
  searchPosts,
  searchDetail,
  checkLike,
  registerPost,
  likeOrNotLikePost,
  updateTitle,
  updateImage,
  deletePost,
};
