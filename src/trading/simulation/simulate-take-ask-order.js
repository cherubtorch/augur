"use strict";

var BigNumber = require("bignumber.js");
var calculateSettlementFee = require("./calculate-settlement-fee");
var constants = require("../../constants");
var PRECISION = constants.PRECISION;
var ZERO = constants.ZERO;

function simulateTakeAskOrder(sharesToCover, minPrice, maxPrice, marketCreatorFeeRate, reportingFeeRate, shouldCollectReportingFees, matchingSortedAsks, outcomeID, shareBalances) {
  var numOutcomes = shareBalances.length;
  if (outcomeID <= 0 || outcomeID > numOutcomes) throw new Error("Invalid outcome ID");
  if (sharesToCover.lte(PRECISION.zero)) throw new Error("Number of shares is too small");
  var settlementFees = ZERO;
  var gasFees = ZERO;
  var makerSharesDepleted = ZERO;
  var makerTokensDepleted = ZERO;
  var takerSharesDepleted = ZERO;
  var takerTokensDepleted = ZERO;
  matchingSortedAsks.forEach(function (matchingAsk) {
    var takerDesiredShares = BigNumber.min(new BigNumber(matchingAsk.amount, 10), sharesToCover);
    var makerSharesEscrowed = BigNumber.min(new BigNumber(matchingAsk.sharesEscrowed, 10), sharesToCover);
    var orderDisplayPrice = new BigNumber(matchingAsk.fullPrecisionPrice, 10);
    var sharePriceShort = maxPrice.minus(orderDisplayPrice);
    var sharePriceLong = orderDisplayPrice.minus(minPrice);
    var takerSharesAvailable = takerDesiredShares;
    for (var i = 1; i <= numOutcomes; ++i) {
      if (i !== outcomeID) {
        takerSharesAvailable = BigNumber.min(shareBalances[i - 1], takerSharesAvailable);
      }
    }
    sharesToCover = sharesToCover.minus(takerDesiredShares);

    // complete sets sold if maker is closing a long, taker is closing a short
    if (makerSharesEscrowed.gt(PRECISION.zero) && takerSharesAvailable.gt(PRECISION.zero)) {
      var completeSets = BigNumber.min(makerSharesEscrowed, takerSharesAvailable);
      settlementFees = settlementFees.plus(calculateSettlementFee(completeSets, marketCreatorFeeRate, maxPrice.minus(minPrice), shouldCollectReportingFees, reportingFeeRate, sharePriceLong));
      makerSharesDepleted = makerSharesDepleted.plus(completeSets);
      takerSharesDepleted = takerSharesDepleted.plus(completeSets);
      takerDesiredShares = takerDesiredShares.minus(completeSets);
      makerSharesEscrowed = makerSharesEscrowed.minus(completeSets);
    }

    // maker is closing a long, taker is opening a long: no complete sets sold
    if (makerSharesEscrowed.gt(PRECISION.zero) && takerDesiredShares.gt(PRECISION.zero)) {
      var tokensRequiredToCoverTaker = makerSharesEscrowed.times(sharePriceLong);
      makerSharesDepleted = makerSharesDepleted.plus(makerSharesEscrowed);
      takerTokensDepleted = takerTokensDepleted.plus(tokensRequiredToCoverTaker);
      takerDesiredShares = takerDesiredShares.minus(makerSharesEscrowed);
      makerSharesEscrowed = ZERO;
    }

    // maker is opening a short, taker is closing a short
    if (takerSharesAvailable.gt(PRECISION.zero) && takerDesiredShares.gt(PRECISION.zero)) {
      var tokensRequiredToCoverMaker = takerSharesAvailable.times(sharePriceShort);
      makerTokensDepleted = makerTokensDepleted.plus(tokensRequiredToCoverMaker);
      takerSharesDepleted = takerSharesDepleted.plus(takerSharesAvailable);
      takerDesiredShares = takerDesiredShares.minus(takerSharesAvailable);
      takerSharesAvailable = ZERO;
    }

    // maker is opening a short, taker is opening a long
    if (takerDesiredShares.gt(PRECISION.zero)) {
      takerPortionOfCompleteSetCost = takerDesiredShares.times(sharePriceLong);
      makerPortionOfCompleteSetCost = takerDesiredShares.times(sharePriceShort);
      makerTokensDepleted = makerTokensDepleted.plus(makerPortionOfCompleteSetCost);
      takerTokensDepleted = takerTokensDepleted.plus(takerPortionOfCompleteSetCost);
      takerDesiredShares = ZERO;
    }
  });
  if (takerSharesDepleted.gt(ZERO)) {
    for (var i = 1; i <= numOutcomes; ++i) {
      if (i !== outcomeID) {
        shareBalances[i - 1] = shareBalances[i - 1].minus(takerSharesDepleted);
      }
    }
  }
  return {
    sharesToCover: sharesToCover,
    settlementFees: settlementFees,
    gasFees: gasFees,
    otherSharesDepleted: sharesEscrowed,
    tokensDepleted: tokensEscrowed,
    shareBalances: shareBalances
  };
}

module.exports = simulateTakeAskOrder;
