import passport from "passport";
import local from "passport-local";
import userModel from "../persistencia/mongoDb/models/users.model.js";
import { createHash, isValidPassword } from "../../utils.js";
import GitHubStrategy from 'passport-github2';
import CartManager from "../persistencia/mongoDb/cartManager.class.js";
import config from "./config.js";

const cartManager = new CartManager();

const LocalStrategy = local.Strategy;

const initializeStrategy = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { firtName, lastName, email, age } = req.body;

            try {
                let user = await userModel.findOne({ email: username });
                if (user) {
                    console.log('Usuario Existente');
                    return done(null, false);
                }

                const cart = await cartManager.addCart();

                let role = 'user';
                if (email == config.adminEmail && password == config.adminPassword) {
                    role = 'admin';
                }

                const newUser = {
                    firtName, lastName, email, age, password: createHash(password), role, cart: cart._id
                }
                let result = await userModel.create(newUser);
                return done(null, result)
            } catch (error) {
                return done('Error al obterner Usuario: ' + error);
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })
    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id);
        done(null, user);
    })

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) {
                console.log("User doesn't exits");
                return done(null, false);
            }
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('github', new GitHubStrategy(
        { clientID: 'Iv1.2fd3123f38d67d52', clientSecret: 'eba6a01cef014aefc855e31f2f71cf658196fa49', callbackURL: 'http://localhost:8080/api/sessions/githubcallback' },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({ email: profile.profileUrl });
                if (!user) {
                    const cart = await cartManager.addCart();
                    let newUser = {
                        firtName: profile.username,
                        lastName: ' ',
                        age: 18,
                        email: profile.profileUrl,
                        password: ' ',
                        role: 'user',
                        cart: cart._id
                    }
                    let result = await userModel.create(newUser);
                    done(null, result);
                } else {
                    return done(null, user);
                }
            }
            catch (error) {
                return done(error);
            }
        }))
}

export default initializeStrategy;

