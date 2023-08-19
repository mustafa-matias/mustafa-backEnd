export default function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.session.user.role == "admin") {
    return next();
  }
  res.status(403).send("Acceso denegado, debe ser Admin para acceder");
}
