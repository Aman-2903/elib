import { config } from "./src/config/config";
import app from "./src/app";

console.log(config.port);

const startServer = () => {
  const port = config.port || 4000;

  app.listen(port, () => {
    console.log(`Listening on PORT : ${port}`);
  });
};

startServer();
