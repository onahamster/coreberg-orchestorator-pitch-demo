'use client';

import React, { useState, useEffect } from 'react';
import { useDemoStore } from '@/store/demoStore';
import TerminalLog from '@/components/TerminalLog';
import { 
  BarChart3, 
  Settings, 
  FileText, 
  CheckCircle2, 
  HelpCircle, 
  AlertCircle, 
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Clock,
  Cpu
} from 'lucide-react';

export default function LlmoAgentPage() {
  const activeScenarioId = useDemoStore((state) => state.activeScenarioId);
  const scenarios = useDemoStore((state) => state.scenarios);
  const scenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  // Zustand states for LLMO (v2.0 Event-driven)
  const llmoState = useDemoStore((state) => state.llmoState);
  const scores = useDemoStore((state) => state.llmoScores);
  const queries = useDemoStore((state) => state.llmoQueries);
  const actions = useDemoStore((state) => state.llmoActions);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'visibility' | 'actions' | 'citations'>('visibility');

  // Auto-switch tabs based on task progress to showcase the flow naturally
  const l2Task = llmoState.tasks.find(t => t.id === 'l2');
  const l3Task = llmoState.tasks.find(t => t.id === 'l3');
  useEffect(() => {
    if (l3Task?.status === 'running' || l3Task?.status === 'completed') {
      setActiveTab('citations');
    } else if (l2Task?.status === 'running' || l2Task?.status === 'completed') {
      setActiveTab('actions');
    } else {
      setActiveTab('visibility');
    }
  }, [l2Task?.status, l3Task?.status]);

  // Derive average visibility score
  const getAverageScore = () => {
    const vals = Object.values(scores);
    if (vals.length === 0) return 0;
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  };

  // Derive completed tasks count
  const getCompletedTasksCount = () => {
    return llmoState.tasks.filter(t => t.status === 'completed').length;
  };

  // Model branding colors/styling map
  const getModelDetails = (model: string) => {
    const m = model.toLowerCase();
    if (m.includes('gpt')) {
      return { label: 'OpenAI', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    }
    if (m.includes('gemini')) {
      return { label: 'Google', bg: 'bg-blue-50 text-blue-700 border-blue-100' };
    }
    if (m.includes('claude')) {
      return { label: 'Anthropic', bg: 'bg-orange-50 text-orange-700 border-orange-100' };
    }
    return { label: 'Perplexity', bg: 'bg-teal-50 text-teal-700 border-teal-100' };
  };

  // Helper to highlight the brand name in after citation
  const highlightBrand = (text: string, brandName: string) => {
    const parts = text.split(new RegExp(`(${brandName})`, 'g'));
    return (
      <span>
        {parts.map((part, i) => 
          part === brandName 
            ? <mark key={i} className="bg-brand-soft text-brand-strong font-bold px-1 rounded border border-brand/10">{part}</mark>
            : part
        )}
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Page Header and Tab Nav */}
      <section className="bg-bg-surface border border-border-custom rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-soft text-brand-strong rounded-xl">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-text-secondary tracking-wider uppercase">AI Search Optimization</h2>
            <h1 className="text-lg font-bold text-text-primary mt-0.5">LLM Recommendation Optimizer</h1>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-bg-subtle p-1 rounded-lg border border-border-custom self-start">
          <button
            onClick={() => setActiveTab('visibility')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'visibility' 
                ? 'bg-bg-surface text-text-primary shadow-sm' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>AI Visibility Score</span>
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer relative ${
              activeTab === 'actions' 
                ? 'bg-bg-surface text-text-primary shadow-sm' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Optimization Actions</span>
            {l2Task?.status === 'running' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('citations')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'citations' 
                ? 'bg-bg-surface text-text-primary shadow-sm' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Citation Monitoring</span>
          </button>
        </div>
      </section>

      {/* Main Grid: Control & Logs Left, Tab Content Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col (5 cols): Orchestrator Console & Tasks */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* CLI Terminal Container */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-text-secondary px-1.5">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-brand" />
                Orchestrator Log Stream (stdout)
              </span>
              <span className="text-[10px] font-mono text-text-muted">Jitter: Active</span>
            </div>
            <TerminalLog 
              logs={llmoState.logs} 
              isRunning={llmoState.status === 'running'} 
              maxHeightClass="h-72" 
              placeholderText="AIインデックススキャン監査待機中..." 
            />
          </div>

          {/* Subtask Checkbox List */}
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase mb-4">EXECUTION PIPELINE</h3>
            
            <div className="space-y-3">
              {llmoState.tasks.map((task) => {
                const isPending = task.status === 'pending';
                const isRunning = task.status === 'running';
                const isCompleted = task.status === 'completed';

                return (
                  <div 
                    key={task.id} 
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all duration-300 ${
                      isCompleted 
                        ? 'border-positive/20 bg-positive/5' 
                        : isRunning 
                          ? 'border-brand bg-brand-soft/20 shadow-xs' 
                          : 'border-border-custom bg-bg-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1 rounded-lg ${
                        isCompleted 
                          ? 'bg-positive/10 text-positive' 
                          : isRunning 
                            ? 'bg-brand text-white animate-pulse' 
                            : 'bg-bg-subtle text-text-muted'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isRunning ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <span className={`text-xs font-bold ${
                        isCompleted 
                          ? 'text-text-secondary line-through' 
                          : isRunning 
                            ? 'text-text-primary font-bold' 
                            : 'text-text-muted'
                      }`}>
                        {task.label}
                      </span>
                    </div>

                    {isCompleted && task.elapsed && (
                      <span className="text-[10px] text-positive font-mono font-bold bg-positive/10 px-1.5 py-0.5 rounded">
                        {task.elapsed}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Col (7 cols): Active Tab Panel Content */}
        <div className="lg:col-span-7">
          
          {/* Tab 1: Visibility Score */}
          {activeTab === 'visibility' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Radial Gauge */}
                <div className="md:col-span-5 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col justify-between items-center text-center">
                  <div>
                    <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase">AUDIT RESULT</h3>
                    <h2 className="text-sm font-bold text-text-primary mt-1">Average LLM Visibility</h2>
                  </div>

                  <div className="my-4 relative flex items-center justify-center">
                    <svg className="w-28 h-28" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" stroke="#E6EDED" strokeWidth="6" fill="none" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="42" 
                        stroke="#0bbfca" 
                        strokeWidth="6" 
                        fill="none" 
                        strokeDasharray="264"
                        strokeDashoffset={264 - (264 * getAverageScore()) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-500 ease-out"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-extrabold text-text-primary tabular-nums tracking-tight">
                        {getAverageScore()}%
                      </span>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider mt-0.5">Visibility</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-text-secondary leading-relaxed">
                    ChatGPT / Gemini / Claude 等の対話AI内でのブランド推奨出現比率。
                  </div>
                </div>

                {/* Bars breakdown */}
                <div className="md:col-span-7 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase">MODEL BREAKDOWN</h3>
                    <h2 className="text-sm font-bold text-text-primary mt-1">AI Citation Rate</h2>
                  </div>

                  <div className="space-y-4 my-4 flex-1 flex flex-col justify-center">
                    {scenario.llmo.visibilityScores.map((modelScore) => {
                      const currentScore = scores[modelScore.model] || modelScore.score;
                      const details = getModelDetails(modelScore.model);
                      
                      return (
                        <div key={modelScore.model} className="space-y-1.5">
                          <div className="flex justify-between items-baseline text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`px-1.5 py-0.5 text-[9px] font-bold border rounded font-mono ${details.bg}`}>
                                {details.label}
                              </span>
                              <span className="font-bold text-text-primary">{modelScore.model}</span>
                            </div>
                            <span className="font-bold text-text-primary tabular-nums">{currentScore}%</span>
                          </div>
                          
                          <div className="h-2 w-full bg-bg-subtle rounded-full overflow-hidden border border-border-custom">
                            <div 
                              className="h-full bg-brand rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${currentScore}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[10px] text-text-muted flex justify-between border-t border-border-custom pt-3">
                    <span>目標値: 平均推奨率 70% 超</span>
                    {llmoState.status === 'running' && (
                      <span className="flex items-center gap-1 font-semibold animate-pulse text-brand">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        インデックス最適化中...
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Targeted Queries status list */}
              <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-text-primary text-sm">主要検索クエリ検証（対話型検索 AI）</h3>
                  <span className="text-[10px] text-text-muted font-mono">Real-time LLM Output Check</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border-custom text-text-muted uppercase text-[10px] font-bold">
                        <th className="pb-3 font-semibold">調査ターゲットクエリ</th>
                        <th className="pb-3 font-semibold">自社ブランド露出ステータス</th>
                        <th className="pb-3 font-semibold text-right">推奨信頼度</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-custom font-medium">
                      {queries.map((q) => {
                        const isYes = q.appeared === 'yes';
                        const isPartial = q.appeared === 'partial';

                        return (
                          <tr key={q.query} className="text-text-secondary">
                            <td className="py-3 text-text-primary font-bold">{q.query}</td>
                            <td className="py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                isYes 
                                  ? 'bg-positive/10 text-positive' 
                                  : isPartial 
                                    ? 'bg-warning/10 text-warning' 
                                    : 'bg-negative/10 text-negative'
                              }`}>
                                {isYes && <CheckCircle2 className="w-3 h-3" />}
                                {isPartial && <HelpCircle className="w-3 h-3" />}
                                {!isYes && !isPartial && <AlertCircle className="w-3 h-3" />}
                                {isYes ? '推奨出現 ✓' : isPartial ? '関連候補として言及' : '言及なし'}
                              </span>
                            </td>
                            <td className="py-3 text-right tabular-nums">
                              {isYes ? 'High (88%)' : isPartial ? 'Medium (54%)' : 'None (12%)'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Optimization Actions */}
          {activeTab === 'actions' && (
            <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
              <div className="flex justify-between items-start border-b border-border-custom pb-3">
                <div>
                  <h3 className="font-bold text-text-primary text-sm">セマンティック最適化アクション</h3>
                  <p className="text-xs text-text-secondary mt-1">LLMインデックスに対してブランド・エンティティ構造を最適化します</p>
                </div>
              </div>

              <div className="space-y-4">
                {actions.map((action) => {
                  const isPending = action.status === 'pending';
                  const isRunning = action.status === 'running';
                  const isCompleted = action.status === 'completed';

                  return (
                    <div 
                      key={action.id} 
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all duration-300 ${
                        isCompleted 
                          ? 'border-positive/20 bg-positive/5' 
                          : isRunning 
                            ? 'border-brand bg-brand-soft/20 shadow-xs' 
                            : 'border-border-custom bg-bg-surface'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${
                          isCompleted 
                            ? 'bg-positive/10 text-positive' 
                            : isRunning 
                              ? 'bg-brand text-white' 
                              : 'bg-bg-subtle text-text-muted'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : isRunning ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-text-muted/60" />
                          )}
                        </div>
                        <span className={`text-xs font-semibold ${isCompleted ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                          {action.label}
                        </span>
                      </div>

                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        isCompleted 
                          ? 'bg-positive/10 text-positive' 
                          : isRunning 
                            ? 'bg-brand text-white animate-pulse' 
                            : 'bg-bg-subtle text-text-muted'
                      }`}>
                        {isCompleted && '完了 ✓'}
                        {isRunning && '最適化中'}
                        {isPending && '待機中'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 bg-bg-subtle border border-border-custom rounded-xl text-text-secondary text-[10px] flex justify-between items-center">
                <span>アクションの完了状況に応じて、「AI Visibility Score」がリアルタイムに引き上げられます。</span>
              </div>
            </div>
          )}

          {/* Tab 3: Citation Monitoring */}
          {activeTab === 'citations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center border-b border-border-custom pb-3 bg-bg-surface p-4 rounded-2xl border">
                <div>
                  <h2 className="text-sm font-bold text-text-primary">推奨引用ビフォーアフター監査</h2>
                  <p className="text-xs text-text-secondary mt-1">構造化インデックス反映後、LLMが回答をアップデートした証跡</p>
                </div>
                <span className="text-[10px] px-2.5 py-1 bg-positive/10 text-positive rounded-full font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Citations Verified</span>
                </span>
              </div>

              <div className="space-y-6">
                {scenario.llmo.citations.map((cit) => (
                  <div key={cit.id} className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-text-primary text-xs flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-brand rounded-full" />
                        {cit.source}
                      </h3>
                      <span className="text-[9px] text-text-muted font-mono">ID: {cit.id}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      
                      {/* Before card */}
                      <div className="p-4 rounded-xl border border-border-custom bg-bg-subtle/40 text-left flex flex-col justify-between">
                        <div>
                          <div className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-2">Before (対策前)</div>
                          <p className="text-xs text-text-secondary leading-relaxed">
                            {cit.contentBefore}
                          </p>
                        </div>
                        <div className="text-[9px] text-negative font-semibold mt-3 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>自社ブランド名への言及がありません</span>
                        </div>
                      </div>

                      {/* After card */}
                      <div className="p-4 rounded-xl border border-brand/20 bg-brand-soft/5 text-left flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1.5 bg-brand-soft text-brand-strong rounded-bl-lg">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>

                        <div>
                          <div className="text-[9px] font-bold text-brand-strong uppercase tracking-wider mb-2">After (対策後)</div>
                          <p className="text-xs text-text-primary leading-relaxed">
                            {highlightBrand(cit.contentAfter, scenario.product.name)}
                          </p>
                        </div>
                        
                        <div className="text-[9px] text-positive font-semibold mt-3 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>自社ブランド名が推奨引用として追加・インデックス化されました</span>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
