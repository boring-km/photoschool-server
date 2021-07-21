const axios = require('axios');
const postService = require('./post_services');
const logger = require('../config/winston');

const notifyApproval = async (postId, approval) => {
  const fcmURL = process.env.fcm_url;
  const fcmKey = process.env.fcm_authorization_key;
  const postDetail = await postService.searchDetailPost(postId, false);
  logger.debug(`postDetail: ${JSON.stringify(postDetail)}`);
  let bodyText = '';
  if (approval === 'approve') {
    bodyText = '게시물이 승인되었습니다.';
  } else if (approval === 'reject') {
    bodyText = '게시물이 거부되었습니다.';
  }
  const data = {
    to: `/topics/${postId}`,
    direct_book_ok: true,
    notification: {
      title: '포토스쿨 승인/거부 알림',
      body: bodyText,
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
