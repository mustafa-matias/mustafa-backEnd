export default class SessionsDao {

  forgotPasswordDao = async (user) => {
    await user.save();
    return user;
  };

  resetPasswordDao = async (user) => {
    await user.save();
    return user;
  };
}
