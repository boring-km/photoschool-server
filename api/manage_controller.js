const verify = require('../auth/token_verify');
const service = require('../services/manage_services');
const pushService = require('../services/push_services');
const logger = require('../config/winston');

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

const getNotApprovedPosts = async (req, res) => {
  try {
    const { index } = req.params;
    const result = { posts: await service.getNotApprovedPosts(index) };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const approvePost = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { postId } = req.body;
    if (verifyResult) {
      const approvalResult = await service.approvePost(verifyResult, postId);
      const pushResult = await pushService.notifyApproval(approvalResult, postId);
      const result = { result: pushResult };
      res.json(result);
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server Error!' });
  }
};

const rejectPost = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { postId } = req.body;
    if (verifyResult) {
      const rejectResult = await service.rejectPost(verifyResult, postId);
      const pushResult = await pushService.notifyApproval(!rejectResult, postId);
      const result = { result: pushResult };
      res.json(result);
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server Error!' });
  }
};

module.exports = {
  updateTitle,
  updateImage,
  deletePost,
  getNotApprovedPosts,
  approvePost,
  rejectPost,
};
