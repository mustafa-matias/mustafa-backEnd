import UsersServive from "../servicio/users.service.js";
import mongoose from "mongoose";
import userModel from "../persistencia/mongoDb/models/users.model.js";

export default class UsersController {
  constructor() {
    this.usersService = new UsersServive();
  }

  async updateUserPremiumController(req) {
    const userID = req.params.id;
    try {
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        throw new Error(
          "Id usuario invalido"
        );
      }
      return await this.usersService.updateUserPremiumService(req, userID);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateAdminUserPremiumController(req) {
    const userID = req.params.id;
    try {
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        throw new Error(
          "Id usuario invalido"
        );
      }
      return await this.usersService.updateAdminUserPremiumService(req, userID);
    } catch (error) {
      throw new Error(error.message);
    }
  }


  async getUsersController() {
      return await this.usersService.getUsersService();
  }

  async deleteUsersController() {
      return await this.usersService.deleteUsersService();
  }

  async deleteUserController(req){
    const userID = req.params.id;
    try {
      if (!mongoose.Types.ObjectId.isValid(userID)) {
        throw new Error(
          "Id usuario invalido"
        );
      }
      return await this.usersService.deleteUserService(userID);
    } catch (error) {
      throw new Error(error.message);
    }
  }


  async documentsController(req) {
    const files = req.files;
    const userId = req.params.uid;
    try{
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error(
        "Id usuario invalido"
      );}
      if (!files) {
        throw new Error(
          "No han cargdado los documentos"
        );}
    const user = await userModel.findById(userId);
      if (!user) {
        throw new Error(
          "No se ha encontrado usuario"
        );}
      return await this.usersService.documentsService(req, files, user);
    } catch (error) {
      throw error;
    }
  }
}
