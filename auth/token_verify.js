module.exports = async (admin, idToken) => {
    const email = await admin.auth().verifyIdToken(idToken).then((decodedToken) => decodedToken.email);
    if (email) {
        console.log(email);
        return "성공";
    } else {
        return "실패";
    }
};