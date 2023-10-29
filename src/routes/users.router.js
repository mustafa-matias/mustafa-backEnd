import { Router } from "express";
const router = Router();
import UsersController from "../controller/users.controller.js";
const usersController = new UsersController();
import { uploader } from "../../utils.js";
import userModel from "../persistencia/mongoDb/models/users.model.js";
import checkDocuments from "./middlewares/checkDocuments.js";
import { CurrentUserDTO } from "../controller/DTO/user.dto.js";
import Mail from "../helpers/mail.js";
const mail = new Mail();

router.put("/premium/:id", checkDocuments, async (req, res) => {
  try {
    const userID = req.params.id;
    const result = await usersController.updateUserPremiumController(userID);
    if (result.error) {
      return res.status(400).send({ error: result.error });
    }
    req.session.user.premium = result.premium;
    res.send({
      mensaje: "La actualización se realizó correctamente",
      estado: "éxito",
      premium: result.premium,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error en el servidor" });
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
    console.log(req.files);

    const files = req.files;
    try {
      const userId = req.params.uid;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      if (files.fotoPerfil) {
        const fotoPerfil = {
          name: files.fotoPerfil[0].filename,
          reference: files.fotoPerfil[0].path.split("public\\")[1],
        };
        user.documents.push(fotoPerfil);
      }
      if (files.dniFrente) {
        const dniFrente = {
          name: files.dniFrente[0].filename,
          reference: files.dniFrente[0].path.split("public\\")[1],
        };
        user.documents.push(dniFrente);
      }
      if (files.dniDorso) {
        const dniDorso = {
          name: files.dniDorso[0].filename,
          reference: files.dniDorso[0].path.split("public\\")[1],
        };
        console.log(dniDorso.reference);
        user.documents.push(dniDorso);
      }
      await user.save();
      req.session.user.documents = user.documents;
      console.log(req.session.user.documents);
      return res.status(200).json({ message: "Documentos cargados con éxito" });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/", async (req, res) => {
  let users = await userModel.find();
  if (users.length > 0) {
    const usersDto = users.map((user) => new CurrentUserDTO(user));
    res.send(usersDto);
  } else res.send({ status: "No se encuentran usuarios" });
});

router.delete("/", async (req, res) => {
  let users = await userModel.find();
  const currentTime = new Date();
  if (users.length > 0) {
    const usersToDelete = users.filter((user) => {
      const lastConnectionTime = new Date(user.last_connection);
      currentTime.setDate(currentTime.getDate() - 2);
      return lastConnectionTime < currentTime;
    });
    for (const user of usersToDelete) {
      mail.sendDeleteUser(
        user,
        "Se ha eliminado su cuenta",
        `http://localhost:8080/api/sessions/register`
      );
      await userModel.findByIdAndRemove(user._id);
    }
    res.send({ status: "success" });
  } else res.send({ status: "No se encuentran usuarios" });
});

export default router;
