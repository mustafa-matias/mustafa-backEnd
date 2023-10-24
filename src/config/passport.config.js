import passport from "passport";
import local from "passport-local";
import userModel from "../persistencia/mongoDb/models/users.model.js";
import { createHash, isValidPassword } from "../../utils.js";
import GitHubStrategy from "passport-github2";
import CartController from "../controller/cart.controller.js";
import config from "./config.js";

const cartController = new CartController();

const LocalStrategy = local.Strategy;

const initializeStrategy = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        const { firtName, lastName, email, age } = req.body;

        try {
          let user = await userModel.findOne({ email: username });
          if (user) {
            console.log("Usuario Existente");
            return done(null, false);
          }

          const cart = await cartController.addCartController();
          let last_connection = new Date();
          let role = "user";
          let premium = false;
          if (email == config.adminEmail && password == config.adminPassword) {
            role = "admin";
            premium = true;
          }
          const newUser = {
            firtName,
            lastName,
            email,
            age,
            password: createHash(password),
            role,
            cart: cart._id,
            premium,
            last_connection,
          };
          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done("Error al obterner Usuario: " + error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });
          user.last_connection = new Date();
          user.save();
          if (!user) {
            console.log("User doesn't exits");
            return done(null, false);
          }
          if (!isValidPassword(password, user)) return done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: config.githubClientId,
        clientSecret: config.githubSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile.profileUrl });
          let last_connection = new Date();
          if (!user) {
            const cart = await cartController.addCartController();
            let newUser = {
              firtName: profile.username,
              lastName: " ",
              age: 18,
              email: profile.profileUrl,
              password: " ",
              role: "user",
              cart: cart._id,
              last_connection
            };

            let result = await userModel.create(newUser);
            done(null, result);
          } else {
            user.last_connection = new Date();
            user.save();
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default initializeStrategy;
