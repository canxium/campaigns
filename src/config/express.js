const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const cookieParser = require("cookie-parser");
const routes = require('@routes');
const { logs } = require('@config/vars');
const error = require('@middlewares/error');
const cacheControl = require('express-cache-controller');

/**
* Express instance
* @public
*/
const app = express();

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' https://ka-f.fontawesome.com https://rpc.ankr.com; font-src 'self' https://fonts.googleapis.com https://ka-f.fontawesome.com https://fonts.gstatic.com; img-src 'self'; script-src 'self' https://kit.fontawesome.com 'sha256-8Bk0V7op+K3b/FTUqdMm2H8eROBIW7oM8OizF9QfiYU=' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; frame-src 'self'"
  );
  
  next();
});

app.use(cacheControl({ maxAge: 0, sMaxAge: 86400 })); // cached 1 day for cloudflare

// set the view engine to ejs
app.set('view engine', 'ejs');

// dashboard ui
app.use(express.static('public'));

app.use('/assets', express.static('public/assets'));

app.use("/assets", express.static('assets'));

// request logging. dev: console | production: file
app.use(morgan(logs, {
  skip: function (req, res) { return req.url.indexOf('/assets') === 0 || req.url.indexOf('/monitor/reports') === 0 }
}));

app.use(cookieParser());
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
// app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
// app.use(cors());

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

// mount base routers
app.use('/', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app;
