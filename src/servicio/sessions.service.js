import SessionsDao from "../persistencia/mongoDb/sessions.dao.js";
import userModel from "../persistencia/mongoDb/models/users.model.js";
import { generateRandomCode } from "../../utils.js";
import Mail from "../helpers/mail.js";
import config from "../config/config.js";
export default class SessionsService {
  constructor() {
    this.sessionDao = new SessionsDao();
  }

  async forgotPasswordService(email) {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error("E-mail inexistente");
      }
      const token = generateRandomCode(25);
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 1);

      user.resetPasswordToken = token;
      user.resetPasswordExpires = expirationDate;

      const mailer = new Mail();
      const resetUrl = `${config.domain}/sessions/resetPassword/${token}`;

      mailer.send(user, "Restablecer Contraseña", resetUrl);

      await this.sessionDao.forgotPasswordDao(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async resetPasswordServive(token, password, confirmPassword) {
    try {
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      const user = await userModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() },
      });
      if (!user) {
        throw new Error("Usuario no encontrado y/o caduco el token");
      }
      const isNotValidPassword = isValidPassword(password, user);
      if (isNotValidPassword) {
        throw new Error("La contraseña no puede ser identica a la anterior");
      }
      user.password = createHash(password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await this.sessionDao.resetPasswordDao(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async logoutService(userId) {
    await this.sessionDao.logoutDao(userId);
  }
}
