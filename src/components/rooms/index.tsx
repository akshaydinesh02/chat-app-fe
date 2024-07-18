import { useParams } from "react-router-dom";

const RoomsPage = () => {
  const { roomId } = useParams();
  return <div>Welcome to rooms page - {roomId ?? "Invalid room"}</div>;
};

export default RoomsPage;
