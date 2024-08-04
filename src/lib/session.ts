import { enc } from "crypto-js";
import { decrypt, encrypt } from "crypto-js/aes";

const secretKey = "sME7a1A6pw";

function mapToString(map: Map<string, string>) {
  return JSON.stringify(Array.from(map.entries()));
}

// If there's nothing in session storage
export function createRoom(newRoomId: string, userId: string) {
  if (!newRoomId || !userId)
    return console.error(
      "Insufficient data -- createRoomSessionStorage",
      newRoomId,
      userId
    );
  try {
    console.log("============== createRoomSessionStorage =============");
    // 1. Create new array and add room ID into it
    const idMap = new Map<string, string>([[newRoomId, userId]]);
    const string = mapToString(idMap);
    console.log("decryptedString", string);
    encryptAndWrite(string);
  } catch (error: unknown) {
    console.error("Error adding data to session storage", error);
  }
}

// createRoom("aaa-336-4e4", "123");

// If there's already key in session storage
export function updateRoom(
  encryptedString: string,
  newRoomId: string,
  userId: string
) {
  if (!encryptedString || !newRoomId || !userId)
    return console.error(
      "Insufficient data -- updateRoomSessionStorage",
      encryptedString,
      newRoomId,
      userId
    );
  const decryptedString = decrypt(encryptedString!, secretKey).toString(
    enc.Utf8
  );
  const idMap = new Map<string, string>(JSON.parse(decryptedString));
  idMap.set(newRoomId, userId);
  const string = mapToString(idMap);
  encryptAndWrite(string);
}

export function encryptAndWrite(decryptedString: string) {
  if (!decryptedString)
    console.error(
      "Insufficient data -- encryptAndWriteToSessionStorage",
      decryptedString
    );
  // 2. Convert set into string
  console.log("============== encryptAndWriteToSessionStorage =============");
  // const data = {
  //   idArray,
  // };
  // console.log("data", data);
  // const setString = JSON.stringify(data);
  // console.log("setString", setString);

  // 3. Encrypt converted string and convert to string again
  const encryptedString = encrypt(decryptedString, secretKey).toString();
  console.log("Encrypted string", encryptedString);

  // // 4. Store in session storage
  sessionStorage.setItem("v1/rooms", encryptedString);
  console.log("Added to session storage", encryptedString);
}

export function checkAccess(
  encryptedString: string,
  roomId: string,
  userId: string
) {
  if (!encryptedString || !roomId || !userId)
    return console.error(
      "Insufficient data -- checkRoomAccess",
      encryptedString,
      roomId,
      userId
    );
  const decryptedString = decrypt(encryptedString!, secretKey).toString(
    enc.Utf8
  );
  console.log("dec", decryptedString);
  const idMap = new Map<string, string>(JSON.parse(decryptedString));
  return idMap.has(roomId);
}

// checkAccess(
//   "U2FsdGVkX18QAQoO4miDRw/rndxUeZbRKVM2cA0d0GSpEpnlw2JGZscpukiAokXa",
//   "aaa-336-4e4",
//   "123"
// );
