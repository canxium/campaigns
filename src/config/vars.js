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
    mexc              : 'bd65d6efb2c3e6b4dd33c664643beb8e5e133055',
    hedging           : '6deec32876f9e2c54618ef965fb39c28b285c9e4',
  },
  networks            : [{
    name              : "bsc",
    api               : 'https://api.bscscan.com/api?module=account&action=tokentx&sort=desc&apikey=BYDNGMJT1U49ZZ76CKNHT6GAUKCQIK6XWF',
    tokens            : [{
        address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        decimal: 18,
    }, {
        address: "0x55d398326f99059ff775485246999027b3197955",
        decimal: 18,
    }]
  }]
});
