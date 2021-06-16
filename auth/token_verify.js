// Firebase ID Token Verification
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../auth/photo-school-ff482-firebase-adminsdk-klbz1-cc8536e55b.json');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    projectId: "photo-school-ff482"
});

module.exports = async (req) => {
    const idToken = req.header("x-access-token");
    const email = await firebaseAdmin.auth().verifyIdToken(idToken).then((decodedToken) => decodedToken.email);
    if (email) {
        console.log(email);
        return true;
    } else {
        return false;
    }
};