// keith-ai-logic.js
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const FULL_DECK = SUITS.flatMap(suit => RANKS.map(rank => rank + suit));

function shuffle(array) {
  let copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function evaluateHCP(hand) {
  return hand.reduce((sum, card) => {
    let rank = card.slice(0, -1);
    if (rank === 'A') return sum + 4;
    if (rank === 'K') return sum + 3;
    if (rank === 'Q') return sum + 2;
    if (rank === 'J') return sum + 1;
    return sum;
  }, 0);
}

function countSuits(hand) {
  return hand.reduce((acc, card) => {
    const suit = card.slice(-1);
    acc[suit] = (acc[suit] || 0) + 1;
    return acc;
  }, {});
}

function isBalanced(suitCounts) {
  const counts = Object.values(suitCounts);
  const shapes = [
    [5, 3, 3, 2],
    [4, 3, 3, 3],
    [4, 4, 3, 2]
  ];
  return shapes.some(shape => shape.sort().toString() === counts.sort().toString());
}

function generateOpenerHand(deck) {
  let tries = 0;
  while (tries++ < 1000) {
    const shuffled = shuffle(deck);
    const hand = shuffled.slice(0, 13);
    const hcp = evaluateHCP(hand);
    const suitCounts = countSuits(hand);
    if (
      hcp >= 16 && hcp <= 18 &&
      suitCounts['♠'] <= 4 &&
      suitCounts['♥'] <= 4 &&
      isBalanced(suitCounts)
    ) return hand;
  }
  return null;
}

function generateResponderHand(deck) {
  let tries = 0;
  while (tries++ < 1000) {
    const shuffled = shuffle(deck);
    const hand = shuffled.slice(0, 13);
    const hcp = evaluateHCP(hand);
    const suits = countSuits(hand);
    const has4Major = (suits['♠'] === 4 || suits['♥'] === 4);
    const hasBoth4 = (suits['♠'] === 4 && suits['♥'] === 4);
    const has5Major = (suits['♠'] >= 5 || suits['♥'] >= 5);
    if ((hcp >= 8 && (has4Major || hasBoth4)) || (hcp >= 5 && has5Major)) {
      return hand;
    }
  }
  return null;
}

export function generateHands() {
  const shuffledDeck = shuffle(FULL_DECK);
  const opener = generateOpenerHand(shuffledDeck);
  if (!opener) return { error: 'Failed to generate opener hand' };

  const remainingDeck = shuffledDeck.filter(card => !opener.includes(card));
  const responder = generateResponderHand(remainingDeck);
  if (!responder) return { error: 'Failed to generate responder hand' };

  return {
    opener,
    responder
  };
}
