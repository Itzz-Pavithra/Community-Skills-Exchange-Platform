const config = {
    development: {
        mongoURI: process.env.MONGODB_URI,
        jwtSecret: process.env.JWT_SECRET,
        smtp: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
            from: process.env.SMTP_FROM
        },
        mapbox: {
            accessToken: process.env.MAPBOX_ACCESS_TOKEN
        }
    },
    production: {
        mongoURI: process.env.MONGODB_URI,
        jwtSecret: process.env.JWT_SECRET,
        smtp: {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
            from: process.env.SMTP_FROM
        },
        mapbox: {
            accessToken: process.env.MAPBOX_ACCESS_TOKEN
        }
    }
};

module.exports = config[process.env.NODE_ENV || 'development'];