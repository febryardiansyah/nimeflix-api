import { Request, Response } from "express";
import * as response from "./response";

export const requestFailed = (
  _req: Request,
  res: Response,
  err: unknown
): void => {
  const message = (err as { message?: string } | null)?.message || "Request failed";
  response.error(res, message, 502);
};
