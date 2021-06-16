const bodyParser = require('body-parser');
const cors = require('cors');
function load(app) {
    require('dotenv').config();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cors());

    console.log('Express 초기화 완료됨');

    const getConnection = require('./db');
    getConnection((connection) => {
       connection.query('select 1 + 1 as solution', (err, results) => {
           if (err) throw err;
           console.log(`The solution is: `, results[0].solution);
        });
    });
}

module.exports = { load };