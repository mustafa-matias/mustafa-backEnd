export default class SessionsDao {

  forgotPasswordDao = async (user) => {
    await user.save();
    return user;
  };

  resetPasswordDao = async (user) => {
    await user.save();
    return user;
  };

  updateUserPremiumDao = async (user) => {
    user.save();
    return user;
  };
}
