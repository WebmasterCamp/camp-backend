import { CronJob } from 'cron';
import { exec } from 'child_process';
import moment from 'moment';
import slackUtils from './utilities/slack';

const backupDatabase = new CronJob({
  cronTime: '0 * * * *',
  onTick: () => {
    exec(`mongodump --db ywc15 --out backup/${moment().format('DD-MM-YYYY')}`, (err) => {
      if (err) {
        throw new Error(err);
      }
      slackUtils.cronBackupSuccess();
    });
  }
});

backupDatabase.start();

console.log('Cron has been start');
