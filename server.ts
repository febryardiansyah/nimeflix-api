import env from "./src/config/env";
import app from "./src/app";

app.listen(env.port, () => {
  console.log("listening on port", env.port);
});
