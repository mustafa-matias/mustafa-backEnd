export default class UsersDao {
  updateUserPremiumDao = async (user) => {
    user.save();
    return user;
  };
}
