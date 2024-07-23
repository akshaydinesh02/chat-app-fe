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
import { useCallback, useState } from "react";
import axios from "axios";
import { createEmailComparisonSchema } from "../../schema/Start";
import { roomIdSchema } from "../../schema/Login";
import { Provider } from "@supabase/supabase-js";
import { auth } from "../../lib/supabaseClient";
import { useAuth } from "../../hooks/Auth";

const Cards = () => {
  const [mailIdError, setMailIdError] = useState<string>("");
  const [roomIdError, setRoomIdError] = useState<string>("");

  const [inviteeMailId, setInviteeMailId] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const createRoom = async () => {
    if (!user?.email) return;
    const emailSchema = createEmailComparisonSchema(user?.email);
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
          navigate(`/rooms/${response.data.data.room.id}`);
        }
      } catch (error: unknown) {
        console.error("Error creating room : ", error);
      }
    }
  };

  const loginToRoom = async () => {
    const dataParser = roomIdSchema.safeParse(roomId);
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

  const onOAuthClick = useCallback(async (provider: Provider) => {
    const res = await auth.signInWithOAuth({
      provider: provider,
    });
    console.log("res", res);
  }, []);

  return (
    <div className="p-14">
      <h1 className="bg-green-500 text-center text-2xl">Private chat rooms</h1>
      <Button onClick={() => onOAuthClick("google")}>Login</Button>
      <Button>Logout</Button>
      <div className="flex gap-2 m-auto max-w-3xl">
        <Card onChange={() => setMailIdError("")} className="w-1/2 mx-auto">
          <CardHeader>
            <CardTitle className="tracking-normal">Start a room</CardTitle>
            <CardDescription>
              Start a new room and invite any of your friend for a 1-on-1 chat!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="mailID">Invitee's Mail ID:</Label>
              <Input
                id="mailID"
                type="text"
                placeholder="Enter invitee's mail ID here"
                value={inviteeMailId}
                onChange={(e) => setInviteeMailId(e.target.value)}
                className={`border ${
                  mailIdError ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <p
              className={`text-xs font-semibold p-1 text-red-500 text-center italic ${
                mailIdError ? "visible" : "invisible"
              }`}
            >
              {mailIdError || "lorem ipsum"}
            </p>
            <Button
              disabled={!!mailIdError}
              onClick={createRoom}
              className="w-full"
            >
              Start
            </Button>
          </CardFooter>
        </Card>

        <Card onChange={() => setRoomIdError("")} className="w-1/2 mx-auto">
          <CardHeader>
            <CardTitle className="tracking-normal">Join a room</CardTitle>
            <CardDescription>
              Enter the room ID, name, pin and click on join for a 1-on-1 chat!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="roomId">Room ID:</Label>
              <Input
                id="roomId"
                type="text"
                placeholder="Enter room ID here"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className={`border ${
                  roomIdError ? " border-red-500" : "border-gray-200"
                }`}
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col">
            <p
              className={`text-xs font-semibold p-1 text-red-500 text-center italic ${
                roomIdError ? "visible" : "invisible"
              }`}
            >
              {roomIdError || "lorem ipsum"}
            </p>
            <Button
              disabled={!!roomIdError}
              onClick={loginToRoom}
              className="w-full"
            >
              Join
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Cards;
