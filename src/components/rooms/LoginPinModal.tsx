import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Dispatch, SetStateAction, useState } from "react";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import axios from "axios";
import { auth } from "../../lib/supabaseClient";
import { encryptNumber } from "../../utils";

interface ILoginPinModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  roomId: string;
}

const LoginPinModal = (props: ILoginPinModal) => {
  const { open, setOpen, roomId } = props;
  const secretKey = "sME7a1A6pw";

  const [pin, setPin] = useState("");

  const onPinSubmit = async () => {
    if (!roomId || pin.length != 4) return;
    try {
      const {
        data: { session },
      } = await auth.getSession();

      const result = await axios.patch(
        `http://localhost:8080/api/v1/rooms/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            pin: encryptNumber(Number(pin), secretKey),
          },
        }
      );
      console.log(result);
      if (result.status === 200) {
        setOpen(false);
      }
    } catch (error: unknown) {
      console.error("Error validating room", error);
    }
  };
  return (
    <div
      className={`${
        open ? "absolute" : "hidden"
      } top-1/2 right-1/2 z-20 border p-4 rounded-lg`}
    >
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="flex flex-col justify-center items-center gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">PIN</AlertDialogTitle>
            <AlertDialogDescription>
              Enter PIN to join the chat room
            </AlertDialogDescription>
            <AlertDialogContent>
              <InputOTP
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e)}
                pattern={REGEXP_ONLY_DIGITS}
                datatype="number"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </AlertDialogContent>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={onPinSubmit}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LoginPinModal;
