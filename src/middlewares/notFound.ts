import { Request, Response } from "express";

export default (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message:
      "Not found path, read the docs here https://github.com/Kaede-No-Ki/otakudesu-rest-api",
    data: null,
  });
};
