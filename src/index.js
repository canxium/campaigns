// make bluebird default Promise
require('module-alias/register');
const { logger } = require('@config/logger');
const app = require('@config/express');
const mongoose = require('@config/mongoose');
const { port, env } = require('@config/vars');
var path = require('path');
global.appRoot = path.resolve(__dirname, "../");

(async () => {
    global.logger = logger;
    await mongoose.setup();
    app.listen(port, () => logger.info(`Server started on port ${port} (${env})`));
})();
