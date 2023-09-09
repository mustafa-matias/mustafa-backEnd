import SessionsServive from "../servicio/sessions.service.js";
import CustomError from "../servicio/error/customError.class.js";
import { ErrorEnum } from "../servicio/enum/error.enum.js";

export default class SessionsController {
  constructor() {
    this.sessionsService = new SessionsServive();
  }

  async forgotPasswordController(email) {
    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (!emailRegex.test(email)) {
        throw CustomError.createError({
          name: "E-mail incorrecto",
          cause: `Ivalid e-mail: ${email}`,
          message: "cannot get user",
          code: ErrorEnum.INVALID_TYPES_ERROR,
        });
    }
    return await this.sessionsService.forgotPasswordService(email);
  }

  async resetPasswordController(token, password, confirmPassword){
    return await this.sessionsService.resetPasswordServive(token, password, confirmPassword);
  }

  async updateUserPremiumController(userID) {
    if (userID.length != 24) {
        throw CustomError.createError({
          name: "incomplete id ",
          cause: `Ivalid id: ${pid}`,
          message: "cannot delete product",
          code: ErrorEnum.PARAM_ERROR,
        });
    }
    return await this.sessionsService.updateUserPremiumService(userID);
  }
}
