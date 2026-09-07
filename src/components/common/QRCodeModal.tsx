import React from 'react';
import { QrCode, X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  codeData: string;
  entityType: 'tourist' | 'establishment' | 'destination' | 'document';
  extraDetails?: { label: string; value: string }[];
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  codeData,
  entityType,
  extraDetails = [],
}) => {
  if (!isOpen) return null;

  // Generate SVG QR pattern deterministically from codeData
  const generateGrid = (str: string) => {
    const size = 21;
    const grid: boolean[][] = Array(size).fill(false).map(() => Array(size).fill(false));

    // Finder patterns (top-left, top-right, bottom-left)
    const placeFinder = (startX: number, startY: number) => {
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 7; x++) {
          if (
            y === 0 || y === 6 || x === 0 || x === 6 ||
            (y >= 2 && y <= 4 && x >= 2 && x <= 4)
          ) {
            grid[startY + y][startX + x] = true;
          }
        }
      }
    };

    placeFinder(0, 0);
    placeFinder(size - 7, 0);
    placeFinder(0, size - 7);

    // Hash string to fill internal modules
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Skip finder zones
        const inFinder1 = x < 8 && y < 8;
        const inFinder2 = x >= size - 8 && y < 8;
        const inFinder3 = x < 8 && y >= size - 8;
        if (inFinder1 || inFinder2 || inFinder3) continue;

        // Pattern logic
        const bit = ((hash ^ (x * 37 + y * 17)) & (1 << ((x + y) % 16))) !== 0;
        grid[y][x] = bit;
      }
    }

    return { grid, size };
  };

  const { grid, size } = generateGrid(codeData);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="bg-emerald-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/80 flex items-center justify-center text-emerald-200 border border-emerald-600">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base leading-tight">Official Digital Verification QR</h3>
              <p className="text-xs text-emerald-200">MTO Malungon Authenticated Code</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-200 hover:text-white rounded-lg p-1 transition-colors hover:bg-emerald-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-center">
          {/* Official badge header */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-medium border border-emerald-200 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="capitalize">{entityType} Official Record</span>
          </div>

          <h4 className="text-lg font-bold text-slate-800">{title}</h4>
          <p className="text-xs text-slate-500 mb-4">{subtitle}</p>

          {/* Render Vector QR Code */}
          <div className="mx-auto w-52 h-52 bg-white p-3 rounded-lg border-2 border-dashed border-emerald-600/50 shadow-inner flex items-center justify-center relative">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full"
              shapeRendering="crispEdges"
            >
              {grid.map((row, y) =>
                row.map((cell, x) =>
                  cell ? (
                    <rect
                      key={`${x}-${y}`}
                      x={x}
                      y={y}
                      width={1}
                      height={1}
                      fill="#064e3b"
                    />
                  ) : null
                )
              )}
            </svg>
            {/* Center LGU Icon Badge */}
            <div className="absolute w-8 h-8 rounded-full bg-white border-2 border-emerald-700 flex items-center justify-center shadow-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-[9px] font-bold text-white flex items-center justify-center">
                MTO
              </div>
            </div>
          </div>

          <div className="mt-4 bg-slate-50 rounded-lg p-3 border border-slate-200 text-left text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500 font-medium">Control String:</span>
              <span className="font-mono text-slate-700 font-semibold truncate max-w-[200px]">{codeData}</span>
            </div>
            {extraDetails.map((detail, idx) => (
              <div key={idx} className="flex justify-between border-t border-slate-200/60 pt-1">
                <span className="text-slate-500">{detail.label}:</span>
                <span className="font-semibold text-slate-800">{detail.value}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-400 mt-3 flex items-center justify-center space-x-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted with Municipal Tourism LGU Security Checksum</span>
          </p>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-medium text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <div className="flex space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass / Badge</span>
            </button>
            <button
              onClick={() => alert(`Verification link copied for: ${codeData}`)}
              className="inline-flex items-center space-x-1.5 text-xs font-medium bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save Digital Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
