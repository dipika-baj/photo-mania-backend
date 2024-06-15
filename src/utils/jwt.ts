import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./env";

export async function getToken(id: number) {
  const token = jwt.sign(
    {
      id: id,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return token;
}
