import { SimplifiedUserDto } from "./UserDto";

export interface CommentDto {
    user: SimplifiedUserDto;
    torrentId: string;
    text: string;
    date: Date;
}
