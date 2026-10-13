import "dotenv/config";

export interface Env {
  port: number | string;
}

const env: Env = {
  port: process.env.PORT || 3000,
};

export default env;
