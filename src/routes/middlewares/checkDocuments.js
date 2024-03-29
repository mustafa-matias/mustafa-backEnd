export default function checkDocuments(req, res, next) {
  if (req.isAuthenticated() && req.session.user.premium) {
    return next();
  }
  if (req.isAuthenticated() && req.session.user.documents.length === 3) {
    return next();
  }
  return res.send(
    "Acceso denegado, debe cargar toda la documentacion para ser usuario premium"
  );
}
