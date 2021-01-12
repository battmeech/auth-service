import { app } from './app';
import { Config } from './config';
import { logger } from './logger';
import mongoose from 'mongoose';

logger.info('Establishing connection to database');
mongoose
    .connect(Config.databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        logger.info('Connected to MongoDB');
    })
    .catch((error) => {
        logger.error('Unable to connect to MongoDB');
        logger.debug(error.stack);
    });

app.listen(Config.port);
