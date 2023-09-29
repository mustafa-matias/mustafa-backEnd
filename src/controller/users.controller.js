import UsersServive from "../servicio/users.service.js";

export default class UsersController {
  constructor() {
    this.usersService = new UsersServive();
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
    this.usersService = new UsersServive();
    return await this.usersService.updateUserPremiumService(userID);
  }
}
