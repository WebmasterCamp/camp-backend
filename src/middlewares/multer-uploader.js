import multer from 'multer';
import mime from 'mime';
import _ from 'lodash';
import { respondErrors } from '../utilities';
import { generateUniqueString } from '../helpers';
import config from 'config';

const LIMIT_UPLOAD_SIZE_MB = +config.LIMIT_MAX_UPLOAD_SIZE_MB * 1024 * 1024;
const LIMIT_UPLOAD_FILES = +config.LIMIT_UPLOAD_FILES;
// const ALLOW_FILE_TYPES = config.ALLOW_FILE_TYPES;
const STORAGE_PATH = config.STORAGE_PATH;

mime.define({
  'application/x-rar-compressed': ['rar'],
  'application/x-rar': ['rar'],
  'image/jpeg': ['jpg', 'jpeg']
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, STORAGE_PATH);
  },
  filename: async (req, file, cb) => {
    const unique = await generateUniqueString();
    // cb(null, file.fieldname + '-' + req.session.facebook + '-' + unique + '-' + Date.now() + '.' + mime.extension(file.mimetype).replace('jpeg', 'jpg'));
    cb(null, file.fieldname + '-' + unique + '-' + Date.now() + '.' + mime.extension(file.mimetype).replace('jpeg', 'jpg'));
  }
});

const fileFilter = (allowType) => (req, res, next) => {
  // if (!req.file) return res.status(400).send({ message: 'File is required' });
  // console.log(req.file.mimetype);
  console.log('mimetype', (req.file || {}).mimetype, (req.file || {}).originalname);
  if (!req.file) return next();
  const filename = req.file.originalname.split('.');
  if (req.file &&
    (_.includes(_.castArray(allowType), mime.extension(req.file.mimetype)) ||
     _.includes(_.castArray(allowType), filename[filename.length - 1]))) {
    return next();
  }
  return respondErrors(res)({ code: 400, message: 'Wrong file type' });
};
const upload = multer({
  storage,
  limits: {
    fileSize: LIMIT_UPLOAD_SIZE_MB,
    files: LIMIT_UPLOAD_FILES
    // fields: 2
  }
});

export const singleUpload = (name = 'test-upload', ...allowTypes) => [upload.single(name), fileFilter(allowTypes)];
