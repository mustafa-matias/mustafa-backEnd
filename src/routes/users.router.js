import { Router } from "express";
const router = Router();
import UsersController from "../controller/users.controller.js";
const usersController = new UsersController();
import { uploader } from "../../utils.js";
import userModel from "../persistencia/mongoDb/models/users.model.js";
import checkDocuments from "./middlewares/checkDocuments.js";

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
    { name: "profiles", maxCount: 3 },
    { name: "products" },
    { name: "documents" },
  ]),
  async (req, res) => {
    const profiles = req.files.profiles;
    try {
      const userId = req.params.uid;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      if (profiles && user.documents.length < 3) {
        profiles.forEach((image) => {
          user.documents.push({
            name: image.filename,
            reference: image.path,
          });
        });
        await user.save();
        req.session.user.documents = user.documents;
      }else{
        return res.send("Ya llego al limite de archivos")
      }
      return res.status(200).json({ message: "Documentos cargados con éxito" });
    } catch (error) {
      console.log(error)
    }
  }
);
export default router;
