export class UserDto {
    constructor(user) {
        this.id = user._id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.email = user.email;
        this.roles = user.roles;
    }
}

export class SimplifiedUserDto {
    constructor(user) {
        this.id = user._id;
        this.username = user.username;
    }
}
