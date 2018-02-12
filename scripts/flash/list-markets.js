#!/usr/bin/env node

"use strict";

var chalk = require("chalk");
var displayTime = require("./display-time");

function listMarketsInternal(augur, universe, callback) {
  augur.api.Controller.getTimestamp(function (err, timestamp) {
    displayTime("Current Time", timestamp);
    var currentTime = new Date(timestamp * 1000);
    augur.markets.getMarkets({ universe: universe, sortBy: "endDate", isSortDescending: true }, function (err, marketIDs) {
      if (!marketIDs || marketIDs.length === 0) {
        console.log(chalk.red("No markets available"));
        callback("No Markets");
      }
      augur.markets.getMarketsInfo({ marketIDs: marketIDs }, function (err, marketInfos) {
        if (!marketInfos || !Array.isArray(marketInfos) || !marketInfos.length) return;
        var infos = marketInfos.sort(function (a, b) { return b.endDate - a.endDate; });
        infos.forEach(function (marketInfo) {
          var endDate = marketInfo.endDate;
          var date = new Date(endDate * 1000);
          var ended = date - currentTime > 0 ? "NO" : "YES";
          console.log(chalk.cyan("endDate:"), chalk.cyan(endDate), chalk.red(date), ended ? chalk.yellow(ended) : chalk.red(ended), chalk.blue(marketInfo.reportingState), chalk.red(marketInfo.designatedReporter));
          console.log(chalk.green.dim(marketInfo.id), chalk.green(marketInfo.description));
        });
        callback(null);
      });
    });
  });
}

function help(callback) {
  console.log(chalk.red("params syntax --> -p  no params needed"));
  callback(null);
}

function listMarkets(augur, params, auth, callback) {
  if (params === "help") {
    help(callback);
  } else {
    var universe = augur.contracts.addresses[augur.rpc.getNetworkID()].Universe;
    console.log(chalk.green.dim("Universe"), universe);
    listMarketsInternal(augur, universe, callback);
  }
}

module.exports = listMarkets;
