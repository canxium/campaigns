// get an instance of mongoose and mongoose.Schema
const mongoose = require('mongoose');
const SchemaTypes = mongoose.Schema.Types;
// set up a mongoose model and pass it using module.exports
const Investment = new mongoose.Schema({
  from        : String,
  name        : String,
  twitter     : String,
  amount      : Number,
  hash        : String,
  network     : String,
  contract    : String,
  currency    : String, // usdc or usdt or kaspa...
  decimal     : Number,
  campaign    : String,
  refund      : Number,
  refundHash  : String,
  status      : String,
  ctime       : Date,
  utime       : Date,
});

Investment.pre("save", function (next) {
  if (this.isNew == true) {
    this.ctime = Date.now()
  }

  this.utime = Date.now()
  next()
})

Investment.pre("update", function() {
  this.update({},{ $set: { utime: Date.now() } })
})

// Create the User model.
const Schema = mongoose.model("Investments", Investment);
module.exports = Schema;
