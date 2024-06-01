import { config } from "./src/config/config";
import app from "./src/app";
import connectDB from "./src/config/db";

console.log(config.port);

const startServer = async () => {
  //connect database
  await connectDB();

  const port = config.port || 4000;

  app.listen(port, () => {
    console.log(`Listening on PORT : ${port}`);
  });
};

startServer();
