export default function isPremium(req, res, next) {
  if (req.isAuthenticated() && req.session.user.premium) {
    return next();
  }
  res.status(403).send("Acceso denegado, debe ser Premium para acceder");
}
