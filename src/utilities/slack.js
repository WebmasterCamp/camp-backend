import { IncomingWebhook } from '@slack/client';
import config from 'config';

const devChannel = new IncomingWebhook(config.SLACK_URL.DEV);
const registerChannel = new IncomingWebhook(config.SLACK_URL.REGISTER);

const sendDevChannel = (message) => (
  new Promise((resolve, reject) => {
    devChannel.send(message, (err, header, statusCode, body) => {
      if (err) {
        return reject(err);
      }
      return resolve(body);
    });
  })
);

const sendRegisterChannel = (message) => (
  new Promise((resolve, reject) => {
    registerChannel.send(message, (err, header, statusCode, body) => {
      if (err) {
        return reject(err);
      }
      return resolve(body);
    });
  })
);

const slack = {
  test: () => sendDevChannel({
    text: 'Test'
  }),
  testRegis: () => sendRegisterChannel({
    text: 'Test Regis'
  }),
  cronBackupSuccess: () => sendDevChannel({
    text: 'Database has successfully backup!'
  })
};

export default slack;
