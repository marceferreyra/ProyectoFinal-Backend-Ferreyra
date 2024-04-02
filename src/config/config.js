require('dotenv').config();

const config = {
    host: process.env.HOST ,
    port: process.env.PORT,
    dbUrl: process.env.DB_URL,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET
};

module.exports = config;