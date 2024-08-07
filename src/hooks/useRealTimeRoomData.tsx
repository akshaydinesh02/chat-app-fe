import { useEffect, useRef, useState } from "react";
import { useAuth } from "./Auth";

export const useRealTimeRoomData = () => {
  const user = useAuth().user;
  const realTimeRoomMetaData = useRef<WebSocket | null>(null);
  const [currentRoomCount, setCurrentRoomCount] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const url = "ws://localhost:8080/api/v1/rooms/metadata";
    realTimeRoomMetaData.current = new WebSocket(url);
    realTimeRoomMetaData.current.binaryType = "blob";

    realTimeRoomMetaData.current.addEventListener("open", () => {
      console.log("metadata - Websocket connection opened");
    });

    realTimeRoomMetaData.current.addEventListener("close", () => {
      console.log("metadata - Websocket connection closed");
    });

    realTimeRoomMetaData.current.onmessage = async (response: MessageEvent) => {
      if (response.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const data = JSON.parse(reader.result as string);
          setCurrentRoomCount(Number(data));
        };
        reader.readAsText(response.data);
      } else {
        setCurrentRoomCount(Number(response.data));
      }
    };

    return () => {
      realTimeRoomMetaData.current?.close();
    };
  }, [user]);

  return currentRoomCount;
};
