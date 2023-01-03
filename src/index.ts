import * as dotenv from 'dotenv';
dotenv.config();

import app from './server';
import config from './config';

const PORT = 8007;

app.listen(config.port, () => {
    console.log(`server started on port ${config.port}`)
});