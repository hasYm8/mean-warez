import { SimplifiedUserDto } from "./User";

export interface CommentDto {
    user: SimplifiedUserDto;
    torrentId: string;
    text: string;
    date: Date;
}
