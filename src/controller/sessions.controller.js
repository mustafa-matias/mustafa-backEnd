import SessionsServive from "../servicio/sessions.service.js";
import mongoose from "mongoose";

export default class SessionsController {
  constructor() {
    this.sessionsService = new SessionsServive();
  }

  async forgotPasswordController(email) {
    try {
      const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
      if (!emailRegex.test(email)) {
        throw new Error("Formato de e-mail ingresado invalido");
      }
      return await this.sessionsService.forgotPasswordService(email);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async resetPasswordController(token, password, confirmPassword) {
    try {
      if (!token) {
        throw new Error("No se cargo el token");
      }
      if (!password || !confirmPassword) {
        throw new Error("Error al cargar las contraseñas");
      }
      return await this.sessionsService.resetPasswordServive(
        token,
        password,
        confirmPassword
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async logoutController(userId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Id usuario invalido");
      }
      return await this.sessionsService.logoutService(userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
