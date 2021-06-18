const verify = require('../auth/token_verify');

const serverTest = async (req, res) => {
    res.send("8500 서버 OK");
}
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
    serverTest,
    jwtGetTest,
    jwtPostTest
}