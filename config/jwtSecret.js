import { config } from "dotenv"

const jwtToken = {
  secretKey: process.env.JWT_TOKEN
};


export default jwtToken;