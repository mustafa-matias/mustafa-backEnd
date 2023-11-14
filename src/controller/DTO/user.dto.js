export class CurrentUserDTO {
  constructor(user) {
    this._id = user._id;
    this.name = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
    this.premium = user.premium;
    this.last_connection = user.last_connection;
  }
}
