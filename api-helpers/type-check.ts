import { TType } from "@elijahjcobb/typr";
import { NextApiRequest } from "next";
import { APIError } from "./api-error";

export function verifyBody<T>(req: NextApiRequest, type: TType<T>): T {
  let b = req.body;
  if (typeof b === "string") b = JSON.parse(b);
  const body = type.verify(b);
  if (!body) throw new APIError(400, "Invalid request body.");
  return body;
}
