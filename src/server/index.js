import path from 'path';
import express from 'express';
import config from './config';


// utils
const rootPath = process.cwd();


// app
const app = express();


// routes
app.use(express.static(path.resolve(rootPath, 'public')));

app.get('/', (_, res) => {
    res.setHeader('content-type', 'text/html');
    res.sendFile(path.resolve(rootPath, 'public/index.html'));
});


app.listen(config.PORT, () => {
    console.log(`Server is listening on port ${config.PORT}`);
});