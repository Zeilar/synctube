import { useEffect, useRef, useState } from "react";
import { Redirect, useParams } from "react-router";
import { ISocket } from "../../@types/socket";
import { socket } from "./App";
import ReactPlayer from "react-player";
import { PrimaryButton } from "./styles/button";
import { toast } from "react-toastify";
import { Box, Flex, Grid } from "@chakra-ui/layout";
import Chat from "./Chat";
import { validate } from "uuid";

interface IParams {
    roomId: string;
}

interface IProps {
    me: ISocket;
}

const defaultVideo = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // What video could this possibly be, I wonder

export default function Room({ me }: IProps) {
    const { roomId } = useParams<IParams>();
    const [sockets, setSockets] = useState<ISocket[]>([]);
    const [playlist, setPlaylist] = useState<string[]>([]);
    const [playlistInput, setPlaylistInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const player = useRef<ReactPlayer>(null);

    function addVideo() {
        const canPlay = ReactPlayer.canPlay(
            "https://www.youtube.com/watch?v=ig44rDYo8IM&list=PLfGn95Njqu_SDNqqJdVZi3jq6ILi_pWgt&index=5"
        );

        if (!canPlay) {
            return toast.warn("Invalid URL.");
        }
    }

    useEffect(() => {
        if (!validate(roomId)) {
            // No need to toast here, the redirect further down takes care of that, this is just to stop unnecessary code from running
            return;
        }

        socket.emit("room:join", roomId);
        socket.once("room:join", (sockets: ISocket[]) => {
            toast.success("Joined room.");
            setSockets(sockets);
            setIsConnected(true);
        });
        socket.on("room:socket:update", (sockets: ISocket[]) => {
            setSockets(sockets);
        });
        socket.on("room:socket:join", (socket: ISocket) => {
            setSockets((sockets) => [...sockets, socket]);
            toast.info(`${socket.username} joined.`);
        });
        socket.on("room:socket:leave", (socket: ISocket) => {
            setSockets((sockets) =>
                sockets.filter((element) => element.id !== socket.id)
            );
            toast.info(`${socket.username} left.`);
        });

        // Just to be safe
        return () => {
            socket.emit("room:leave", roomId);
            socket
                .off("room:join")
                .off("room:socket:leave")
                .off("room:socket:join");
            setSockets([]);
            setPlaylist([]);
            setPlaylistInput("");
        };
    }, [roomId]);

    useEffect(() => {
        return () => {
            if (isConnected) {
                toast.info("Left room.");
            }
        };
    }, [isConnected]);

    // TODO: use "light" prop for playlist thumbnails

    if (!validate(roomId)) {
        toast.error(
            "Invalid room id. Please click the button to generate one.",
            { toastId: "invalid:room:id" } // For some reason this toast fires twice, prevent this with id
        );
        return <Redirect to="/" />;
    }

    return (
        <Flex m="auto" w="100%" h="100%" p="5%">
            <PrimaryButton onClick={addVideo}>Add video</PrimaryButton>
            <Grid w="100%" gridTemplateColumns="75% 25%" gridGap="2rem">
                <Box w="100%">
                    <ReactPlayer
                        width="100%"
                        height="100%"
                        ref={player}
                        url={playlist[0] || defaultVideo}
                    />
                </Box>
                <Chat roomId={roomId} sockets={sockets} me={me} />
            </Grid>
        </Flex>
    );
}
