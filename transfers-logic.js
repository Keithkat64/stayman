// transfers-logic.js
export function runTransfers(opener, responder, userBid) {
  const suits = responder.reduce((acc, card) => {
    const suit = card.slice(-1);
    acc[suit] = (acc[suit] || 0) + 1;
    return acc;
  }, {});
  const has5H = suits['♥'] >= 5;
  const has5S = suits['♠'] >= 5;

  if (!(has5H || has5S)) {
    return {
      error: "Keith thinks that this hand is better bid as a stayman hand.",
      redirectTo: "stayman",
      forcedBid: "2C"
    };
  }

  if (userBid !== "2D" && userBid !== "2H") {
    return {
      error: "Please bid either 2D or 2H"
    };
  }

  let openerBid = userBid === "2D" ? "2H" : "2S";

  return {
    openerBid,
    nextStep: "awaitResponderRebid"
  };
}
