// noinspection JSDeprecatedSymbols

const crypto = require('crypto');

const encrypt = (email) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.crypto_key);
  let result = cipher.update(email, 'utf8', 'base64');
  result += cipher.final('base64');
  return result;
};

const decrypt = (encryptedEmail) => {
  const decipher = crypto.createDecipher('aes-256-cbc', process.env.crypto_key);
  let result = decipher.update(encryptedEmail, 'base64', 'utf8');
  result += decipher.final('utf8');
  return result;
};

module.exports = {
  encrypt,
  decrypt,
};
