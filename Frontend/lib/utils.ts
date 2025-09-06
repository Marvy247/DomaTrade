import { ethers } from "ethers";

export const stringToBytes32 = (s: string) => {
  return ethers.encodeBytes32String(s);
};