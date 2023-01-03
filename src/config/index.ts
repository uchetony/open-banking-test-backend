import prodConfig from "./prod";
import localConfig from "./local";

const stage = process.env.STAGE || "local";

const envConfig = stage === "production" ? prodConfig : localConfig;

export default {
    stage,
    env: process.env.NODE_ENV || "development",
    port: 8001,
    secrets: {
        jwt: process.env.JWT_SECRET,
        dbUrl: process.env.DATABASE_URL
    },
    ...envConfig
}