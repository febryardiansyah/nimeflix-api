const env = require("./src/config/env");
const app = require("./src/app");

app.listen(env.port, () => {
  console.log("listening on port", env.port);
});
