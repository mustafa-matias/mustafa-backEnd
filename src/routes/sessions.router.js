import { Router } from "express";
const router = Router();
import passport from "passport";
import { CurrentUserDTO } from "../controller/DTO/user.dto.js";
import CustomError from "../servicio/error/customError.class.js";
import { generateErrorInfo } from "../servicio/info.js";
import { ErrorEnum } from "../servicio/enum/error.enum.js";

router.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    req.session.user = {
      name: req.user.firtName + " " + req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    return res.redirect("/products");
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
      name: req.user.firtName + " " + req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    console.log(req.session);
    res.send({ status: "success", message: req.session.user });
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
      name: req.user.firtName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) res.redirect("/api/sessions/login");
    else res.send({ status: "logout ERROR", body: err });
  });
});

router.get("/current", (req, res) => {
  if (req.user) res.send(new CurrentUserDTO(req.user));
  else res.send({ status: "No se encuentra usuario logueado" });
});

export default router;
