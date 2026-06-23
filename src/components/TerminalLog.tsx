'use client';

import React, { useEffect, useRef, useState } from 'react';
import { LogLine } from '@/store/demoStore';

const SPINNER_CHARS = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

interface TerminalLogProps {
  logs: LogLine[];
  isRunning: boolean;
  maxHeightClass?: string;
  placeholderText?: string;
}

export default function TerminalLog({ 
  logs, 
  isRunning, 
  maxHeightClass = 'h-72',
  placeholderText = 'エージェントの起動を待機中...'
}: TerminalLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spinnerIdx, setSpinnerIdx] = useState(0);

  // Spinner ticking loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSpinnerIdx((prev) => (prev + 1) % SPINNER_CHARS.length);
    }, 80);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Auto-scroll down when new logs appear
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  // Styling maps based on log line type
  const getLineStyle = (type: LogLine['type']) => {
    switch (type) {
      case 'cmd':
        return 'text-text-primary font-semibold';
      case 'success':
        return 'text-positive font-medium';
      case 'warn':
        return 'text-negative font-medium';
      default:
        return 'text-text-secondary';
    }
  };

  const getLinePrefix = (type: LogLine['type']) => {
    switch (type) {
      case 'cmd':
        return '$ ';
      case 'success':
        return '✓ ';
      case 'warn':
        return '⚠ ';
      default:
        return '  ';
    }
  };

  return (
    <div className="bg-bg-subtle border border-border-custom rounded-xl p-4 font-mono text-[11px] leading-relaxed flex flex-col justify-between select-none">
      
      {/* Log list viewport */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-y-auto space-y-1.5 scroll-smooth ${maxHeightClass}`}
      >
        {logs.length === 0 ? (
          <div className="text-text-muted/60 italic flex items-center gap-2">
            {isRunning && <span className="text-brand font-bold">{SPINNER_CHARS[spinnerIdx]}</span>}
            <span>{placeholderText}</span>
          </div>
        ) : (
          logs.map((log) => (
            <div 
              key={log.id} 
              className={`flex items-start gap-2.5 break-all animate-fade-in ${getLineStyle(log.type)}`}
            >
              {/* Optional: compact timestamp in muted color */}
              <span className="text-text-muted/50 select-none text-[9px] mt-0.5">{log.timestamp}</span>
              <span>
                <span className="select-none font-bold opacity-75">{getLinePrefix(log.type)}</span>
                {log.text}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer / Interactive cursor bar */}
      <div className="border-t border-border-custom/50 pt-2.5 mt-2.5 flex items-center justify-between text-[9px] text-text-muted select-none">
        <div className="flex items-center gap-1.5">
          {isRunning ? (
            <>
              <span className="text-brand font-bold text-[11px] animate-pulse">
                {SPINNER_CHARS[spinnerIdx]}
              </span>
              <span className="font-semibold tracking-wider uppercase text-[8px] bg-brand-soft text-brand-strong px-1 rounded">
                RUNNING
              </span>
            </>
          ) : (
            <>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-text-muted" />
              <span className="font-semibold tracking-wider uppercase text-[8px] bg-bg-base text-text-muted px-1 rounded border border-border-strong">
                IDLE
              </span>
            </>
          )}
          {/* Flashing Cursor block simulation */}
          {isRunning && (
            <span className="w-1.5 h-3.5 bg-brand-strong/80 ml-1.5 animate-cursor-blink inline-block align-middle" />
          )}
        </div>
        <span>Coreberg CLI Router v2.0</span>
      </div>

      <style jsx global>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-cursor-blink {
          animation: cursor-blink 1s step-end infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}
