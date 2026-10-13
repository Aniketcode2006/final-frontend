import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

const SHARED_PREVIEW_URL = 'https://ais-pre-zh5xo26gxaz2xf7bhtmuzs-509661435139.asia-southeast1.run.app';
const DEV_APP_URL = 'https://ais-dev-zh5xo26gxaz2xf7bhtmuzs-509661435139.asia-southeast1.run.app';

export const MobileTestModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState('shared'); // 'shared' | 'dev'
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [generationError, setGenerationError] = useState(false);

  const activeUrl = selectedTarget === 'shared' ? SHARED_PREVIEW_URL : DEV_APP_URL;

  // Generate crisp local QR code data URL whenever the selected URL changes
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(activeUrl, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setGenerationError(false);
        }
      })
      .catch((err) => {
        console.error('Failed to generate local QR code:', err);
        if (isMounted) {
          // Fallback to online image provider if local canvas generation fails
          setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(activeUrl)}`);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">Test App on Mobile Phone</h3>
              <p className="text-[11px] text-slate-500">Scan QR code using your phone's camera</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Target Selector Tabs */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setSelectedTarget('shared')}
              className={`py-2 px-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTarget === 'shared'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Public Link (Recommended)</span>
            </button>
            <button
              onClick={() => setSelectedTarget('dev')}
              className={`py-2 px-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTarget === 'dev'
                  ? 'bg-white text-indigo-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Dev Link</span>
            </button>
          </div>

          {selectedTarget === 'shared' ? (
            <div className="mt-2.5 px-3 py-2 bg-emerald-50 border border-emerald-200/70 rounded-lg flex items-start gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-emerald-800 leading-snug">
                <strong>Works on any phone:</strong> No Google login required. Open directly in Safari, Chrome, or any mobile browser.
              </p>
            </div>
          ) : (
            <div className="mt-2.5 px-3 py-2 bg-amber-50 border border-amber-200/70 rounded-lg flex items-start gap-2 text-left">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-800 leading-snug">
                <strong>Requires Google Auth:</strong> Only opens if your phone is logged into your authorized Google AI Studio account.
              </p>
            </div>
          )}
        </div>

        {/* Content & QR Display */}
        <div className="p-5 flex flex-col items-center text-center">
          {/* QR Code Container */}
          <div className="p-3.5 bg-white rounded-2xl border-2 border-slate-200 shadow-md relative group mb-4">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan QR code to open app on mobile"
                className="w-56 h-56 object-contain rounded-xl"
                loading="eager"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 text-xs">
                Generating QR code...
              </div>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/75 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-2xs">
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-lg transform transition-transform group-hover:scale-105"
              >
                <span>Open Link in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Steps */}
          <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-left mb-4">
            <ol className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <span>Open your phone's <strong>Camera app</strong>.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>Point camera steadily at the QR code above.</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <span>Tap the yellow/blue banner that appears to open!</span>
              </li>
            </ol>
          </div>

          {/* Direct link & Copy */}
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={activeUrl}
              className="flex-1 text-[11px] font-mono text-slate-700 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-2 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs shrink-0 cursor-pointer"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Responsive & Touch Optimized</span>
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
