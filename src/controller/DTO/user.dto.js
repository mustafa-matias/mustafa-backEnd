export class CurrentUserDTO {
  constructor(user) {
    this.name = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.role = user.role;
  }
}
