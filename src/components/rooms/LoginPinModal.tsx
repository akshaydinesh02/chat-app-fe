import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Dispatch, SetStateAction } from "react";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Button } from "../ui/button";

interface ILoginPinModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const LoginPinModal = (props: ILoginPinModal) => {
  const { open, setOpen } = props;
  return (
    <div
      className={`${
        open ? "absolute" : "hidden"
      } top-1/2 right-1/2 z-20 border p-4 rounded-lg`}
    >
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="flex flex-col justify-center items-center gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">
              Enter PIN to join the room
            </AlertDialogTitle>
            <AlertDialogDescription>
              <InputOTP maxLength={4}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={() => setOpen(false)}>
              Continue
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LoginPinModal;
