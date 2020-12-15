const config = { 
    database: 'lms_db',
    username: 'root',
    password: '',
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        // acquire: 30000,
        idle: 10000,
    },
    privateKey: "$$$lms$$$",
    facebookAuth: {
        clientID: '599156487421899',
        clientSecret: 'dfc899cc25d27db690de48e79962bc6a'
    }

};

module.exports = config;
