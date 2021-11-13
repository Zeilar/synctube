import { Server } from "socket.io";
import { IRoomDto } from "../@types/room";
import { ISocketDto } from "../@types/socket";
import { Room } from "./Room";
import { adminNamespace, io } from "./server";
import { Socket } from "./Socket";

export class WS {
    public sockets: Map<string, Socket> = new Map();
    public rooms: Map<string, Room> = new Map();
    public io: Server;

    constructor() {
        this.io = io;
    }

    public getAllData() {
        const rooms: IRoomDto[] = [];
        const sockets: ISocketDto[] = [];
        this.rooms.forEach(room => {
            rooms.push(room.dto);
        });
        this.sockets.forEach(socket => {
            sockets.push(socket.dto);
        });
        return { rooms, sockets };
    }

    public addSocket(socket: Socket) {
        this.sockets.set(socket.id, socket);
        adminNamespace.emit("socket:connect", socket.dto);
    }

    public deleteSocket(socket: Socket) {
        this.sockets.delete(socket.id);
        adminNamespace.emit("socket:disconnect", socket.id);
    }

    public addRoom(room: Room) {
        this.rooms.set(room.id, room);
        adminNamespace.emit("room:new", room.dto);
    }

    public deleteRoom(room: Room) {
        this.io.to(room.id).emit("room:destroy");
        adminNamespace.emit("room:destroy", room.id);
        this.rooms.delete(room.id);
    }
}
