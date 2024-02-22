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
    top12             : '6deec32876f9e2c54618ef965fb39c28b285c9e4',
  },
  networks            : [{
    name              : "ethereum",
    api               : 'https://api.etherscan.io/api?module=account&action=tokentx&sort=desc&apikey=58F719I6WFJ5T83YMJ5IYWEJGQCUWBH8YG',
    tokens            : [{
        address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        decimal: 6,
    }, {
        address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        decimal: 6,
    }]
  }, {
    name              : "polygon",
    api               : 'https://api.polygonscan.com/api?module=account&action=tokentx&sort=desc&apikey=YTWJFTPRCBYN7BY5DUJC4IE2D1WD12HNN7',
    tokens            : [{
        address: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
        decimal: 6,
    }, {
        address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
        decimal: 6,
    }]
  } , {
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
