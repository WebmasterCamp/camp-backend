import app from '../app';
import fs from 'fs';
import https from 'https';

require('babel-polyfill');
const PORT = process.env.PORT || 8080;

const privateKey = fs.readFileSync('./https.js', 'utf8');
const certificate = fs.readFileSync('./https.js', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT - 1000);
