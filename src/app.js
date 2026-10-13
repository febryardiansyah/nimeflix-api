const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const router = require("./routes");
const notFound = require("./middlewares/notFound");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({ createParentPath: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome To Unofficial Otakudesu Rest Api",
    data: {
      created_by: "KaedeNoKi Team ♥️",
    },
  });
});

app.use("/api", router);
app.use("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "check our github for more info",
    data: {
      github: "https://github.com/Kaede-No-Ki/otakudesu-rest-api",
    },
  });
});

app.use(notFound);

module.exports = app;
