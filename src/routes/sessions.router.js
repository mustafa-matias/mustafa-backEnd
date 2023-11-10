import { Router } from "express";
const router = Router();
import passport from "passport";
import { CurrentUserDTO } from "../controller/DTO/user.dto.js";
import userModel from "../persistencia/mongoDb/models/users.model.js";
import SessionsController from "../controller/sessions.controller.js";
const sessionsController = new SessionsController();

router.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    try {
      req.session.user = {
        _id: req.user._id,
        name: req.user.firstName + " " + req.user.lastName,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart,
        premium: req.user.premium,
        last_connetion: req.user.last_connetion,
        documents: req.user.documents,
      };
      res.status(200).json({ status: "Successful registration" });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

router.post(
  "/login",
  passport.authenticate("login"),
  async (req, res, next) => {
    const email = req.user.email;
    const password = req.user.password;
    if (!email || !password) {
        return('error')
    }
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });

    req.session.user = {
      _id: req.user._id,
      name: req.user.firstName + " " + req.user.lastName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
      premium: req.user.premium,
      last_connetion: req.user.last_connetion,
      documents: req.user.documents,
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
      name: req.user.firstName,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
      premium: req.user.premium,
      last_connetion: req.user.last_connetion,
      documents: req.user.documents,
    };
    res.redirect("/products");
  }
);

router.get("/logout", async (req, res) => {
  try {
    const userId = req.session.user._id;
    req.session.destroy(async (err) => {
      if (!err) {
        await userModel.findByIdAndUpdate(userId, {
          last_connection: new Date(),
        });
        res.send({ status: "success" });
      }
    });
  } catch (err) {
    res.send({
      status: "success",
      message: "No hay sesion abierta para cerrar",
    });
  }
});

router.get("/current", (req, res) => {
  if (req.user) res.send(new CurrentUserDTO(req.user));
  else res.send({ status: "No se encuentra usuario logueado" });
});

router.post("/forgotPassword", async (req, res) => {
  try {
    const emailUsuario = req.body.email;
    await sessionsController.forgotPasswordController(emailUsuario);
    return res.status(200).send({ status: "success" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

router.post("/resetPassword/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const { password, confirmPassword } = req.body;
    await sessionsController.resetPasswordController(
      token,
      password,
      confirmPassword
    );
    return res.send({ status: "success" });
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

export default router;
