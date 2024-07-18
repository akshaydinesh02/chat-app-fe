import { encrypt } from "crypto-js/aes";

export const encryptNumber = (number: number, secretKey: string) =>
  encrypt(number.toString(), secretKey).toString();
