// get routers
const dashboardRouter = require("./dashboard/router");
const categoryRouter = require("./category/router");
const nominalRouter = require("./nominal/router");
const voucherRouter = require("./voucher/router");
const bankRouter = require("./bank/router");
const paymentRouter = require("./payment/router");
const userRouter = require("./user/router");
const transactionRouter = require("./transaction/router");

module.exports = {
  dashboardRouter,
  categoryRouter,
  nominalRouter,
  voucherRouter,
  bankRouter,
  paymentRouter,
  userRouter,
  transactionRouter,
};
