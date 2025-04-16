export class UserDto {
    constructor(user) {
        this.id = user._id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.isAdmin = user.isAdmin;
        this.roles = user.roles;
    }
}
