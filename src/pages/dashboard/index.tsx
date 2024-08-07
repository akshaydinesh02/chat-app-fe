import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { CreateRoomSchema } from "../../schema/Room";
import { JoinRoomSchema } from "../../schema/Room";
import { auth, supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/Auth";
import { createRoom, updateRoom } from "../../lib/session";

const DashboardPage = () => {
  const [mailIdError, setMailIdError] = useState<string>("");
  const [roomIdError, setRoomIdError] = useState<string>("");

  const [inviteeMailId, setInviteeMailId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const { user } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   const realTimeRooMetaData = supabase.channel("onlineRooms");
  //   realTimeRooMetaData.on("broadcast", { event: "cursor-pos" }, (payload) => {
  //     console.log("Pay load", payload);
  //   });

  //   const subscribeChannel = async () => {
  //     if (realTimeRooMetaData.state === "joined") return;
  //     await realTimeRooMetaData.subscribe();
  //     console.log("Subscribed");
  //   };
  //   subscribeChannel();

  //   return () => {
  //     realTimeRooMetaData.unsubscribe();
  //   };
  // }, []);

  const createRoomHandler = async () => {
    if (!user?.email) return;
    const emailSchema = CreateRoomSchema(user?.email);
    const dataParser = emailSchema.safeParse(inviteeMailId);

    console.log("Parser", dataParser);
    if (!dataParser.success) {
      setMailIdError(dataParser.error.errors[0].message);
    } else {
      setMailIdError("");

      try {
        const {
          data: { session },
        } = await auth.getSession();
        const response = await axios.post(
          "http://localhost:8080/api/v1/rooms",
          {
            invitee: inviteeMailId,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );
        console.log("Res", response);
        if (response.status === 201) {
          const newRoomId = response.data.data.room.id;
          const encryptedAccessData: string | null =
            sessionStorage.getItem("v1/rooms");
          if (encryptedAccessData && typeof encryptedAccessData === "string") {
            // If session storage data already exists
            updateRoom(encryptedAccessData, newRoomId, user.id);
          } else {
            // If session storage data does not exist
            createRoom(newRoomId, user.id);
          }
          navigate(`/rooms/${newRoomId}`);
        }
      } catch (error: unknown) {
        console.error("Error creating room : ", error);
      }
    }
  };

  const joinRoomHandler = async () => {
    const dataParser = JoinRoomSchema.safeParse(roomId);
    if (!dataParser.success) {
      setRoomIdError(dataParser.error.errors[0].message);
    } else {
      setRoomIdError("");

      try {
        const {
          data: { session },
        } = await auth.getSession();

        const response = await axios.patch(
          `http://localhost:8080/api/v1/rooms/${roomId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );
        console.log(response);
        if (response.status === 200) {
          navigate(`/rooms/${response.data.data.room.id}`);
        }
      } catch (error: unknown) {
        console.error("Error validating room", error);
      }
    }
  };

  const cards = [
    {
      onChange: () => setMailIdError(""),
      title: "Start a room",
      description:
        "Start a new room and invite any of your friend for a 1-on-1 chat!",
      label: { htmlFor: "mailID", text: "Invitee's Mail ID" },
      input: {
        id: "mailID",
        type: "text",
        placeholder: "Enter invitee's mail ID",
        value: inviteeMailId,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setInviteeMailId(e.target?.value),
        errorVariable: mailIdError,
      },
      button: {
        disabled: !!mailIdError,
        onClick: createRoomHandler,
        text: "Start",
      },
    },
    {
      onChange: () => setRoomIdError(""),
      title: "Join a room",
      description:
        "Enter the room ID, name, pin and click on join for a 1-on-1 chat!",
      label: {
        htmlFor: "roomId",
        text: "Room ID:",
      },
      input: {
        id: "roomId",
        type: "text",
        placeholder: "Enter room ID",
        value: roomId,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setRoomId(e.target?.value),
        errorVariable: mailIdError,
      },
      button: {
        disabled: !!roomIdError,
        onClick: joinRoomHandler,
        text: "Join",
      },
    },
  ];

  return (
    <main className="max-w-[80%] mx-auto">
      <section className="flex gap-2 w-[50%] mx-auto">
        {cards.map((card, _i) => (
          <Card
            key={_i}
            onChange={card.onChange}
            className="w-1/2 mx-auto bg-indigo-200"
          >
            <CardHeader>
              <CardTitle className="tracking-normal text-indigo-950 font-bold">
                {card.title}
              </CardTitle>
              <CardDescription className="text-indigo-900">
                {card.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              <Label htmlFor={card.label.htmlFor}>{card.label.text}</Label>
              <Input
                id={card.input.id}
                type={card.input.type}
                placeholder={card.input.placeholder}
                value={card.input.value}
                onChange={card.input.onChange}
                className={`border ${
                  card.input.errorVariable
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
              />
            </CardContent>
            <CardFooter className="flex flex-col">
              <p
                className={`text-xs font-semibold p-1 text-red-500 text-center italic ${
                  card.input.errorVariable ? "visible" : "invisible"
                }`}
              >
                {card.input.errorVariable || "unknown error"}
              </p>
              <Button
                disabled={card.button.disabled}
                onClick={card.button.onClick}
                className="w-full bg-indigo-400 text-black hover:bg-indigo-500 font-semibold"
              >
                {card.button.text}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </main>
  );
};

export default DashboardPage;
