export class CurrentUserDTO{
    constructor(user){
        this.name = user.firtName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.role = user.role;
    }
}