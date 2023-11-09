export default function isCartUser(req, res, next) {
  if (
    req.isAuthenticated() &&
    req.session.user.cart == req.params.cid &&
    req.session.user.role == "user"
  ) {
    return next();
  }
  if (req.session.user.role == "user") {
    res.status(403).send(`Acceso denegado: el id proporcionado no correponde al usuario ${req.session.user.name} `);
  } else {
    res
      .status(403)
      .send("Acceso denegado: el Admin no puede cargar productos al Carrito");
  }
}
