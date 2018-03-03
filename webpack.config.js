const path = require('path')
const process = require('process')

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
  },
}
