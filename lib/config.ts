import dotenv from 'dotenv';

dotenv.config();

export const Config = {
    databaseUrl: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/user',
    port: process.env.PORT ?? '5000',
    logLevel: process.env.LOG_LEVEL ?? 'info',
    jwtKey: process.env.JWT_KEY ?? 'REPLACE',
    publicKey: process.env.JWT_PUBLIC_KEY ?? 'REPLACE',
    /** How long it takes the JWT to expire */
    jwtExpiry: process.env.JWT_EXPIRY ?? 86400,
    env: process.env.NODE_ENV ?? 'development',
};
