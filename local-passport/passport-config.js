const passport = require('passport')
const bcrypt = require('bcrypt');

const LocalStartegy = require('passport-local').Strategy

async function initialize(passport, getUserByEmail, getUserById) {

    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (user === null) {
            return done(null, false, {message: 'No user with that email'})
        }

        try {
            console.log("--", password, user)
            if(user?.password) {
                if( await bcrypt.compare(password, user.password)) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'Password incorrect' })
                }
            } else {
                return done(null, false, { message: 'pls enter a password' })
            }

        } catch(e) {
            return done(e)
        }
    }


    passport.use(new LocalStartegy( { usernameField: 'emailname', passwordField: 'passwordname'} , authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id ))
    passport.deserializeUser((id, done) => done(null, getUserById(id)))
}

module.exports = initialize;