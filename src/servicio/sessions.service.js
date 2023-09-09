import SessionsDao from "../persistencia/mongoDb/sessions.dao.js";
import userModel from "../persistencia/mongoDb/models/users.model.js";
import { generateRandomCode } from "../../utils.js";
import Mail from "../helpers/mail.js";
import CustomError from "./error/customError.class.js";
import { ErrorEnum } from "./enum/error.enum.js";
import { isValidPassword, createHash } from "../../utils.js";

export default class SessionsService {
  constructor() {
    this.sessionDao = new SessionsDao();
  }

  async forgotPasswordService(email) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw CustomError.createError({
        name: "usuario no existente ",
        cause: `Ivalid email: ${email}`,
        message: "cannot get user",
        code: ErrorEnum.PARAM_ERROR,
      });
    }
    const token = generateRandomCode(25);
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expirationDate;

    const mailer = new Mail();
    const resetUrl = `http://localhost:8080/api/sessions/resetPassword/${token}`;

    mailer.send(user, "Restablecer Contraseña", resetUrl);

    await this.sessionDao.forgotPasswordDao(user);
  }

  async resetPasswordServive(token, password, confirmPassword) {
    if (password !== confirmPassword) {
      throw CustomError.createError({
        name: "Las password no coinciden",
        cause: `Ivalid password`,
        message: "cannot put password",
        code: ErrorEnum.DATABASE_ERROR,
      });
    }
    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) {
      throw CustomError.createError({
        name: "Link incorrecto o caduco",
        cause: `Link incorrecto o caduco`,
        message: "cannot put password",
        code: ErrorEnum.DATABASE_ERROR,
      });
    }
    const isNotValidPassword = isValidPassword(password, user);
    if (isNotValidPassword) {
      throw CustomError.createError({
        name: "Password error",
        cause: `La password no puede ser igual a la anterior`,
        message: "cannot put password",
        code: ErrorEnum.DATABASE_ERROR,
      });
    }

    user.password = createHash(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await this.sessionDao.resetPasswordDao(user);
  }

  async updateUserPremiumService(userID) {
    try {
      const user = await userModel.findOne({ _id: userID });
      if (!user) {
        throw CustomError.createError({
          name: "usuario no existente ",
          cause: `Ivalid id: ${userID}`,
          message: "cannot get user",
          code: ErrorEnum.PARAM_ERROR,
        });
      }
      if (user.premium === false) {
        user.premium = true;
        return await this.sessionDao.updateUserPremiumDao(user);
      }
      if (user.premium) {
        user.premium = false;
        return await this.sessionDao.updateUserPremiumDao(user);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
