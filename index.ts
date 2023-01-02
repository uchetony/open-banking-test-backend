import * as dotenv from 'dotenv';
dotenv.config();

import app from './src/server';

const PORT = 8007;

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
});