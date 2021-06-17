const bodyParser = require('body-parser');
const cors = require('cors');

function load(app) {
    require('dotenv').config();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cors());

    console.log('Express 초기화 완료됨');

    // db connection test
    let db = require('../loaders/db');
    db((connection) => {

        connection.query('select 1 + 1 as solution', (err, results) => {
            if (err) throw err;
            console.log(results);
        });
    });
}

module.exports = { load };