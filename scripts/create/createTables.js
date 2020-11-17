const mysql = require('mysql');
const fs = require('fs');

const db = mysql.createConnection(process.env.JAWSDB_MARIA_URL || {
    host: process.env.DBHOST || 'localhost',
    user: process.env.DBUSER || 'root',
    password: process.env.DBPASSWORD || 'password',
    database: 'calendar'
});

db.connect(function(err) {
    if(err){
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected to database as id ' + db.threadId);
});

['create_users.sql'].forEach(file => {
    fs.readFile(`scripts/create/sql/${file}`, 'utf8', (err, data) => {
        if(err){
            console.error(err);
            return;
        }

        db.query(data, (error, results, fields) => {
            if(error) throw error;
        });
    })
});