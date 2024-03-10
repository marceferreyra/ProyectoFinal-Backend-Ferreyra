const passport = require('passport')
const github = require('passport-github2')
const User = require('../dao/db/models/userModel')

const initPassport = () => {

    passport.use("githubAuth", new github.Strategy(
        {
            clientID: "Iv1.40b1e8ea837556dc",
            clientSecret: "f92e5f68d5e28615352d7e4cc767a3f403d4fa52",
            callbackURL: "http://localhost:8080/api/sessions/callbackGithub"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
              console.log(profile)
                let { name, email } = profile._json
                let user = await User.findOne({ email })
                if (!user) {
                    user = await User.create({
                        name: name, email, github: profile
                    }
                    )
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ))
}

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((user, done) => {
    done(null, user)
})

module.exports = { initPassport }