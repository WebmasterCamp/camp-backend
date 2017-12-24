import http from 'http';

import app from '../app';
import { Queue, Score } from '../models';

require('babel-polyfill');
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
const io = require('socket.io')(server);

// const sendCurrentQueue = () => (
//   Promise.all([
//     Queue.findOne({ major: 'design' }),
//     Queue.findOne({ major: 'programming' }),
//     Queue.findOne({ major: 'marketing' }),
//     Queue.findOne({ major: 'content' })
//   ])
//   .then(([design, programming, marketing, content]) => (
//     io.emit('queue', {
//       design: design.order,
//       programming: programming.order,
//       marketing: marketing.order,
//       content: content.order
//     })
//   ))
// );

const sendCurrentScore = () => (
  Score.find({})
    .then((scores) => io.emit('score', scores))
);

io.on('connection', () => {
  // sendCurrentQueue();
  sendCurrentScore();
});

server.on('request', req => {
  // req.ioSendQueue = sendCurrentQueue;
  req.ioSendScore = sendCurrentScore;
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
