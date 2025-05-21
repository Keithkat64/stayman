
// transferLogic.js

function handleTransfer(opener, responder, bidHistory) {
  const lastBid = bidHistory.at(-1);
  const responderMajor = responder.preferredMajor; // 'hearts' or 'spades'
  const hasFiveInMajor = responder.hand[responderMajor].length >= 5;
  const hasSixPlusInMajor = responder.hand[responderMajor].length >= 6;
  const shortagePoints = responder.shortagePoints || 0;
  const responderTP = responder.hcp + shortagePoints;
  const openerTP = opener.hcp + (opener.hasDoubleton ? 1 : 0);
  const otherMajor = responderMajor === 'spades' ? 'hearts' : 'spades';
  const responderHasFourInOtherMajor = responder.hand[otherMajor].length === 4;
  const responderShape = responder.shape;
  const hasMinorWithHonours = minor => {
    const suit = opener.hand[minor];
    const honourCount = ['A', 'K', 'Q', 'J', '10'].filter(h => suit.includes(h)).length;
    return suit.length >= 5 && (honourCount >= 2);
  };

  switch (lastBid) {
    case '2♦': return '2♥';
    case '2♥': return '2♠';

    case '2♥': case '2♠': {
      if (hasFiveInMajor && !hasSixPlusInMajor) {
        if (responder.hcp <= 7) return 'PASS';
        if (responder.hcp <= 9) return '2NT';
        if (responder.hcp >= 10 && responder.hcp <= 14) {
          if (responder.hasShortage) return responder.fourCardMinorBid;
          if (responderShape === '5332' || responderShape === '5422') return '3NT';
        }
        if (responder.hcp >= 15) {
          if (responder.hasShortage) return responder.fourCardMinorBid;
          return '4NT';
        }
      } else if (hasSixPlusInMajor) {
        if (responderTP <= 7) return 'PASS';
        if (responderTP <= 9) return `3${responderMajor[0].toUpperCase()}`;
        if (responderTP <= 14) return `4${responderMajor[0].toUpperCase()}`;
        return '4NT';
      }
      if (responderHasFourInOtherMajor) {
        if (responder.hcp <= 7) return 'PASS';
        if (responder.hcp <= 9) return '2NT';
        return `3${otherMajor[0].toUpperCase()}`;
      }
      break;
    }

    case '2NT': {
      if (opener.hand[responderMajor].length >= 3) {
        if (openerTP >= 18) return `4${responderMajor[0].toUpperCase()}`;
        return `3${responderMajor[0].toUpperCase()}`;
      } else {
        if (opener.hcp === 18 || (opener.hcp === 17 && (hasMinorWithHonours('clubs') || hasMinorWithHonours('diamonds'))))
          return '3NT';
        return 'PASS';
      }
    }

    case '3NT': {
      return opener.hand[responderMajor].length >= 3 ? `4${responderMajor[0].toUpperCase()}` : 'PASS';
    }

    case '3♣': case '3♦': {
      if (opener.hand[responderMajor].length >= 3) {
        if (openerTP >= 18) return `3${responderMajor[0].toUpperCase()}`;
        return `4${responderMajor[0].toUpperCase()}`;
      } else {
        const minor = lastBid.slice(1);
        if (opener.hand[minor].length >= 4) return `4${minor}`;
        return '3NT';
      }
    }

    case `3${responderMajor[0].toUpperCase()}`: {
      if (responderTP >= 15) return '4NT';
      return responderTP >= 10 ? `4${responderMajor[0].toUpperCase()}` : 'PASS';
    }

    case `4${responderMajor[0].toUpperCase()}`:
      return responderTP >= 15 ? '4NT' : 'PASS';

    case `4${responder.fourCardMinorBid?.slice(1)}`:
      return responderTP >= 15 ? '4NT' : `5${responder.fourCardMinorBid?.slice(1)}`;
  }

  return 'PASS';
}
