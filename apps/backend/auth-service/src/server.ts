import app from "./app";
import config from "./config";

function runSever() {
  app.listen(config.port, () => {
    console.log("Auth's server is running ✅ on port:", config.port);
  });
}
runSever();
