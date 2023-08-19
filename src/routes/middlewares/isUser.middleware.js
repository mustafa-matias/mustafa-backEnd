export default function isUser(req, res, next) {
  if (req.isAuthenticated() && req.session.user.role == "user") {
    return next();
  }
  res.status(403).send("Acceso denegado, debe ser Usuario para acceder");
}
