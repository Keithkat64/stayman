// blackwood-logic.js
export function runBlackwood(opener, responder, bidHistory) {
  const aceCount = countAces(opener);
  const kingCount = countKings(opener);
  const lastBid = bidHistory[bidHistory.length - 1];

  if (lastBid === "4NT") {
    const responses = ["5C", "5D", "5H", "5S"];
    const bid = responses[Math.min(aceCount, 3)];
    return {
      openerBid: bid,
      nextStep: "awaitResponderRebid"
    };
  }

  if (lastBid === "5NT") {
    const responses = ["6C", "6D", "6H", "6S"];
    const bid = responses[Math.min(kingCount, 3)];
    return {
      openerBid: bid,
      nextStep: "awaitResponderFinalDecision"
    };
  }

  return { error: "Unexpected bid for Blackwood" };
}

function countAces(hand) {
  return hand.filter(card => card.startsWith("A")).length;
}

function countKings(hand) {
  return hand.filter(card => card.startsWith("K")).length;
}
