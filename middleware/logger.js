const moment = require("moment");
const chalk = require('chalk');

// Logger
const logger = (req, res, next) => {
  console.log(
    `${chalk.whiteBright(moment().format('LLL') + ' PST')} | @${req.protocol}://${req.get("host")}${
      chalk.cyanBright(req.originalUrl)
    }`
  );
  next();
};

module.exports = logger;