// make bluebird default Promise
require('module-alias/register');
const axios = require('axios');
const Investment = require("@models/Investment");
const mongoose = require('@config/mongoose');
const { logger } = require('@config/logger');
const { port, env, ethRpc, campaigns } = require('@config/vars');
const { getTx, getTxReceipt } = require('@utils/blockchain');
const cron = require('node-cron');

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
  } catch (e) {
    logger.error(`${e.message}`);
  }
})();

