import { config as conf } from "dotenv";
conf();

const _config = {
  port: process.env.PORT,
  databaseUrl: process.env.MONGO_CONNECTION_STRING,
  env: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  cloudinaryCloud: process.env.ClOUDINARY_CLOUD,
  cloudinaryApiKey: process.env.ClOUDINARY_API_KEY,
  cloudinarySecret: process.env.ClOUDINARY_API_SECRET,
  frontentDomain: process.env.FRONTENT_DOMAIN,
};

export const config = _config; //read only
