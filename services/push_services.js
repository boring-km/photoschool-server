const axios = require('axios');
const postService = require('./post_services');
const logger = require('../config/winston');

const notifyApproval = async (approvalResult, postId) => {
  const fcmURL = process.env.fcm_url;
  const fcmKey = process.env.fcm_authorization_key;
  const postDetail = await postService.searchDetailPost(postId);
  logger.debug(`postDetail: ${JSON.stringify(postDetail)}`);
  const data = {
    to: `/topics/${postId}`,
    direct_book_ok: true,
    notification: {
      title: '포토스쿨 승인/거부 알림',
      body: approvalResult ? '게시물이 승인되었습니다.' : '게시물이 거부되었습니다.',
    },
    data: {
      postId,
      title: postDetail.title,
      nickname: postDetail.nickname,
    },
  };
  logger.debug(`url: ${fcmURL}, data: ${JSON.stringify(data)}`);
  const headers = { 'Content-Type': 'application/json', Authorization: `key=${fcmKey}` };
  logger.debug(`headers: ${JSON.stringify(headers)}`);
  const response = await axios.post(fcmURL, data, { headers });
  return response.status === 200;
};

module.exports = {
  notifyApproval,
};
