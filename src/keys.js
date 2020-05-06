require('dotenv').config({path: 'src/.env'});
console.log(process.env);

module.exports = {

    database: {
        connectionLimit: 10,
        host: process.env.MY_HOST,
        user: process.env.MY_USER,
        password: process.env.MY_PASSWORD,
        database: 'db_smarttheeth'
    }

};
