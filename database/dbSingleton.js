const mysql = require('mysql2');

let connection; // Variable for storing a single connection

const dbSingleton = {
/**
 * Establishes and returns a singleton MySQL database connection.
 * If the connection does not exist, it creates a new one using the specified
 * host, user, password, and database. If a connection already exists, it returns
 * the existing connection. Throws an error if unable to connect.
 *
 * @returns {object} The MySQL database connection.
 */
    getConnection: () => {
        if (!connection) {
            // Create a connection only once
            connection = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'user_db',
            });

            connection.connect((err) => {
                if (err) {
                    console.error('Error connecting to database:', err);
                    throw err;
                }
                console.log('Connected to MySQL!');
            });
        }
        return connection;
    }
};

module.exports = dbSingleton;