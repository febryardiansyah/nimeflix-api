import { Response } from "express";

// Shared response helpers so every endpoint returns the same predictable
// envelope: { success, message, data }. This makes the API easy to
// consume from a frontend since callers can always rely on the same
// top-level shape regardless of which route they hit.

export const success = <T>(
  res: Response,
  data: T | null = null,
  message = "Success",
  statusCode = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const error = (
  res: Response,
  message = "Something went wrong",
  statusCode = 500
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};
