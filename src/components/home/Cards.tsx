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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { registerSchema } from "../../schema/Register";
import { loginSchema } from "../../schema/Login";
import { encryptNumber } from "../../utils/index";

const Cards = () => {
  const secretKey = "sME7a1A6pw";
  const navigate = useNavigate();

  const [registerErrorMessage, setRegisterErrorMessage] = useState<string>("");
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>("");

  const [registerData, setRegisterData] = useState({
    name: "",
    pin: "",
    confirmPin: "",
  });

  const [loginData, setLoginData] = useState({
    roomId: "",
    name: "",
    pin: "",
  });

  const createRoom = async () => {
    const dataParser = registerSchema.safeParse(registerData);
    if (!dataParser.success) {
      setRegisterErrorMessage(dataParser.error.errors[0].message);
    } else {
      setRegisterErrorMessage("");
      try {
        const response = await axios.post(
          "http://localhost:8080/createRoom",
          {},
          {
            headers: {
              name: registerData.name,
              pin: encryptNumber(Number(registerData.pin), secretKey),
            },
          }
        );
        if (response.status === 200) {
          navigate(`/rooms/${response.data.id}`);
        }
      } catch (error: unknown) {
        console.error("Error creating room : ", error);
      }
    }
  };

  const loginToRoom = async () => {
    const dataParser = loginSchema.safeParse(loginData);
    if (!dataParser.success) {
      setLoginErrorMessage(dataParser.error.errors[0].message);
    } else {
      setLoginErrorMessage("");
    }
  };

  return (
    <div className="p-14">
      <h1 className="bg-green-500 text-center text-2xl">Private chat rooms</h1>
      <p>Choose an option</p>
      <div className="flex gap-2 max-w-2xl m-auto">
        <Card
          onChange={() => setRegisterErrorMessage("")}
          className={`w-1/2 ${
            registerErrorMessage ? "border border-red-500" : ""
          }`}
        >
          <CardHeader>
            <CardTitle>Start a room</CardTitle>
            <CardDescription>
              Start a new room and invite any of your friend for a 1-on-1 chat!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <Label htmlFor="inviterName">Name:</Label>
              <Input
                id="inviterName"
                type="text"
                placeholder="Enter your name here"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <Label htmlFor="inviterPin">PIN:</Label>
              <InputOTP
                id="inviterPin"
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                datatype="number"
                value={registerData.pin}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    pin: e,
                  }))
                }
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div>
              <Label htmlFor="inviterConfirmPin">Confirm PIN:</Label>
              <InputOTP
                id="inviterConfirmPin"
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                datatype="number"
                value={registerData.confirmPin}
                onChange={(e) =>
                  setRegisterData((prev) => ({
                    ...prev,
                    confirmPin: e,
                  }))
                }
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={createRoom} className="w-full">
              Start
            </Button>
          </CardFooter>
          <p className="text-xs font-semibold p-1 text-red-500 text-center italic">
            {registerErrorMessage}
          </p>
        </Card>

        <Card
          onChange={() => setLoginErrorMessage("")}
          className={`w-1/2 ${
            loginErrorMessage ? "border border-red-500" : ""
          }`}
        >
          <CardHeader>
            <CardTitle>Join a room</CardTitle>
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
                value={loginData.roomId}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    roomId: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="inviteeName">Name:</Label>
              <Input
                id="inviteeName"
                type="text"
                placeholder="Enter your name here"
                value={loginData.name}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="inviteePin">PIN:</Label>
              <InputOTP
                id="inviteePin"
                maxLength={4}
                pattern={REGEXP_ONLY_DIGITS}
                value={loginData.pin}
                onChange={(e) =>
                  setLoginData((prev) => ({
                    ...prev,
                    pin: e,
                  }))
                }
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={loginToRoom} className="w-full">
              Join
            </Button>
          </CardFooter>
          <p className="text-xs font-semibold p-1 text-red-500 text-center italic">
            {loginErrorMessage}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Cards;
