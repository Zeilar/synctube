import { IMessage } from "./message";

export type RoomPrivacy = "public" | "private";

export interface IRoomDetails {
    id: string;
    name: string;
    created_at: Date;
    leader: string | null;
    privacy: RoomPrivacy;
}

export interface IRoom extends IRoomDetails {
    sockets: string[];
    messages: IMessage[];
    playlist: string[];
}
