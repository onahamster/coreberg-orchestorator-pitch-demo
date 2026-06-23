'use client';

import React from 'react';
import Link from 'next/link';
import { useDemoStore } from '@/store/demoStore';
import TerminalLog from '@/components/TerminalLog';
import { 
  Share2, 
  TrendingUp, 
  Search, 
  ArrowRight,
  Brain,
  CheckCircle
} from 'lucide-react';

export default function OrchestratorPage() {
  const isPlaying = useDemoStore((state) => state.isPlaying);
  const activeScenarioId = useDemoStore((state) => state.activeScenarioId);
  const scenarios = useDemoStore((state) => state.scenarios);
  const orchestratorProgress = useDemoStore((state) => state.orchestratorProgress);

  // Active Scenario Content
  const scenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  // Agent States
  const socialState = useDemoStore((state) => state.socialState);
  const socialMetrics = useDemoStore((state) => state.socialMetrics);
  
  const adsState = useDemoStore((state) => state.adsState);
  const adsMetrics = useDemoStore((state) => state.adsMetrics);

  const llmoState = useDemoStore((state) => state.llmoState);
  const llmoScores = useDemoStore((state) => state.llmoScores);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(val);
  };

  // Get average LLMO score
  const getAverageLlmoScore = () => {
    const scores = Object.values(llmoScores);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  // Determine active task/step name based on tasks list status
  const getAgentRunningTask = (tasks: any[]) => {
    const running = tasks.find(t => t.status === 'running');
    if (running) return running.label;
    const allCompleted = tasks.every(t => t.status === 'completed');
    if (allCompleted) return '全タスク最適化完了';
    return '起動準備完了';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      
      {/* Topology Map and Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Coreberg Orchestrator Map */}
        <div className="lg:col-span-7 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[460px]">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xs font-semibold text-text-secondary tracking-wider uppercase">SYSTEM TOPOLOGY</h3>
                <h2 className="text-lg font-bold text-text-primary mt-1">Autonomous Execution Graph</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-brand-soft rounded-full text-[11px] font-semibold text-brand-strong">
                <span>Total Progress: {orchestratorProgress}%</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed max-w-md">
              商品情報をインプットとするだけで、全体戦略AIが各チャネル（SNS、広告、LLMO対策）への最適な予算アロケーションとクリエイティブ戦略を自律設計・実行します。
            </p>
          </div>

          {/* SVG Animated Connection Topology */}
          <div className="my-6 relative flex items-center justify-center">
            <svg className="w-full max-w-[550px] h-[220px]" viewBox="0 0 550 220" fill="none">
              {/* Connection Lines */}
              <path d="M 275,32 L 275,76" stroke="#E6EDED" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M 275,116 L 275,142" stroke="#E6EDED" strokeWidth="2" />
              <path d="M 275,142 L 80,142 L 80,166" stroke="#E6EDED" strokeWidth="2" />
              <path d="M 275,142 L 275,166" stroke="#E6EDED" strokeWidth="2" />
              <path d="M 275,142 L 470,142 L 470,166" stroke="#E6EDED" strokeWidth="2" />

              {/* Data Flow Particles (Running animateMotion only when playing) */}
              {isPlaying && (
                <>
                  <circle r="3.5" fill="#0bbfca">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 275,32 L 275,76" />
                  </circle>
                  <circle r="3.5" fill="#0bbfca">
                    <animateMotion dur="4.5s" begin="0.5s" repeatCount="indefinite" path="M 275,116 L 275,142 L 80,142 L 80,166" />
                  </circle>
                  <circle r="3.5" fill="#0bbfca">
                    <animateMotion dur="4.5s" begin="1.5s" repeatCount="indefinite" path="M 275,116 L 275,142 L 275,166" />
                  </circle>
                  <circle r="3.5" fill="#0bbfca">
                    <animateMotion dur="4.5s" begin="2.5s" repeatCount="indefinite" path="M 275,116 L 275,142 L 470,142 L 470,166" />
                  </circle>
                </>
              )}

              {/* Nodes definitions */}
              {/* Node 1: Product Data */}
              <g transform="translate(195, 2)">
                <rect width="160" height="30" rx="6" fill="#FFFFFF" stroke="#D2DCDC" strokeWidth="1" />
                <text x="80" y="19" textAnchor="middle" fill="#0E1A1B" fontSize="10" fontWeight="bold">Input: Product Metadata</text>
              </g>

              {/* Node 2: Core Strategy AI */}
              <g transform="translate(195, 76)">
                <rect width="160" height="40" rx="8" fill="#F4F8F8" stroke="#0bbfca" strokeWidth="1.5" />
                <text x="80" y="24" textAnchor="middle" fill="#0892a0" fontSize="11" fontWeight="bold">Core Strategist AI</text>
              </g>

              {/* Node 3: SNS Agent */}
              <g transform="translate(20, 166)">
                <rect width="120" height="42" rx="6" fill="#FFFFFF" stroke={socialState.status !== 'idle' ? '#0bbfca' : '#E6EDED'} strokeWidth="1" />
                <text x="60" y="21" textAnchor="middle" fill="#5A6A6B" fontSize="10" fontWeight="bold">SNS Agent</text>
                <text x="60" y="33" textAnchor="middle" fill={socialState.status === 'completed' ? '#0d9f6e' : '#93A1A1'} fontSize="8">
                  {socialState.status === 'completed' ? '✓ Optimized' : isPlaying ? 'Running...' : 'Idle'}
                </text>
              </g>

              {/* Node 4: Ad Agent */}
              <g transform="translate(215, 166)">
                <rect width="120" height="42" rx="6" fill="#FFFFFF" stroke={adsState.status !== 'idle' ? '#0bbfca' : '#E6EDED'} strokeWidth="1" />
                <text x="60" y="21" textAnchor="middle" fill="#5A6A6B" fontSize="10" fontWeight="bold">Ad Campaign Agent</text>
                <text x="60" y="33" textAnchor="middle" fill={adsState.status === 'completed' ? '#0d9f6e' : '#93A1A1'} fontSize="8">
                  {adsState.status === 'completed' ? '✓ Optimized' : isPlaying ? 'Running...' : 'Idle'}
                </text>
              </g>

              {/* Node 5: LLMO Agent */}
              <g transform="translate(410, 166)">
                <rect width="120" height="42" rx="6" fill="#FFFFFF" stroke={llmoState.status !== 'idle' ? '#0bbfca' : '#E6EDED'} strokeWidth="1" />
                <text x="60" y="21" textAnchor="middle" fill="#5A6A6B" fontSize="10" fontWeight="bold">LLMO Optimizer</text>
                <text x="60" y="33" textAnchor="middle" fill={llmoState.status === 'completed' ? '#0d9f6e' : '#93A1A1'} fontSize="8">
                  {llmoState.status === 'completed' ? '✓ Citations Updated' : isPlaying ? 'Running...' : 'Idle'}
                </text>
              </g>
            </svg>
          </div>

          <div className="border-t border-border-custom pt-4 mt-auto">
            <span className="text-[10px] text-text-muted leading-relaxed">
              Coreberg Orchestratorは、各チャネルの実行APIエンドポイントと常時接続し、リアルタイムデータに基づいて自律最適化を実行しています。
            </span>
          </div>

        </div>

        {/* Right Col: Active Product Profile Context */}
        <div className="lg:col-span-5 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm min-h-[460px] flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-text-secondary tracking-wider uppercase mb-1">ACTIVE CAMPAIGN PROFILE</h3>
            <h2 className="text-lg font-bold text-text-primary mb-4">Target Brand Config</h2>
            
            <div className="space-y-4">
              {/* Product Card */}
              <div className="flex gap-4 p-4 rounded-xl bg-bg-subtle border border-border-custom">
                {scenario.product.images[0] && (
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-border-strong flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={scenario.product.images[0]} 
                      alt={scenario.product.name} 
                      className="w-full h-full object-cover animate-fade-in" 
                    />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-text-primary text-sm">{scenario.product.name}</h4>
                  <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                    {scenario.product.description}
                  </p>
                </div>
              </div>

              {/* Status List */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs border-b border-border-custom pb-2.5">
                  <span className="text-text-secondary">SNS Agent Status:</span>
                  <span className={`font-semibold ${socialState.status === 'completed' ? 'text-positive' : 'text-brand-strong animate-pulse'}`}>
                    {getAgentRunningTask(socialState.tasks)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs border-b border-border-custom pb-2.5">
                  <span className="text-text-secondary">Ad Campaign Status:</span>
                  <span className={`font-semibold ${adsState.status === 'completed' ? 'text-positive' : 'text-brand-strong animate-pulse'}`}>
                    {getAgentRunningTask(adsState.tasks)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary">LLMO Optimizer Status:</span>
                  <span className={`font-semibold ${llmoState.status === 'completed' ? 'text-positive' : 'text-brand-strong animate-pulse'}`}>
                    {getAgentRunningTask(llmoState.tasks)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-bg-subtle/80 border border-border-custom rounded-xl p-4 mt-6">
            <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-positive" />
              <span>「週に1回、成果を確認するだけ」</span>
            </h4>
            <p className="text-[11px] text-text-secondary leading-relaxed mt-1.5">
              本エージェント群は完全自律型で稼働するため、人の承認や調整は不要です。人間は結果のサマリーを確認するのみでスケールします。
            </p>
          </div>
        </div>

      </section>

      {/* Mini terminal logging consoles for each agent */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-text-secondary tracking-wider uppercase">AGENT RAW CLI FEED</h3>
          <h2 className="text-lg font-bold text-text-primary mt-1">Real-time Executions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs px-1 font-bold text-text-secondary">
              <span>SNS Agent Console</span>
              <span className="text-[10px] text-brand-strong">/social</span>
            </div>
            <TerminalLog 
              logs={socialState.logs} 
              isRunning={socialState.status === 'running'} 
              maxHeightClass="h-44" 
              placeholderText="SNS企画スレッド立ち上げ待機中..." 
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs px-1 font-bold text-text-secondary">
              <span>Ad Campaign Console</span>
              <span className="text-[10px] text-brand-strong">/ads</span>
            </div>
            <TerminalLog 
              logs={adsState.logs} 
              isRunning={adsState.status === 'running'} 
              maxHeightClass="h-44" 
              placeholderText="Ad入札ポート同期待機中..." 
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs px-1 font-bold text-text-secondary">
              <span>LLMO Optimizer Console</span>
              <span className="text-[10px] text-brand-strong">/llmo</span>
            </div>
            <TerminalLog 
              logs={llmoState.logs} 
              isRunning={llmoState.status === 'running'} 
              maxHeightClass="h-44" 
              placeholderText="AIインデックススキャン監査待機中..." 
            />
          </div>
        </div>
      </section>

      {/* Integrated Dashboard Metrics Summary */}
      <section className="space-y-4">
        <div>
          <h3 className="text-xs font-semibold text-text-secondary tracking-wider uppercase">INTEGRATED DASHBOARD</h3>
          <h2 className="text-lg font-bold text-text-primary mt-1">Cross-Channel Analytics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* SNS Performance summary card */}
          <Link href="/social" className="group bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm hover:border-brand transition-all duration-300 block relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-soft rounded-lg text-brand-strong">
                <Share2 className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] text-text-muted font-bold group-hover:text-brand transition-colors flex items-center gap-1">
                <span>View SNS Details</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
            
            <h4 className="text-xs font-semibold text-text-secondary">SNS Engagement & Reach</h4>
            
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary tabular-nums tracking-tight">
                {socialMetrics.reach.toFixed(1)}x
              </span>
              <span className="text-xs text-positive font-semibold">リーチ倍率</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4 border-t border-border-custom pt-3 text-[11px]">
              <div>
                <div className="text-text-secondary">保存数増加</div>
                <div className="font-bold text-text-primary tabular-nums mt-0.5">{socialMetrics.save.toFixed(1)}倍</div>
              </div>
              <div>
                <div className="text-text-secondary">平均保存率</div>
                <div className="font-bold text-text-primary tabular-nums mt-0.5">{socialMetrics.saveRate.toFixed(2)}%</div>
              </div>
            </div>
          </Link>

          {/* Ad Performance summary card */}
          <Link href="/ads" className="group bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm hover:border-brand transition-all duration-300 block relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-soft rounded-lg text-brand-strong">
                <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] text-text-muted font-bold group-hover:text-brand transition-colors flex items-center gap-1">
                <span>View Ad Console</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <h4 className="text-xs font-semibold text-text-secondary">Sales & Ad Performance</h4>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary tabular-nums tracking-tight">
                {formatCurrency(adsMetrics.sales)}
              </span>
              <span className="text-xs text-positive font-semibold">売上高</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4 border-t border-border-custom pt-3 text-[11px]">
              <div>
                <div className="text-text-secondary">獲得単価 (CPA)</div>
                <div className="font-bold text-negative tabular-nums mt-0.5">{formatCurrency(adsMetrics.cpa)}</div>
              </div>
              <div>
                <div className="text-text-secondary">広告費用対効果 (ROAS)</div>
                <div className="font-bold text-text-primary tabular-nums mt-0.5">{adsMetrics.roas.toFixed(1)}x</div>
              </div>
            </div>
          </Link>

          {/* LLMO performance summary card */}
          <Link href="/llmo" className="group bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm hover:border-brand transition-all duration-300 block relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-brand-soft rounded-lg text-brand-strong">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] text-text-muted font-bold group-hover:text-brand transition-colors flex items-center gap-1">
                <span>View LLMO Details</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            <h4 className="text-xs font-semibold text-text-secondary">AI Brand Visibility</h4>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary tabular-nums tracking-tight">
                {getAverageLlmoScore()}%
              </span>
              <span className="text-xs text-positive font-semibold">主要LLM 平均推奨率</span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4 border-t border-border-custom pt-3 text-[11px]">
              <div>
                <div className="text-text-secondary">ChatGPT (GPT-5.5)</div>
                <div className="font-bold text-text-primary tabular-nums mt-0.5">
                  {llmoScores['GPT-5.5'] || 0}%
                </div>
              </div>
              <div>
                <div className="text-text-secondary">Claude 4.8</div>
                <div className="font-bold text-text-primary tabular-nums mt-0.5">
                  {llmoScores['Claude Opus 4.8'] || 0}%
                </div>
              </div>
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}
