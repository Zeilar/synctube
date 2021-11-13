import { Box, Flex, Grid } from "@chakra-ui/layout";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/modal";
import { Switch } from "@chakra-ui/switch";
import { IRoom } from "domains/common/@types/room";
import ChatMessage from "domains/common/components/ChatMessage";
import Tab from "domains/common/components/styles/tab";
import { useLocalStorage } from "domains/common/hooks";
import { useEffect, useState } from "react";
import * as Style from "./InfoModal.style";

interface IProps {
    isOpen: boolean;
    onClose(): void;
    room: IRoom;
}

type TabState = "details" | "messages" | "playlist";

export default function InfoModal({ isOpen, onClose, room }: IProps) {
    const [showServerMessagesDefault, setShowServerMessagesDefault] =
        useLocalStorage<boolean>("showServerMessages");
    const [openTab, setOpenTab] = useState<TabState>("details");
    const [showServerMessages, setShowServerMessages] = useState(
        showServerMessagesDefault ?? false
    );

    const messages = showServerMessages
        ? room.messages
        : room.messages.filter(message => !message.serverMessage);

    useEffect(() => {
        setShowServerMessagesDefault(showServerMessages);
    }, [showServerMessages, setShowServerMessagesDefault]);

    return (
        <Modal blockScrollOnMount isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Room info</ModalHeader>
                <ModalBody>
                    <Box pb="0.75rem">
                        <Grid
                            gridTemplateColumns="repeat(3, 1fr)"
                            mb="1rem"
                            borderBottom="1px solid"
                            borderColor="gray.100"
                        >
                            <Tab.Button
                                active={openTab === "details"}
                                onClick={() => setOpenTab("details")}
                            >
                                Details
                            </Tab.Button>
                            <Tab.Button
                                active={openTab === "messages"}
                                onClick={() => setOpenTab("messages")}
                            >
                                Messages
                            </Tab.Button>
                            <Tab.Button
                                active={openTab === "playlist"}
                                onClick={() => setOpenTab("playlist")}
                            >
                                Playlist
                            </Tab.Button>
                        </Grid>
                        <Flex
                            className="custom-scrollbar scrollbar-inset"
                            flexDir="column"
                            maxH="60vh"
                            overflowY="auto"
                        >
                            {openTab === "details" && (
                                <Grid gridGap="1rem">
                                    <Style.Detail label="id" value={room.id} />
                                    <Style.Detail
                                        label="name"
                                        value={room.name}
                                    />
                                    <Style.Detail
                                        label="created at"
                                        value={new Date(
                                            room.created_at
                                        ).toLocaleString()}
                                    />
                                </Grid>
                            )}
                            {openTab === "messages" && (
                                <>
                                    <Switch
                                        defaultChecked={showServerMessages}
                                        checked={showServerMessages}
                                        onChange={e =>
                                            setShowServerMessages(
                                                e.target.checked
                                            )
                                        }
                                    />
                                    {messages.map(message => (
                                        <ChatMessage
                                            message={message}
                                            key={message.id}
                                        />
                                    ))}
                                </>
                            )}
                            {openTab === "playlist" && "Playlist here"}
                        </Flex>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
