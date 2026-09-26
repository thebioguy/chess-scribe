import { Chess, Square } from 'chess.js';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useMemo } from 'react';

const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const pieceGlyphs: Record<string, string> = {
  wp: '♙',
  wn: '♘',
  wb: '♗',
  wr: '♖',
  wq: '♕',
  wk: '♔',
  bp: '♟',
  bn: '♞',
  bb: '♝',
  br: '♜',
  bq: '♛',
  bk: '♚'
};

export function ChessBoard({ fen, highlightedSquares = [], onSelectSquare }: { fen: string; highlightedSquares?: string[]; onSelectSquare?: (square: Square) => void }) {
  const chess = useMemo(() => new Chess(fen), [fen]);
  const board = chess.board();

  return (
    <div className="mx-auto max-w-[440px] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-panel">
      <div className="grid grid-cols-8">
        {board.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const square = `${files[colIndex]}${8 - rowIndex}` as Square;
            const isDark = (rowIndex + colIndex) % 2 === 1;
            const isSelected = highlightedSquares.includes(square);
            const glyph = cell ? pieceGlyphs[`${cell.color === 'w' ? 'w' : 'b'}${cell.type}`] : '';

            return (
              <button
                key={square}
                type="button"
                onClick={() => onSelectSquare?.(square)}
                className={[
                  'relative flex aspect-square items-center justify-center text-3xl transition hover:brightness-110',
                  isDark ? 'bg-slate-700 text-slate-200' : 'bg-slate-100 text-slate-800',
                  isSelected ? 'ring-2 ring-brand-400 ring-inset' : ''
                ].join(' ')}
              >
                <span className="select-none">{glyph}</span>
                {rowIndex === 7 && (
                  <span className="absolute bottom-1 right-1 text-[10px] font-medium opacity-60">{files[colIndex]}</span>
                )}
                {colIndex === 0 && (
                  <span className="absolute left-1 top-1 text-[10px] font-medium opacity-60">{8 - rowIndex}</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export function ScanPanel({
  detectedText,
  onApplyCorrection,
  options,
  currentMove
}: {
  detectedText: string;
  onApplyCorrection: (selectedMove: string) => void;
  options: string[];
  currentMove: { original: string; corrected: string; notes: string } | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-slate-200">Move review</div>
        <div className="flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-brand-200">
          <Sparkles size={12} /> Learning
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-300">
        {currentMove ? (
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">OCR</div>
              <div className="mt-1 text-base font-medium text-white">{currentMove.original}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Suggested legal move</div>
              <div className="mt-1 text-base font-medium text-emerald-300">{currentMove.corrected}</div>
            </div>
            <div className="text-xs text-slate-400">{currentMove.notes}</div>
          </div>
        ) : (
          <div className="text-slate-400">No move selected.</div>
        )}
      </div>

      <div className="mt-4 grid gap-2">
        {options.length ? (
          options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onApplyCorrection(option)}
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-left text-sm text-slate-200 transition hover:border-brand-500 hover:bg-slate-800"
            >
              <span>{option}</span>
              <ChevronRight size={16} className="text-brand-300" />
            </button>
          ))
        ) : (
          <div className="text-sm text-slate-400">No legal alternatives available.</div>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
        <span className="font-medium text-slate-200">Detected text:</span>
        <div className="mt-2 whitespace-pre-wrap break-words">{detectedText || 'No OCR output yet.'}</div>
      </div>
    </div>
  );
}
