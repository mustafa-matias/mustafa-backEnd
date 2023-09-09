import ProductController from "../../controller/product.controller.js";

const productController = new ProductController();

export default async function isProductCarUser(req, res, next) {
  const product = await productController.getProductByidController(
    req.params.pid
  );
  if (product.owner !== req.session.user.email) {
    return next();
  }
  return res
    .status(403)
    .send(
      "Acceso denegado, no puede agregar al carrito productos que le pertenecen"
    );
}
