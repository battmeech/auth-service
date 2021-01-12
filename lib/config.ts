import dotenv from 'dotenv';

dotenv.config();

export const Config = {
    databaseUrl: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/user',
    port: process.env.PORT ?? '3000',
    logLevel: process.env.LOG_LEVEL ?? 'info',
    jwtKey: process.env.JWT_KEY!,
    env: process.env.NODE_ENV ?? 'development',
};
