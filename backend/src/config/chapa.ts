import { Chapa } from "chapa-nodejs";

export const chapaConfig = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY as string,
});
