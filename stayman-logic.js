// stayman-logic.js
export function runStayman(opener, responder) {
  const suits = responder.reduce((acc, card) => {
    const suit = card.slice(-1);
    acc[suit] = (acc[suit] || 0) + 1;
    return acc;
  }, {});
  const has4H = suits['♥'] === 4;
  const has4S = suits['♠'] === 4;

  if (!(has4H || has4S)) {
    return {
      error: "Keith would choose transfers here",
      redirectTo: "transfers"
    };
  }

  const responderBid = "2C";
  let openerBid;

  const openerSuits = opener.reduce((acc, card) => {
    const suit = card.slice(-1);
    acc[suit] = (acc[suit] || 0) + 1;
    return acc;
  }, {});

  if (openerSuits['♥'] === 4) {
    openerBid = "2H";
  } else if (openerSuits['♠'] === 4) {
    openerBid = "2S";
  } else {
    openerBid = "2D";
  }

  return {
    responderBid,
    openerBid,
    nextStep: "awaitResponderRebid"
  };
}
