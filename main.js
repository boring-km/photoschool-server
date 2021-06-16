const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const verify = require('./auth/token_verify');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

require('dotenv').config();
const port = process.env.server_port;

// Firebase ID Token Verification
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./auth/photo-school-ff482-firebase-adminsdk-klbz1-cc8536e55b.json')
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    projectId: "photo-school-ff482"
});

app.get("/", (req, res) => {
    res.send("진강민");
});

app.get("/test/:a/:b/:c", (req, res) => {
   let {a, b, c} = req.params;
   res.send(`success ${a} ${b} ${c}`);
});

app.get("/test/jwt/get", async (req, res) => {
    const idToken = req.header("x-access-token");
    console.log(idToken);
    const result = await verify(firebaseAdmin, idToken);
    res.send(result);
});

app.post("/test/jwt/post", async (req, res) => {
    const idToken = req.header("x-access-token");
    // console.log(idToken);
    console.log(req.body);
    const result = await verify(firebaseAdmin, idToken);
    res.send(result);
});

app.listen(port, () => console.log(`${port} 포트로 시작`));