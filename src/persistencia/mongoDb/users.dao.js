import userModel from "./models/users.model.js";
import mongoose from "mongoose";

export default class UsersDao {

  updateUserPremiumDao = async (user) => {
    try {
      const result = await user.save();
      return result;
    } catch (error) {
      throw new Error(
        "Error al guardar en base de datos"
      );
    }
  };

  updateAdminUserPremiumDao = async (user) => {
    try {
      const result = await user.save();
      return result;
    } catch (error) {
      throw new Error(
        "Error al guardar en base de datos"
      );
    }
  };


  deleteUsersById = async (id) => {
  try {
    const result = await userModel.findByIdAndRemove(id);
    return result;
  } catch (error) {
    throw new Error(
      "Error al eliminar en base de datos"
    );
  }
};


  documentsDao = async (req, user) => {
    try {
      const result = await user.save();
      req.session.user.documents = user.documents;
      return result
    } catch (error) {
      throw new Error(
        "Error al guardar en base de datos"
      );
    }
  };
}
