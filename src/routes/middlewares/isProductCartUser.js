import ProductController from "../../controller/product.controller.js";
const productController = new ProductController();
import mongoose from "mongoose";

export default async function isProductCarUser(req, res, next) {
  try {
    const productId = req.params.pid;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).send("ID producto invalido");
    }
    const product = await productController.getProductByidController(
      req.params.pid
    );
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    if (product.owner !== req.session.user.email) {
      return next();
    }
    return res
      .status(403)
      .send(
        "Acceso denegado: No puede agregar al carrito productos que le pertenecen"
      );
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
