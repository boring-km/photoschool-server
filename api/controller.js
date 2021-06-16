const verify = require('../auth/token_verify');

const jwtGetTest = async (req, res) => {
    const result = await verify(req);
    res.send(result);
}

const jwtPostTest = async (req, res) => {
    const result = await verify(req, res);
    console.log(req.body);
    res.send(result);
}

module.exports = {
    jwtGetTest,
    jwtPostTest
}