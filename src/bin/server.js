import http from 'http';

import app from '../app';
import { Queue } from '../models';

require('babel-polyfill');
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = require('socket.io')(server);

const sendCurrentQueue = () => (
  Promise.all([
    Queue.findOne({ major: 'design' }),
    Queue.findOne({ major: 'programming' }),
    Queue.findOne({ major: 'marketing' }),
    Queue.findOne({ major: 'content' })
  ])
  .then(([design, programming, marketing, content]) => (
    io.emit('queue', {
      design: design.order,
      programming: programming.order,
      marketing: marketing.order,
      content: content.order
    })
  ))
);

io.on('connection', sendCurrentQueue);

server.on('request', req => {
  req.ioSendQueue = sendCurrentQueue;
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
