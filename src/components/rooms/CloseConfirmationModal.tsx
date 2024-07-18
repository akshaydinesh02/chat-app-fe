import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog";
import { Dispatch, SetStateAction } from "react";
import { AlertDialogFooter, AlertDialogHeader } from "../ui/alert-dialog";
import { Button } from "../ui/button";

interface ICloseConfirmationModal {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CloseConfirmationModal = (props: ICloseConfirmationModal) => {
  const { open, setOpen } = props;
  return (
    <div
      className={`${
        open ? "absolute" : "hidden"
      } top-1/2 right-1/2 z-20 border p-4 rounded-lg`}
    >
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="flex flex-col gap-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat data.
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

export default CloseConfirmationModal;
