import { createContext, ReactNode, useReducer, useState } from "react";
import { useLocalStorage } from "domains/common/hooks";
import { IVideo } from "../@types/video";
import {
    activeVideoReducer,
    playlistReducer,
    socketsReducer,
} from "../state/reducers/room";
import { ISocket } from "domains/common/@types/socket";
import { IRoomDetails } from "domains/common/@types/room";

interface IContext {
    showServerMessages: boolean;
    setShowServerMessages: React.Dispatch<React.SetStateAction<boolean>>;
    playlist: IVideo[];
    dispatchPlaylist: React.Dispatch<any>;
    sockets: ISocket[];
    dispatchSockets: React.Dispatch<any>;
    activeVideo: number;
    dispatchActiveVideo: React.Dispatch<any>;
    isPLaylistItemActive(id: string): boolean;
    getIndexOfPlaylistItem(id: string): number;
    room: IRoomDetails | null;
    setRoom: React.Dispatch<React.SetStateAction<IRoomDetails>>;
}

interface IProps {
    children: ReactNode;
}

export const RoomContext = createContext({} as IContext);

export function RoomContextProvider({ children }: IProps) {
    const [showServerMessages, setShowServerMessages] = useLocalStorage(
        "showServerMessages:chat",
        true
    );
    const [activeVideo, dispatchActiveVideo] = useReducer(
        activeVideoReducer,
        0
    );
    const [playlist, dispatchPlaylist] = useReducer(playlistReducer, []);
    const [sockets, dispatchSockets] = useReducer(socketsReducer, []);
    const [room, setRoom] = useState<IRoomDetails>({} as IRoomDetails);

    function getIndexOfPlaylistItem(id: string) {
        return playlist.findIndex(video => video.id === id);
    }

    function isPLaylistItemActive(id: string) {
        return getIndexOfPlaylistItem(id) === activeVideo;
    }

    const values: IContext = {
        showServerMessages,
        setShowServerMessages,
        playlist,
        dispatchPlaylist,
        sockets,
        dispatchSockets,
        activeVideo,
        dispatchActiveVideo,
        isPLaylistItemActive,
        getIndexOfPlaylistItem,
        room,
        setRoom,
    };

    return (
        <RoomContext.Provider value={values}>{children}</RoomContext.Provider>
    );
}
