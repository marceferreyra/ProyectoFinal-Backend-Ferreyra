const dotenv = require('dotenv');
const { Command } = require('commander');

const program = new Command();

program
    .option('-e, --env <type>', 'Set environment type (development/production)')
    .parse(process.argv);

const environment = program.opts().env || 'development';

dotenv.config({
    path: environment === 'production' ? './src/config/.env.production' : './src/config/.env.development'
});

const config = {
    host: process.env.HOST,
    port: process.env.PORT,
    dbUrl: process.env.DB_URL,
    sessionSecret: process.env.SESSION_SECRET,
    githubClientId: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    userNodeMailer: process.env.USER_NODEMAILER,
    passNodeMailer: process.env.PASS_NODEMAILER,
    userAdmin: process.env.USER_ADMIN,
    passAdmin: process.env.PASS_ADMIN,
    environment: environment
};

module.exports = config;
