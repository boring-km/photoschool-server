// test
const fs = require('fs');
const data = fs.readFileSync("test.txt").toString();

let array = data.split("\r\n");

function make(array) {
    fs.appendFile('test2.txt', `insert into School(region, schoolName) values(\'${array[0]}\', \'${array[1]}\');\n`, (err => {
        if (err) console.log(err)
    }));
}

for (let i = 0; i < array.length; i++) {
    make(array[i].replace("\t", ",").split(","));
}


