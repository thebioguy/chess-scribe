import { Chess, Square } from 'chess.js';

export type PersonalProfile = {
  corrections: Record<string, string>;
  boardPatterns: Record<string, number>;
};

export type ReconstructedMove = {
  id: number;
  original: string;
  corrected: string;
  beforeFen: string;
  afterFen: string;
  legal: boolean;
  confidence: number;
  notes: string;
};

const defaultProfile: PersonalProfile = {
  corrections: {
    'b': 'b',
    '0-0': 'O-O',
    '0-0-0': 'O-O-O'
  },
  boardPatterns: {}
};

export function loadProfile(): PersonalProfile {
  if (typeof window === 'undefined') {
    return defaultProfile;
  }

  try {
    const raw = localStorage.getItem('chess-scribe-profile');
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: PersonalProfile) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('chess-scribe-profile', JSON.stringify(profile));
}

export function normalizeToken(raw: string) {
  return raw
    .trim()
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\./g, '')
    .toLowerCase();
}

export function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

export function laterMoveSimilarity(candidate: string, target: string) {
  const a = normalizeToken(candidate);
  const b = normalizeToken(target);
  if (!a || !b) return 0;
  const distance = levenshtein(a, b);
  const maxLength = Math.max(a.length, b.length);
  return maxLength === 0 ? 1 : 1 - distance / maxLength;
}

export function parseMoveCandidates(rawText: string) {
  const normalized = rawText.replace(/\r/g, '\n');
  const tokens = normalized
    .split(/\s+/)
    .map((token) => token.replace(/[,;]+$/, ''))
    .filter(Boolean);

  const candidates = new Set<string>();

  for (const token of tokens) {
    const cleaned = token.replace(/^[0-9]+\.?\s*$/, '').trim();
    if (!cleaned) continue;

    if (/^(?:[0-9]+\.)|^(?:O-O|O-O-O|0-0|0-0-0)|^[KQRBNPkqrbnp]?[a-h]?[1-8]?x?[a-h][1-8][+#]?$/i.test(cleaned)) {
      candidates.add(cleaned);
    }
  }

  return Array.from(candidates).slice(0, 120);
}

export function getLegalSuggestions(chess: Chess, candidate: string) {
  const legalMoves = chess.moves({ verbose: true }).map((move) => move.san);
  const normalized = normalizeToken(candidate);

  return legalMoves
    .map((move) => ({
      move,
      score: laterMoveSimilarity(candidate, move)
    }))
    .sort((a, b) => b.score - a.score)
    .filter((item) => item.score > 0.1 || item.move.toLowerCase().includes(normalized) || normalized.includes(item.move.toLowerCase()));
}

export function deriveMostLikelyLegalMove(chess: Chess, candidate: string, profile: PersonalProfile) {
  const cleaned = normalizeToken(candidate);
  const learned = profile.corrections[cleaned];
  if (learned) {
    const legal = chess.moves().includes(learned);
    if (legal) {
      return {
        corrected: learned,
        confidence: 0.96,
        notes: `Learned from your personal profile for '${candidate}'`
      };
    }
  }

  const legalMoves = chess.moves();
  if (!legalMoves.length) {
    return { corrected: '', confidence: 0, notes: 'No legal moves remain.' };
  }

  const scored = legalMoves
    .map((move) => ({
      move,
      score: laterMoveSimilarity(candidate, move)
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  return {
    corrected: best?.move ?? '',
    confidence: best ? best.score : 0,
    notes: best ? `Best legal match for OCR token '${candidate}'` : 'Could not infer a legal move.'
  };
}

export function reconstructGame(rawText: string, profile: PersonalProfile) {
  const chess = new Chess();
  const moveCandidates = parseMoveCandidates(rawText);

  const reconstructed: ReconstructedMove[] = [];

  for (const [index, original] of moveCandidates.entries()) {
    const beforeFen = chess.fen();
    const legalSuggestions = getLegalSuggestions(chess, original);
    const bestLegal = deriveMostLikelyLegalMove(chess, original, profile);

    const chosen = bestLegal.corrected || legalSuggestions[0]?.move || original;
    let targetMove = chosen;

    try {
      const legal = chess.moves().includes(chosen);
      if (!legal) {
        if (legalSuggestions[0]) {
          targetMove = legalSuggestions[0].move;
        } else {
          targetMove = original;
        }
      }

      const move = chess.move(targetMove, { sloppy: true });
      reconstructed.push({
        id: index,
        original,
        corrected: move ? move.san : targetMove,
        beforeFen,
        afterFen: chess.fen(),
        legal: Boolean(move),
        confidence: move ? 0.8 : 0.25,
        notes: move ? bestLegal.notes : 'This move was not legal from the reconstructed board.'
      });
    } catch {
      reconstructed.push({
        id: index,
        original,
        corrected: original,
        beforeFen,
        afterFen: chess.fen(),
        legal: false,
        confidence: 0.15,
        notes: 'The OCR token could not be converted into a legal move from this position.'
      });
    }
  }

  return reconstructed;
}

export function exportPgn(game: ReconstructedMove[], eventName = 'Chess Scribe Demo') {
  const lines = [
    `[Event "${eventName}"]`,
    `[Site "Local"]`,
    `[Date "${new Date().toISOString().slice(0, 10)}"]`,
    `[Round "-"]`,
    `[White "Player"]`,
    `[Black "Opponent"]`,
    `[Result "*"]"
  ];

  const moveText = game
    .filter((entry) => entry.legal)
    .map((entry, index) => {
      const moveNumber = Math.floor(index / 2) + 1;
      return index % 2 === 0 ? `${moveNumber}. ${entry.corrected}` : `${entry.corrected}`;
    })
    .join(' ');

  return `${lines.join('\n')}\n\n${moveText}\n`;
}

export function exportFen(game: ReconstructedMove[]) {
  if (!game.length) {
    return new Chess().fen();
  }

  const finalBoard = new Chess(game[game.length - 1].afterFen);
  return finalBoard.fen();
}

export function estimateEvaluation(boardFen: string) {
  const chess = new Chess(boardFen);
  const board = chess.board();

  const values: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0
  };

  let total = 0;
  for (const row of board) {
    for (const cell of row) {
      if (!cell) continue;
      const piece = cell.color === 'w' ? cell.type.toUpperCase() : cell.type.toLowerCase();
      total += values[piece.toLowerCase()] * (piece === piece.toUpperCase() ? 1 : -1);
    }
  }

  const sideToMove = chess.turn() === 'w' ? 1 : -1;
  return total * sideToMove * 0.18;
}

export function renderSquareLabel(square: Square) {
  return square;
}
