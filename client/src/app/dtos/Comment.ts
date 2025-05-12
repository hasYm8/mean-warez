import { SimplifiedUserDto } from "./User";

export interface CommentDto {
    id: string;
    user: SimplifiedUserDto;
    torrentId: string;
    text: string;
    date: Date;
}
