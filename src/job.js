// make bluebird default Promise
require('module-alias/register');
const axios = require('axios');
const Investment = require("@models/Investment");
const mongoose = require('@config/mongoose');
const { logger } = require('@config/logger');
const { port, env, ethRpc, campaigns, networks } = require('@config/vars');
const { getTx, getTxReceipt } = require('@utils/blockchain');
const cron = require('node-cron');
const BigNumber = require('bignumber.js');
const { token } = require('morgan');

(async () => {
  try {
    global.logger = logger;
    await mongoose.setup();
    cron.schedule('* * * * *', async () => {
        console.log('running a task every minute');
        let invests = await Investment.find({ status: "pending" });
        for (let invest of invests) {
            try {
                let status = 'pending'
                let transaction = await getTx(invest.network, invest.hash);
                if (transaction) {
                    if (transaction.to != invest.contract) {
                        invest.status = "failed";
                    } else {
                        let input = transaction.input.toLowerCase()
                        if (input.indexOf(campaigns[invest.campaign]) == -1) {
                            invest.status = "failed";
                        }
                    }
                }

                let receipt = await getTxReceipt(invest.network, invest.hash);
                if (receipt && receipt.status != '0x1') {
                    invest.status = "failed";
                } else if (receipt && receipt.status == '0x1') {
                    invest.status = "confirmed";
                }

                await invest.save()
                console.log('checking tx network', invest.network, invest.hash)
            } catch (e) {
                console.log('Failed to check investment status: ', invest.network, invest.hash, e.message)                
            }
        }
    });

    cron.schedule('* * * * *', async () => {
        console.log('scanning for new transfer every minute');
        for (let network of networks) {
            for (let token of network.tokens) {
                let transfers = await getTokenTransfers(network, token)
                for (let transfer of transfers) {
                    let invest = await Investment.findOne({ hash: transfer.hash });
                    if (invest) {
                        continue
                    }

                    if (transfer.to.toLowerCase() != `0x${campaigns.mexc.toLowerCase()}`) continue
                    if (network.name == "ethereum" && parseInt(transfer.blockNumber) <= 19268925) continue
                    if (network.name == "polygon" && parseInt(transfer.blockNumber) <= 53745300) continue
                    if (network.name == "bsc" && parseInt(transfer.blockNumber) <= 36300777) continue
                    let amount = new BigNumber(transfer.value).dividedBy(token.decimal == 6 ? 1000000 : 1000000000000000000)
                    let trx = new Investment({
                        from        : transfer.from,
                        name        : '',
                        twitter     : '',
                        amount      : parseInt(amount),
                        hash        : transfer.hash,
                        network     : network.name,
                        contract    : token.address,
                        currency    : transfer.tokenSymbol, // usdc or usdt or kaspa...
                        decimal     : token.decimal,
                        campaign    : 'top12',
                        refund      : 0,
                        refundHash  : '',
                        status      : 'confirmed',
                        ctime       : Date.now(),
                        utime       : Date.now(),
                    });

                    console.log('Saved ' + transfer.hash) 
                    await trx.save()
                }
            }
        }
        
    });
    
  } catch (e) {
    logger.error(`${e.message}`);
  }
})();


async function getTokenTransfers(network, token) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: network.api + `&contractaddress=${token.address}&address=0x${campaigns.top12}`,
        headers: {}
      };
      
    const response = await axios.request(config);
    return response.data.result;
}