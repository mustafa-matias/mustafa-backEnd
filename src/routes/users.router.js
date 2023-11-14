import { Router } from "express";
const router = Router();
import UsersController from "../controller/users.controller.js";
const usersController = new UsersController();
import { uploader } from "../../utils.js";
import checkDocuments from "./middlewares/checkDocuments.js";
import isAdmin from "./middlewares/isAdmin.middleware.js";

router.put("/premium/:id", checkDocuments, async (req, res) => {
  try {
    const result = await usersController.updateUserPremiumController(req);
    res.send({
      message: "La actualización se realizó correctamente",
      status: "success",
      premium: result.premium,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.put("/role/:id", isAdmin , async (req, res) => {
  try {
    const result = await usersController.updateAdminUserPremiumController(req);
    res.send({
      message: "La actualización se realizó correctamente",
      status: "success",
      premium: result.role,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


router.post(
  "/:uid/documents",
  uploader.fields([
    { name: "fotoPerfil" },
    { name: "dniFrente" },
    { name: "dniDorso" },
  ]),
  async (req, res) => {
    try {
      const result = await usersController.documentsController(req);
      return res.status(200).json({ message: "Documentos cargados con éxito" });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
);

router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await usersController.getUsersController();
    res.send({ status: "success", payload: users });
    } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/", isAdmin, async (req, res) => {
  try {
    const users = await usersController.deleteUsersController();
    if (users) {
      res.send({ status: "success", payload: users });
    } else {
      res.status(404).send({ error: "No se eliminaron usuarios" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const user = await usersController.deleteUserController(req);
    if (user) {
      res.status(200).send({ status: "success", payload: user });
    } 
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


export default router;
