const mongoose = require('mongoose');
const { mongodb } = require('@config/vars');

exports.Types = mongoose.Types;
exports.setup = async () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(mongodb.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const db = mongoose.connection;
    db.on('error', (e) => {
      return reject(e);
    });

    db.once('open', function() {
      logger.info(`Mongodb connected.`)
      return resolve();
    });
  })
}
