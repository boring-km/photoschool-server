const verify = require('../auth/token_verify');
const service = require('../services/manage_services');
const pushService = require('../services/push_services');
const logger = require('../config/winston');

const getNotApprovedPosts = async (req, res) => {
  try {
    const { index } = req.params;
    const result = { posts: await service.getNotApprovedPosts(index) };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server Error!' });
  }
};

const processPostApproval = async (req, res) => {
  try {
    const verifyResult = await verify(req);
    const { postId, approval } = req.body;
    if (verifyResult) {
      const approvalResult = await service.processApproval(verifyResult, postId, approval);
      if (approvalResult) {
        const pushResult = await pushService.notifyApproval(postId, approval);
        const result = { result: pushResult };
        res.json(result);
      } else {
        res.status(500).json({ error: 'Server Error!' });
      }
    } else {
      res.status(401).json({ error: 'Token Error!' });
    }
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: 'Server Error!' });
  }
};

module.exports = {
  getNotApprovedPosts,
  processPostApproval,
};
