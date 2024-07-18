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
import LoginPinModal from "./rooms/LoginPinModal";
import CloseConfirmationModal from "./rooms/CloseConfirmationModal";
import Header from "./rooms/Header";

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const ws = useRef<WebSocket | null>(null);
  const [roomLocked, setRoomLocked] = useState<boolean>(false);
  const [closeConfirmAlertOpen, setCloseConfirmAlertOpen] =
    useState<boolean>(false);

  const { roomId } = useParams();

  useEffect(() => {
    ws.current = new WebSocket(`ws://localhost:8080/room/2b2-afc-42f`);
    ws.current.binaryType = "blob";

    ws.current.addEventListener("open", () => {
      console.log("Websocket connection opened");
    });

    ws.current.addEventListener("close", () => {
      console.log("Websocket connection closed");
    });

    ws.current.onmessage = (message: MessageEvent) => {
      if (message.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          setMessages((prevMessages) => [
            ...prevMessages,
            reader.result as string,
          ]);
        };
        reader.readAsText(message.data);
      } else {
        setMessages((prevMessages) => [...prevMessages, message.data]);
      }
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (ws.current) {
      ws.current.send(inputValue);
    }
    setInputValue("");
  };

  return (
    <div className="relative">
      <LoginPinModal open={roomLocked} setOpen={setRoomLocked} />
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
                message is sent. All messages are deleted when the chat ends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                id="messages"
                className="flex flex-col gap-4 overflow-y-scroll h-56"
              >
                {messages.map((message, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage
                        className="rounded-full"
                        src="/user-avatar-2.png"
                        alt="user-avatar"
                      />
                    </Avatar>
                    <div className="bg-blueviolet text-gray-500 rounded-lg">
                      {message}
                    </div>
                  </div>
                ))}
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
    </div>
  );
};

export default ChatRoom;
