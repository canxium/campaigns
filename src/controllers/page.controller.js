// Import the neccesary modules.
const Investment = require("@models/Investment");
const { campaigns } = require('@config/vars');
const { getTx, getTxReceipt } = require("@utils/blockchain");

exports.index = async (req, res, next) => {
  let USDollar = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
  });

  let investments = await Investment.find({ status: "confirmed"  }).sort({'amount': -1, 'ctime': 1});
  let raised = investments.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.amount
  }, 0);
  let ethereum = investments.reduce((accumulator, currentValue) => {
    if (currentValue.network != 'ethereum') return accumulator;
    return accumulator + currentValue.amount
  }, 0);

  let polygon = investments.reduce((accumulator, currentValue) => {
    if (currentValue.network != 'polygon') return accumulator;
    return accumulator + currentValue.amount
  }, 0);

  let bsc = investments.reduce((accumulator, currentValue) => {
    if (currentValue.network != 'bsc') return accumulator;
    return accumulator + currentValue.amount
  }, 0);

  let mexc = {};
  let hedging = {};
  let foundation = 36213;
  let data = {};
  {
    let mexcInvestments = await Investment.find({ campaign: 'mexc', status: "confirmed"  }).sort({'amount': -1, 'ctime': 1});
    data.mexc = await Investment.find({ campaign: 'mexc'  }).sort({'amount': -1, 'ctime': 1});;
    let raised = mexcInvestments.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount
    }, 0);

    let target = 60000;
    let completion = ((raised + foundation)*100/target).toFixed(0)
    mexc.raised = USDollar.format(raised + foundation);
    mexc.completion = completion > 100 ? 100 : completion;
  }

  {
    let hedgingInvestments = await Investment.find({ campaign: 'mexc_hedging', status: "confirmed"  }).sort({'amount': -1, 'ctime': 1});
    data.hedging = await Investment.find({ campaign: 'mexc_hedging'  }).sort({'amount': -1, 'ctime': 1});;
    let raised = hedgingInvestments.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.amount
    }, 0);

    let target = 100000;
    let completion = ((raised)*100/target).toFixed(0)
    hedging.raised = USDollar.format(raised);
    hedging.completion = completion > 100 ? 100 : completion;
  }

  return res.render('index', { investments: data, foundation: USDollar.format(foundation), raised: USDollar.format(raised), mexc: mexc, ethereum: USDollar.format(ethereum), polygon: USDollar.format(polygon), bsc: USDollar.format(bsc), hedging: hedging, });
}

exports.submitTx = async (req, res, next) => {
  try {
    if (!req.params.hash) return res.json({ success: false, message: "Invalid transaction id" });
    let invest = await Investment.findOne({ hash: req.params.hash });
    if (invest) {
      return res.json({ success: false, message: "Tx hash already submitted" });
    }

    if (!campaigns[req.body.campaign]) return res.json({ success: false, message: "Invalid campaign" });

    let status = 'pending'
    let transaction = await getTx(req.body.network, req.params.hash)
    if (transaction) {
      if (transaction.to != req.body.contract) return res.json({ success: false, message: "Invalid transaction to address" });
      let input = transaction.input.toLowerCase()
      if (input.indexOf(campaigns[req.body.campaign]) == -1) {
        return res.json({ success: false, message: "Invalid transaction input address" });
      }
    }

    let receipt = await getTxReceipt(req.body.network, req.params.hash)
    if (receipt && receipt.status != '0x1') return res.json({ success: false, message: "Transaction failed" }); 
    status = receipt && receipt.status == '0x1' ? 'confirmed' : 'pending'
    let trx = new Investment({
      from        : transaction ? transaction.from : req.body.from,
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