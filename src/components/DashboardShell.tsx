'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDemoStore } from '@/store/demoStore';
import { 
  Cpu, 
  MessageSquare, 
  Share2, 
  TrendingUp, 
  Search, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  ChevronRight,
  Send,
  X
} from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Zustand selectors
  const isPlaying = useDemoStore((state) => state.isPlaying);
  const startDemo = useDemoStore((state) => state.startDemo);
  const pauseDemo = useDemoStore((state) => state.pauseDemo);
  const resetDemo = useDemoStore((state) => state.resetDemo);
  const stepForward = useDemoStore((state) => state.stepForward);
  const tick = useDemoStore((state) => state.tick);
  const autoStart = useDemoStore((state) => state.autoStart);
  
  // Local state for chat drawer
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: 'model', content: 'Coreberg Orchestrator のデモ環境へようこそ。どのようなことについてお答えしましょうか？' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Derive agent context based on pathname
  const getContextName = () => {
    if (pathname.startsWith('/social')) return 'social';
    if (pathname.startsWith('/ads')) return 'ads';
    if (pathname.startsWith('/llmo')) return 'llmo';
    return 'dashboard';
  };

  const getContextLabel = () => {
    if (pathname.startsWith('/social')) return 'SNSエージェント';
    if (pathname.startsWith('/ads')) return '広告エージェント';
    if (pathname.startsWith('/llmo')) return 'LLMOエージェント';
    return 'Orchestrator';
  };

  // Run initial reset & autoStart check
  useEffect(() => {
    resetDemo();
    if (autoStart) {
      // Small timeout to let hydration complete smoothly
      const timer = setTimeout(() => {
        startDemo();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoStart]);

  // Unified engine loop using requestAnimationFrame
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number;

    const loop = (time: number) => {
      const dt = time - lastTime;
      lastTime = time;
      
      // Safety cap: don't tick more than 1 second at once to avoid giant jumps on tab unfocus
      if (dt > 0 && dt < 1000) {
        tick(dt);
      }
      
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [tick]);

  // Keyboard shortcuts listener for recording convenience (., r, s)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in an input/textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === '.') {
        e.preventDefault();
        if (isPlaying) {
          pauseDemo();
        } else {
          startDemo();
        }
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        resetDemo();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        stepForward();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, startDemo, pauseDemo, resetDemo, stepForward]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  // Chat message submit handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, { role: 'user', content: userText }],
          agentContext: getContextName()
        })
      });

      if (!response.body) throw new Error('ReadableStream not supported');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      setChatMessages((prev) => [...prev, { role: 'model', content: '' }]);
      setIsTyping(false);

      let accumulatedResponse = '';
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunkText = decoder.decode(value);
        accumulatedResponse += chunkText;
        
        setChatMessages((prev) => {
          const updated = [...prev];
          if (updated.length > 0) {
            updated[updated.length - 1] = {
              role: 'model',
              content: accumulatedResponse
            };
          }
          return updated;
        });
      }

    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages((prev) => [
        ...prev, 
        { role: 'model', content: '現在デモ環境のチャットサーバーと接続できません。モックアップは正常に動作しています。' }
      ]);
      setIsTyping(false);
    }
  };

  const menuItems = [
    { name: 'Orchestrator', path: '/', icon: Cpu },
    { name: 'SNS Agent', path: '/social', icon: Share2 },
    { name: 'Ad Agent', path: '/ads', icon: TrendingUp },
    { name: 'LLMO Agent', path: '/llmo', icon: Search }
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-base font-sans select-none">
      
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-60 border-r border-border-custom bg-bg-surface flex flex-col justify-between z-10">
        <div>
          {/* Logo Brand Header */}
          <div className="h-16 px-6 border-b border-border-custom flex items-center gap-3.5">
            <div className="h-8 w-8 rounded-lg bg-brand flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-lg select-none">C</span>
            </div>
            <div>
              <span className="font-bold text-text-primary text-base tracking-tight">Coreberg</span>
              <span className="text-[10px] text-brand font-semibold tracking-wider uppercase ml-1.5 px-1 bg-brand-soft rounded">DEMO</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                    isActive 
                      ? 'bg-brand-soft text-brand-strong font-medium border-l-2 border-brand' 
                      : 'text-text-secondary hover:bg-bg-subtle hover:text-text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-brand-strong' : 'text-text-muted group-hover:text-text-secondary'
                    }`} strokeWidth={1.5} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-strong" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Admin option hidden discreetly) */}
        <div className="p-4 border-t border-border-custom bg-bg-subtle/50 space-y-3">
          {/* Internal Hidden shortcut helper */}
          <div className="text-[10px] text-text-muted/60 leading-normal px-2">
            <div>デモ操作（キーボード）:</div>
            <div className="flex justify-between mt-1">
              <span>再生/一時停止</span>
              <kbd className="px-1 bg-bg-surface border border-border-strong rounded">.</kbd>
            </div>
            <div className="flex justify-between">
              <span>リセット</span>
              <kbd className="px-1 bg-bg-surface border border-border-strong rounded">R</kbd>
            </div>
            <div className="flex justify-between">
              <span>ステップ送り</span>
              <kbd className="px-1 bg-bg-surface border border-border-strong rounded">S</kbd>
            </div>
          </div>

          <Link
            href="/admin"
            className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[11px] font-medium transition-all ${
              pathname === '/admin'
                ? 'bg-text-primary text-bg-surface'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-subtle'
            }`}
          >
            <Settings className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Playback Settings & Preset</span>
          </Link>
        </div>
      </aside>

      {/* 2. Main Content View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className="h-16 border-b border-border-custom bg-bg-surface px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-text-primary tracking-tight">
              {pathname === '/' ? 'Marketing Orchestrator' : menuItems.find(m => m.path === pathname)?.name || 'Admin Console'}
            </h1>
            
            {/* Visual active playback indicator (subtle) */}
            {isPlaying && (
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Ask Follow-up Trigger Button */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border-custom bg-bg-surface text-text-secondary hover:bg-bg-subtle hover:text-text-primary transition-all text-xs font-semibold shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-brand" strokeWidth={1.8} />
              <span>Ask Follow-up</span>
              <span className="text-[9px] px-1.5 py-0.5 bg-brand-soft text-brand-strong rounded-full">
                {getContextLabel()}
              </span>
            </button>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto relative bg-bg-base focus:outline-none">
          {children}
        </main>
      </div>

      {/* 3. Gemini Ask Follow-up Slide-out Drawer */}
      {isChatOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsChatOpen(false)}
        />
      )}
      <aside 
        className={`fixed top-0 right-0 h-full w-96 bg-bg-surface border-l border-border-custom shadow-lg z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-16 px-6 border-b border-border-custom flex items-center justify-between bg-bg-subtle/30">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4.5 h-4.5 text-brand" strokeWidth={1.8} />
            <div>
              <h2 className="text-sm font-bold text-text-primary">Ask Follow-up</h2>
              <p className="text-[10px] text-text-muted font-medium mt-0.5">Coreberg AI {getContextLabel()}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsChatOpen(false)}
            className="p-1.5 rounded-md hover:bg-bg-subtle text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <X className="w-4.5 h-4.5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Drawer Messages list */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-text-primary text-bg-surface' 
                    : 'bg-bg-subtle text-text-secondary border border-border-custom'
                }`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-1.5 pl-2 py-2">
              <span className="h-2 w-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Drawer Input form */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-border-custom bg-bg-subtle/10 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="エージェントの仕組みについて質問する..."
            className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-border-custom bg-bg-surface placeholder:text-text-muted text-text-primary focus:outline-none focus:border-brand-strong transition-colors"
          />
          <button
            type="submit"
            className="p-2 bg-text-primary text-bg-surface hover:bg-brand-strong hover:text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </aside>

    </div>
  );
}
