// Import the neccesary modules.
const Investment = require("@models/Investment");
const path = require("path");
const axios = require('axios');
const { ethRpc, polygonRpc, bscRpc, campaigns } = require('@config/vars');

exports.index = async (req, res, next) => {
  let investments = await Investment.find({}).sort({'amount': -1, 'ctime': 1})
  return res.render('index', { investments: investments });
}

exports.submitTx = async (req, res, next) => {
  console.log(req.body)
  try {
    if (!req.params.hash) return res.json({ success: false, message: "Invalid transaction id" });
    let invest = await Investment.findOne({ hash: req.params.hash });
    if (invest) {
      return res.json({ success: false, message: "Tx hash already submitted" });
    }

    if (!campaigns[req.body.campaign]) return res.json({ success: false, message: "Invalid campaign" });

    let transaction = await getTx(req.body.network, req.params.hash)
    if (transaction.to != req.body.contract) return res.json({ success: false, message: "Invalid transaction to address" });
    let input = transaction.input.toLowerCase()
    if (input.indexOf(campaigns[req.body.campaign]) == -1) {
      return res.json({ success: false, message: "Invalid transaction input address" });
    }

    let receipt = await getTxReceipt(req.body.network, req.params.hash)
    if (receipt && receipt.status != '0x1') return res.json({ success: false, message: "Transaction failed" }); 
    let status = receipt && receipt.status == '0x1' ? 'confirmed' : 'pending'
    let trx = new Investment({
      from        : transaction.from,
      name        : req.body.name,
      twitter     : req.body.twitter,
      amount      : req.body.amount,
      hash        : req.params.hash,
      network     : req.body.network,
      contract    : req.body.contract,
      currency    : req.body.currency, // usdc or usdt or kaspa...
      decimal     : req.body.decimal,
      campaign    : req.body.campaign,
      refund      : 0,
      refundHash  : '',
      status      : status,
      ctime       : Date.now(),
      utime       : Date.now(),
    });
    
    await trx.save();
    return res.json({ success: true, message: "", data: { investment: trx }});
  } catch (e) {
    return res.json({ success: false, message: e.message, data: { }});
  }
}

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