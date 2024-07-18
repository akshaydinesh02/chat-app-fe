import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";

const Header = ({ id }: { id: string }) => {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>Room details:</AlertTitle>
      <AlertDescription>
        Room ID - <strong>{id}</strong>
      </AlertDescription>
    </Alert>
  );
};

export default Header;
