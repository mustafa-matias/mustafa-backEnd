import { Router } from "express";
const router = Router();
import passport from "passport";
import { CurrentUserDTO } from "../controller/DTO/user.dto.js";
import CustomError from "../servicio/error/customError.class.js";
import { generateErrorInfo } from "../servicio/info.js";
import { ErrorEnum } from "../servicio/enum/error.enum.js";
import Mail from "../helpers/mail.js";
import userModel from "../persistencia/mongoDb/models/users.model.js";
import {
  generateRandomCode,
  createHash,
  isValidPassword,
} from "../../utils.js";
import SessionsController from "../controller/sessions.controller.js";
const sessionsController = new SessionsController();

router.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    req.session.user = {
      _id: req.user._id,
      name: req.user.firtName + " " + req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
      premium: req.user.premium,
      last_connetion: req.user.last_connetion,
      documents: req.user.documents
    };
    return res.redirect("/api/products");
  }
);

router.post(
  "/login",
  passport.authenticate("login"),
  async (req, res, next) => {
    const email = req.user.email;
    const password = req.user.password;
    if (!email || !password) {
      try {
        throw CustomError.createError({
          name: "login error",
          cause: generateErrorInfo({
            email,
            password,
          }),
          message: "error trying login",
          code: ErrorEnum.INVALID_TYPES_ERROR,
        });
      } catch (error) {
        next(error);
        return;
      }
    }
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });

    req.session.user = {
      _id: req.user._id,
      name: req.user.firtName + " " + req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
      premium: req.user.premium,
      last_connetion: req.user.last_connetion,
      documents: req.user.documents
    };
    res.send({ status: "success", payload: req.session.user });
  }
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github"),
  async (req, res) => {
    req.session.user = {
      _id: req.user._id,
      name: req.user.firtName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
      premium: req.user.premium,
      last_connetion: req.user.last_connetion,
      documents: req.user.documents
    };
    res.redirect("/api/products");
  }
);

router.get("/logout", async (req, res) => {
  const userId = req.session.user._id;
  req.session.destroy(async (err) => {
    if (!err) {
      await userModel.findByIdAndUpdate(userId, {
        last_connection: new Date(),
      });
      res.redirect("/api/sessions/login");
    } else res.send({ status: "logout ERROR", body: err });
  });
});

router.get("/current", (req, res) => {
  if (req.user) res.send(new CurrentUserDTO(req.user));
  else res.send({ status: "No se encuentra usuario logueado" });
});

router.post("/forgotPassword", async (req, res) => {
  const emailUsuario = req.body.email;
  try {
    await sessionsController.forgotPasswordController(emailUsuario);
    return res.redirect("/api/products");
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error en el servidor" });
  }
});

router.post("/resetPassword/:token", async (req, res) => {
  const token = req.params.token;
  const { password, confirmPassword } = req.body;
  try {
    await sessionsController.resetPasswordController(
      token,
      password,
      confirmPassword
    );
    return res.redirect("/api/sessions/login");
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error en el servidor" });
  }
});

export default router;
