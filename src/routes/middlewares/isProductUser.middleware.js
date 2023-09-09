import ProductController from "../../controller/product.controller.js";

const productController = new ProductController();

export default async function isProductUser(req, res, next) {
  const product = await productController.getProductByidController(
    req.params.pid
  );
  if (
    (req.isAuthenticated() &&
      product.owner == req.session.user.email &&
      req.session.user.premium) ||
    (req.isAuthenticated() && req.session.user.role == "admin")
  ) {
    return next();
  }
  if (req.session.user.role == "user") {
    return res
      .status(403)
      .send("Acceso denegado, solo usuarios premium pueden acceder");
  } else {
    return res
      .status(403)
      .send("No puede eliminar un producto que no haya cargado");
  }
}
