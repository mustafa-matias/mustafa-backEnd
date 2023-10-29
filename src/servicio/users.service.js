import UsersDao from "../persistencia/mongoDb/users.dao.js";
import userModel from "../persistencia/mongoDb/models/users.model.js";

export default class UsersService {
  constructor() {
    this.usersDao = new UsersDao();
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
      if ((user.documents.length = 3)) {
        if (user.premium === false) {
          user.premium = true;
          return await this.usersDao.updateUserPremiumDao(user);
        }
      }
      if (user.premium && user.role != 'admin') {
        user.premium = false;
        return await this.usersDao.updateUserPremiumDao(user);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}
