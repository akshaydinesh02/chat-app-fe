import React, { useState, useEffect, useRef, FormEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import CloseConfirmationModal from "./rooms/CloseConfirmationModal";
import Header from "./rooms/Header";
import axios from "axios";
import { auth } from "../lib/supabaseClient";
import { useAuth } from "../hooks/Auth";
import { createRoom } from "../lib/session";
import { useNavigate } from "react-router-dom";

const ChatRoom: React.FC = () => {
  const [messageData, setMessageData] = useState<
    {
      date: number;
      id: string;
      text: string;
      type: string;
      image: string;
      name: string;
      time: string;
    }[]
  >([
    // {
    //   date: 0,
    //   id: "",
    //   text: "",
    //   type: "",
    // },
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);
  const [roomLocked, setRoomLocked] = useState<boolean>(true);
  const [closeConfirmAlertOpen, setCloseConfirmAlertOpen] =
    useState<boolean>(false);
  const [roomDataLoading, setRoomDataLoading] = useState(true);
  const [roomExists, setRoomExists] = useState(true);

  const { roomId } = useParams();
  const secretKey = "sME7a1A6pw";
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const checkAccessAPI = async (roomId: string, userId: string) => {
    const {
      data: { session },
    } = await auth.getSession();
    console.log("CALLING GET API");
    const result = await axios.get(
      `http://localhost:8080/api/v1/rooms/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      }
    );
    if (result.status === 200) {
      setRoomExists(true);
      setRoomLocked(false);
      createRoom(roomId, userId);
    }
  };

  useEffect(() => {
    // async function validateRoomAccess() {
    //   if (!user) navigate("/");
    //   console.log("validateRoomAccess", roomId, user);
    //   try {
    //     if (!roomId || !user?.id) return;

    //     const encryptedAccessData: string | null =
    //       sessionStorage.getItem("v1/rooms");
    //     if (encryptedAccessData) {
    //       console.log("Entering if block");
    //       const access = checkAccess(encryptedAccessData, roomId, user.id);

    //       if (access) {
    //         setRoomLocked(false);
    //       } else {
    //         checkAccessAPI(roomId, user.id);
    //       }
    //     } else {
    //       console.log("Entering else block");
    //       // API calling here
    //       checkAccessAPI(roomId, user.id);
    //     }
    //   } catch (error: unknown) {
    //     console.error("Error validating room", error);
    //   } finally {
    //     setRoomDataLoading(false);
    //   }
    // }
    // validateRoomAccess();

    if (!roomId || !user?.id) return;
    checkAccessAPI(roomId, user.id);
  }, [roomId, user]);

  useEffect(() => {
    if (
      roomDataLoading ||
      // (!roomDataLoading && !roomExists) ||
      // (!roomDataLoading && roomExists && roomLocked) ||
      !user
    )
      return;

    const url = `ws://localhost:8080/rooms/${roomId}?id=${
      user.id
    }&email=${encodeURIComponent(user.email!)}&name=${encodeURIComponent(
      user.user_metadata.name!
    )}`;
    ws.current = new WebSocket(url);
    ws.current.binaryType = "blob";

    ws.current.addEventListener("open", () => {
      console.log("Websocket connection opened");
    });

    ws.current.addEventListener("close", () => {
      console.log("Websocket connection closed");
    });

    ws.current.onmessage = async (response: MessageEvent) => {
      if (response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const data = JSON.parse(reader.result as string);
          setMessageData((prevMessageData) => [...prevMessageData, data]);
        };
        reader.readAsText(response.data);
      } else {
        setMessageData((prevMessageData) => [
          ...prevMessageData,
          response.data,
        ]);
      }
    };

    return () => {
      const userData = {
        id: user.id,
        name: user.user_metadata.name,
        email: user.email,
      };
      ws.current?.close(1000, JSON.stringify(userData));
    };
  }, [roomLocked, roomExists]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (ws.current) {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const data = {
        date: now,
        id: user?.id,
        text: inputValue,
        type: "message",
        image: user?.user_metadata?.picture || user?.user_metadata?.avatar_url,
        name: user?.user_metadata?.name,
        time: formattedTime,
      };
      console.log(user);
      ws.current.send(JSON.stringify(data));
    }
    setInputValue("");
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [messageData]);

  if (roomDataLoading) {
    return <div>Loading...</div>;
  }
  if (!roomId || !roomExists) {
    return <div>NO ROOM ID</div>;
  }

  return (
    <div className="relative">
      {roomLocked ? (
        <div className="text-black">LOCKED</div>
      ) : (
        // <LoginPinModal
        //   open={roomLocked}
        //   setOpen={setRoomLocked}
        //   roomId={roomId}
        // />
        <>
          <CloseConfirmationModal
            open={closeConfirmAlertOpen}
            setOpen={setCloseConfirmAlertOpen}
          />

          <div
            className={`p-24 w-1/2 mx-auto flex flex-col gap-6 ${
              closeConfirmAlertOpen || roomLocked ? "blur" : ""
            }`}
          >
            <Header id={roomId ?? "undefined"} />
            <Card className="p-4">
              <div className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-blueviolet text-2xl">
                    Messages:
                  </CardTitle>
                  <CardDescription>
                    All messages can only be seen by people in the chat when the
                    message is sent. All messages are deleted when the chat
                    ends.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    id="messages"
                    className="flex flex-col gap-4 overflow-y-scroll h-56 p-4 overflow-x-hidden"
                  >
                    {messageData.map((message, index) => (
                      <div
                        key={index}
                        className={`flex gap-2 items-end justify-start ${
                          message.id === user?.id
                            ? ""
                            : "justify-start flex-row-reverse"
                        }`}
                      >
                        <Avatar className="h-12 w-12 rounded-full">
                          <AvatarImage
                            className="rounded-full"
                            src={message.image ?? "/user-avatar-2.png"}
                            alt={`${message.name}-avatar`}
                          />
                        </Avatar>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">
                              {message.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {message.time}
                            </span>
                          </div>
                          <div className="bg-blue-500 text-white p-2 rounded-lg mt-1 max-w-xs">
                            {message.text}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <form
                  id="msgForm"
                  className="flex mt-4 gap-2"
                  onSubmit={handleSubmit}
                >
                  <Input
                    type="text"
                    placeholder="Send message"
                    id="inputBox"
                    value={inputValue}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setInputValue(e.target.value)
                    }
                  />
                  <Button type="submit">Send</Button>
                </form>
              </div>
            </Card>

            <Button
              variant="destructive"
              onClick={() => setCloseConfirmAlertOpen(true)}
            >
              End Chat
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatRoom;
