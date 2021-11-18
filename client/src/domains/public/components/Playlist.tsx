import { Input } from "@chakra-ui/input";
import { Box, Divider, Flex } from "@chakra-ui/layout";
import { WebsocketContext } from "domains/common/contexts";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { IVideo } from "../@types/video";
import { RoomContext } from "../contexts";
import { ADD_TO_PLAYLIST, REMOVE_FROM_PLAYLIST } from "../state/actions/room";
import PlaylistItem from "./PlaylistItem";

interface IProps {
    roomId: string;
    playlist: IVideo[];
}

export default function Playlist({ roomId, playlist }: IProps) {
    const { publicSocket } = useContext(WebsocketContext);
    const { dispatchPlaylist } = useContext(RoomContext);
    const [input, setInput] = useState("");
    const wrapperEl = useRef<HTMLDivElement | null>(null);

    function scrollHandler(e: React.WheelEvent) {
        if (!wrapperEl.current) {
            return;
        }
        const offsetLeft = wrapperEl.current.scrollLeft;
        wrapperEl.current.scrollTo({
            behavior: "smooth",
            left: e.deltaY >= 0 ? offsetLeft + 200 : offsetLeft - 200, // Negative number means user rolled up
        });
    }

    useEffect(() => {
        publicSocket.on("room:playlist:add", (video: IVideo) => {
            dispatchPlaylist({
                type: ADD_TO_PLAYLIST,
                video,
            });
        });
        publicSocket.on("room:playlist:remove", (videoId: string) => {
            dispatchPlaylist({
                type: REMOVE_FROM_PLAYLIST,
                id: videoId,
            });
        });
        return () => {
            publicSocket.off("room:playlist:add").off("room:playlist:remove");
        };
    }, [publicSocket, dispatchPlaylist]);

    function add(e: React.FormEvent) {
        e.preventDefault();
        let url: URL;
        try {
            url = new URL(input);
        } catch (e) {
            toast.error("Invalid URL.");
            return;
        }
        let videoId: string | null;
        if (url.hostname === "youtu.be") {
            const paths = url.pathname.slice(1).split("/");
            videoId = paths[0];
        } else {
            videoId = url.searchParams.get("v");
        }
        if (!videoId) {
            toast.error("Invalid URL.");
            return;
        }
        setInput("");
        dispatchPlaylist({
            type: ADD_TO_PLAYLIST,
            video: {
                id: uuidv4(),
                videoId,
            },
        });
        publicSocket.emit("room:playlist:add", { roomId, videoId });
    }

    return (
        <Flex flexDir="column" maxW="100rem">
            <Flex p="0.5rem" flexDir="column">
                <Box as="form" onSubmit={add}>
                    <Input
                        placeholder="Video URL"
                        w="35rem"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                    />
                </Box>
            </Flex>
            <Divider />
            <Flex
                overflowX="auto"
                h="10rem"
                align="center"
                onWheel={scrollHandler}
                ref={wrapperEl}
            >
                {playlist.map((video, i) => (
                    <PlaylistItem video={video} key={`${video.videoId}-${i}`} />
                ))}
            </Flex>
        </Flex>
    );
}
