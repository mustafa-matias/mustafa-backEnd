import userModel from "./models/users.model.js";
export default class SessionsDao {
  forgotPasswordDao = async (user) => {
    try {
      const result = await user.save();
      if (!result) {
        throw new Error("Error al guardar el usuario");
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  resetPasswordDao = async (user) => {
    try {
      const result = await user.save();
      if (!result) {
        throw new Error("Error al guardar el usuario");
      }
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  logoutDao = async (userId) => {
    try {
      const result = await userModel.findByIdAndUpdate(userId, {
        last_connection: new Date(),
      });
      if (!result) {
        throw new Error("No se puedo actualizar en la base de datos");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
}
