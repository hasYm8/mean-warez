export enum Role {
    USER = 'USER',
    UPLOADER = 'UPLOADER',
    ADMIN = 'ADMIN'
}

export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    roles: Role[];
}

export interface SimplifiedUserDto {
    id: string;
    username: string;
}
