import ProductController from "../../controller/product.controller.js";
import mongoose from "mongoose";

const productController = new ProductController();

export default async function isProductUser(req, res, next) {
  try {
    const productId = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("ID producto invalido");
    }

    const product = await productController.getProductByidController(productId);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    if (
      (req.isAuthenticated() &&
        product.owner == req.session.user.email &&
        req.session.user.premium) ||
      (req.isAuthenticated() && req.session.user.role == "admin")
    ) {
      return next();
    }
    if (
      req.isAuthenticated() &&
      product.owner != req.session.user.email &&
      req.session.user.premium
    ) {
      return res
        .status(403)
        .send("No puede eliminar un producto que no haya cargado");
    }
    if (req.session.user.role == "user") {
      return res
        .status(403)
        .send("Acceso denegado, solo usuarios premium pueden acceder");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
