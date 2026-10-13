import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";
import notFound from "./middlewares/notFound";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome To Unofficial Otakudesu Rest Api",
    data: {
      created_by: "KaedeNoKi Team ♥️",
    },
  });
});

app.use("/api", router);
app.use("/api", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "check our github for more info",
    data: {
      github: "https://github.com/Kaede-No-Ki/otakudesu-rest-api",
    },
  });
});

app.use(notFound);

export default app;
