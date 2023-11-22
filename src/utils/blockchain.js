const axios = require('axios');
const { ethRpc, polygonRpc, bscRpc } = require('@config/vars');

async function getTx(network, hash) {
  let data = JSON.stringify({
    "jsonrpc": "2.0",
    "method": "eth_getTransactionByHash",
    "params": [
      hash
    ],
    "id": 2
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: network == 'ethereum' ? ethRpc : network == 'polygon' ? polygonRpc : bscRpc,
    headers: { 
      'Content-Type': 'application/json', 
    },
    data : data
  };

  let response = await axios.request(config)
  if (!response || !response.data || !response.data.result) return null
  return response.data.result
}

async function getTxReceipt(network, hash) {
let data = JSON.stringify({
  "jsonrpc": "2.0",
  "method": "eth_getTransactionReceipt",
  "params": [
    hash
  ],
  "id": 2
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: network == 'ethereum' ? ethRpc : network == 'polygon' ? polygonRpc : bscRpc,
  headers: { 
    'Content-Type': 'application/json', 
  },
  data : data
};

let response = await axios.request(config)
if (!response || !response.data || !response.data.result) return null
return response.data.result
}

module.exports = {
  getTx: getTx,
  getTxReceipt: getTxReceipt,
};