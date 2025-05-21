// stayman-logic.js
export function handleStaymanResponderBid(responder, opener, openerBid) {
  const hcp = countHCP(responder);
  const tp = hcp + countShortagePoints(responder);
  const spades = countSuit(responder, '♠');
  const hearts = countSuit(responder, '♥');
  const clubs = countSuit(responder, '♣');
  const diamonds = countSuit(responder, '♦');

  const hasMinorSingleton = ((clubs >= 5 && diamonds <= 1) || (diamonds >= 5 && clubs <= 1));

  if (openerBid === '2H') {
    if (hearts === 4) {
      if (tp >= 15) return '4NT';
      if (tp >= 10) return '4H';
      return '3H';
    } else if (spades === 4) {
      if (hcp >= 15) return '4NT';
      if (hcp >= 10) return hasMinorSingleton ? (clubs >= 5 ? '3C' : '3D') : '3NT';
      return '2NT';
    }
  }

  if (openerBid === '2S') {
    if (spades === 4) {
      if (tp >= 15) return '4NT';
      if (tp >= 10) return '4S';
      return '3S';
    } else if (hearts === 4) {
      if (hcp >= 15) return '4NT';
      if (hcp >= 10) return hasMinorSingleton ? (clubs >= 5 ? '3C' : '3D') : '3NT';
      return '2NT';
    }
  }

  if (openerBid === '2D') {
    if (hcp >= 15) return '4NT';
    if (hcp >= 10) return '3NT';
    if (hasMinorSingleton) return clubs >= 5 ? '3C' : '3D';
    return '2NT';
  }

  return 'PASS'; // fallback
}

export function handleStaymanOpenerBid(opener) {
  const spades = countSuit(opener, '♠');
  const hearts = countSuit(opener, '♥');

  if (hearts === 4) return '2H';
  if (spades === 4) return '2S';
  return '2D';
}

export function handleOpenerThirdBid(context) {
  const { opener, responder, sequence } = context;
  const hcp = countHCP(opener);
  const tp = hcp + countShortagePoints(opener);

  const lastResponderBid = sequence.at(-1)?.user;
  const lastOpenerBid = sequence.at(-2)?.keith;
  const responderMinor = ['3C', '3D'].includes(lastResponderBid) ? lastResponderBid[1] : null;

  if (lastResponderBid === '2NT' && lastOpenerBid === '2D') {
    if (hcp >= 18) return '3NT';
    if (hcp === 17 && hasStrongMinor(opener)) return '3NT';
    return 'PASS';
  }

  if (lastResponderBid === '2NT' && lastOpenerBid === '2H') {
    if (countSuit(opener, '♠') === 4) {
      if (tp >= 18) return '4S';
      if (tp >= 17) return '3S';
    }
    return hcp >= 18 ? '3NT' : 'PASS';
  }

  if (lastResponderBid === '2NT' && lastOpenerBid === '2S') {
    return hcp >= 18 ? '3NT' : 'PASS';
  }

  if (['3C', '3D'].includes(lastResponderBid)) {
    if (countSuit(opener, '♠') === 4 && lastOpenerBid === '2H') {
      return tp >= 18 ? '4S' : '3S';
    }
    if (countSuit(opener, responderMinor) === 4) {
      if (hasAKinOtherMinor(opener, responderMinor)) return '3NT';
      return '4' + responderMinor.toUpperCase();
    }
    return '3NT';
  }

  if (lastResponderBid === '3NT' && lastOpenerBid === '2H') {
    if (countSuit(opener, '♠') === 4) return '4S';
  }

  if (lastResponderBid === '3NT' && lastOpenerBid === '2S') {
    return 'PASS';
  }

  return 'PASS';
}

// Helper functions
function countSuit(hand, suit) {
  return hand.filter(c => c.endsWith(suit)).length;
}

function countHCP(hand) {
  return hand.reduce((acc, c) => {
    const rank = c.slice(0, -1);
    return acc + (rank === 'A' ? 4 : rank === 'K' ? 3 : rank === 'Q' ? 2 : rank === 'J' ? 1 : 0);
  }, 0);
}

function countShortagePoints(hand) {
  const suits = ['♠', '♥', '♦', '♣'];
  return suits.reduce((acc, suit) => {
    const len = countSuit(hand, suit);
    return acc + (len === 0 ? 3 : len === 1 ? 2 : len === 2 ? 1 : 0);
  }, 0);
}

function hasStrongMinor(hand) {
  return ['♣', '♦'].some(suit => {
    const cards = hand.filter(c => c.endsWith(suit)).map(c => c[0]);
    const top5 = ['A', 'K', 'Q', 'J', '10'];
    const count = cards.filter(c => top5.includes(c)).length;
    return count >= 2 && cards.length >= 5;
  });
}

function hasAKinOtherMinor(opener, exclude) {
  const other = exclude === 'C' ? '♦' : '♣';
  const cards = opener.filter(c => c.endsWith(other)).map(c => c[0]);
  return cards.includes('A') || cards.includes('K');
}
