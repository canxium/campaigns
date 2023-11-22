const path = require('path');
const env = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const { STORAGE_HOST } = require('@config/constants');
require('dotenv').config({
  path: path.join(__dirname, '../../' + env)
});

module.exports = Object.freeze({
  port                : process.env.PORT || 3001,
  logs                : process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  logLevels           : {
    file              : process.env.FILE_LOG_LEVEL || 'info',
    console           : process.env.CONSOLE_LOG_LEVEL || 'debug',
    sentry            : process.env.SENTRY_LOG_LEVEL || 'error'
  },
  mongodb             : {
    uri               : process.env.MONGODB_URI
  },
  ethRpc              : process.env.ETH_RPC,
  polygonRpc          : process.env.POLYGON_RPC,
  bscRpc              : process.env.BSC_RPC,
  campaigns           : {
    mexc              : 'bd65d6efb2c3e6b4dd33c664643beb8e5e133055'
  }
});
