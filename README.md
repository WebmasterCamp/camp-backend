# YWC15-API

A backend API services that use for YWC registration. Reuse code from YWC#14

## Getting Started
- run command `npm install` for install packages and dependencies
- config your application `config/default.json`

```json
{
  "MONGODB_URI": "mongodb://user:pass@host:port/dbname",
  "STORAGE_PATH": "./uploads",
  "LIMIT_UPLOAD_FILES": 2,
  "LIMIT_UPLOAD_SIZE_MB": 2
}
```

### Available Commands
- `npm run eslint`
- `npm run build`
- `npm run dev`
- `npm test`
- `npm run pm2-dev`

### Fixed on production
```
npm install babel-polypill babel-runtime bluebird —save
```
