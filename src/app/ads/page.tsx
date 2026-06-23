'use client';

import React, { useState, useEffect } from 'react';
import { useDemoStore } from '@/store/demoStore';
import TerminalLog from '@/components/TerminalLog';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Settings2, 
  Sparkles, 
  BarChart3, 
  CheckCircle, 
  Link as LinkIcon, 
  RefreshCw,
  Play,
  Clock,
  Cpu
} from 'lucide-react';

const MetaIcon = () => (
  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-6 h-6 text-red-500 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
  </svg>
);


export default function AdsAgentPage() {
  const activeScenarioId = useDemoStore((state) => state.activeScenarioId);
  const scenarios = useDemoStore((state) => state.scenarios);
  const scenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  // Zustand states for Ads (v2.0 Event-driven)
  const adsState = useDemoStore((state) => state.adsState);
  const campaigns = useDemoStore((state) => state.adsCampaigns);
  const metrics = useDemoStore((state) => state.adsMetrics);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'connections' | 'generate' | 'dashboard'>('generate');

  // SSR hydration safety for Recharts
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-switch tabs based on task progress to showcase the flow naturally
  const a4Task = adsState.tasks.find(t => t.id === 'a4');
  useEffect(() => {
    if (a4Task?.status === 'running' || a4Task?.status === 'completed') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('generate');
    }
  }, [a4Task?.status]);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 }).format(val);
  };

  // Recharts line chart data (Smooth, deterministic progression based on metrics.sales)
  const getLineData = () => {
    const totalSales = metrics.sales;
    const coefficients = [0, 0.12, 0.28, 0.45, 0.62, 0.81, 1.0];
    return [
      { name: 'Day 1', Sales: Math.round(totalSales * coefficients[0]) },
      { name: 'Day 2', Sales: Math.round(totalSales * coefficients[1]) },
      { name: 'Day 3', Sales: Math.round(totalSales * coefficients[2]) },
      { name: 'Day 4', Sales: Math.round(totalSales * coefficients[3]) },
      { name: 'Day 5', Sales: Math.round(totalSales * coefficients[4]) },
      { name: 'Day 6', Sales: Math.round(totalSales * coefficients[5]) },
      { name: 'Day 7', Sales: Math.round(totalSales * coefficients[6]) }
    ];
  };

  // Recharts donut chart data
  const pieData = [
    { name: 'Meta Ads', value: Math.round(metrics.sales * 0.55) },
    { name: 'Google Ads', value: Math.round(metrics.sales * 0.30) },
    { name: 'TikTok Ads', value: Math.round(metrics.sales * 0.15) }
  ];
  
  const COLORS = ['#0bbfca', '#0892a0', '#D2DCDC'];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Page Header and Tab Nav */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-custom pb-5">
        <div>
          <h2 className="text-xs font-semibold text-text-secondary tracking-wider uppercase">Marketing Channels</h2>
          <h1 className="text-lg font-bold text-text-primary mt-1">Paid Ads Automation</h1>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-bg-subtle p-1 rounded-lg border border-border-custom self-start">
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'connections' 
                ? 'bg-bg-surface text-text-primary shadow-sm' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>API Connections</span>
          </button>
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer relative ${
              activeTab === 'generate' 
                ? 'bg-bg-surface text-text-primary shadow-sm' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campaign Generator</span>
            {adsState.status === 'running' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand rounded-full animate-ping" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-bg-surface text-text-primary shadow-sm' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Performance Analytics</span>
          </button>
        </div>
      </section>

      {/* 1. Connections Tab */}
      {activeTab === 'connections' && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Meta Card */}
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <MetaIcon />
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  scenario.ads.connections.Meta 
                    ? 'bg-positive/10 text-positive' 
                    : 'bg-bg-subtle text-text-muted'
                }`}>
                  {scenario.ads.connections.Meta ? '✓ Connected' : 'Disconnected'}
                </span>
              </div>
              <h3 className="font-bold text-text-primary text-sm">Meta Ads Integration</h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Facebook / Instagram Feed & Reels 広告へのAPI自動入札・クリエイティブ送信。
              </p>

              {scenario.ads.connections.Meta && (
                <div className="mt-4 space-y-2.5 border-t border-border-custom pt-4 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">広告アカウント ID:</span>
                    <span className="font-mono text-text-primary font-semibold">act_9824102834</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">デフォルト上限CPA:</span>
                    <span className="font-semibold text-text-primary">¥4,000</span>
                  </div>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-2 border border-border-custom hover:bg-bg-subtle text-xs font-semibold rounded-lg text-text-secondary transition-colors cursor-pointer">
              Configure Meta API
            </button>
          </div>

          {/* Google Ads Card */}
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
                  <GoogleIcon />
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  scenario.ads.connections.Google 
                    ? 'bg-positive/10 text-positive' 
                    : 'bg-bg-subtle text-text-muted'
                }`}>
                  {scenario.ads.connections.Google ? '✓ Connected' : 'Disconnected'}
                </span>
              </div>
              <h3 className="font-bold text-text-primary text-sm">Google Ads Integration</h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                Search, Performance Max (P-MAX), YouTube プレビューへのアセットアロケーション。
              </p>

              {scenario.ads.connections.Google && (
                <div className="mt-4 space-y-2.5 border-t border-border-custom pt-4 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">顧客 ID:</span>
                    <span className="font-mono text-text-primary font-semibold">894-398-1029</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">接続ステータス:</span>
                    <span className="font-semibold text-positive flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-2 border border-border-custom hover:bg-bg-subtle text-xs font-semibold rounded-lg text-text-secondary transition-colors cursor-pointer">
              Configure Google API
            </button>
          </div>

          {/* TikTok Ads Card */}
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-text-primary text-white rounded-xl">
                  <span className="font-extrabold text-sm tracking-tighter">TikTok</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  scenario.ads.connections.TikTok 
                    ? 'bg-positive/10 text-positive' 
                    : 'bg-bg-subtle text-text-muted'
                }`}>
                  {scenario.ads.connections.TikTok ? '✓ Connected' : 'Disconnected'}
                </span>
              </div>
              <h3 className="font-bold text-text-primary text-sm">TikTok Ads Integration</h3>
              <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                TikTok スパークアズ・縦型ショート動画向けスマートビディング連携。
              </p>

              {scenario.ads.connections.TikTok && (
                <div className="mt-4 space-y-2.5 border-t border-border-custom pt-4 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">アカウント ID:</span>
                    <span className="font-mono text-text-primary font-semibold">tt_act_893247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">スマートアセット:</span>
                    <span className="font-semibold text-text-primary">自動同期オン</span>
                  </div>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-2 border border-border-custom hover:bg-bg-subtle text-xs font-semibold rounded-lg text-text-secondary transition-colors cursor-pointer">
              Configure TikTok API
            </button>
          </div>

        </section>
      )}

      {/* 2. Campaign Generator Tab */}
      {activeTab === 'generate' && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
          
          {/* Strategy Logs & Inputs */}
          <div className="lg:col-span-5 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase">GENERATION PROCESS</h3>
              <h2 className="text-base font-bold text-text-primary mt-1">Creative Ad Planner</h2>
            </div>

            {/* AI strategy typing logs */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-text-secondary px-1.5">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-brand" />
                  Orchestrator Log Stream (stdout)
                </span>
                <span className="text-[10px] font-mono text-text-muted">Jitter: Active</span>
              </div>
              <TerminalLog 
                logs={adsState.logs} 
                isRunning={adsState.status === 'running'} 
                maxHeightClass="h-72" 
                placeholderText="Ad入札ポート同期待機中..." 
              />
            </div>

            {/* Mini flow status indicators */}
            <div className="space-y-3 pt-2">
              {adsState.tasks.map((task) => {
                const isPending = task.status === 'pending';
                const isRunning = task.status === 'running';
                const isCompleted = task.status === 'completed';

                return (
                  <div 
                    key={task.id} 
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all duration-300 ${
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
                          <CheckCircle className="w-3.5 h-3.5" />
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

          {/* Generated Campaigns & Creative Previews */}
          <div className="lg:col-span-7 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm space-y-6 min-h-[400px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-3 border-b border-border-custom">
                <h3 className="text-sm font-bold text-text-primary">自動生成広告キャンペーンアセット</h3>
                <span className="text-[10px] text-text-muted font-mono">Status: {adsState.status === 'completed' ? 'Active (All deployed)' : 'Processing...'}</span>
              </div>

              <div className="mt-4 space-y-4">
                {campaigns.map((camp) => {
                  const isPending = camp.status === 'pending';
                  const isGenerating = camp.status === 'generating';
                  const isReady = camp.status === 'ready';
                  const isActive = camp.status === 'active';

                  return (
                    <div key={camp.id} className="p-4 rounded-xl border border-border-custom bg-bg-subtle/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        {/* Image Preview Box with shimmer skeleton */}
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-bg-subtle border border-border-custom relative flex-shrink-0 flex items-center justify-center">
                          {isPending || isGenerating ? (
                            <div className="absolute inset-0 bg-gradient-to-r from-bg-subtle via-border to-bg-subtle bg-[length:400%_100%] animate-shimmer" />
                          ) : (
                            <img src={camp.image} alt={camp.name} className="w-full h-full object-cover animate-fade-in" />
                          )}
                          {isGenerating && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <RefreshCw className="w-4.5 h-4.5 text-white animate-spin" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] px-1.5 py-0.5 bg-bg-surface text-text-secondary border border-border-strong rounded font-semibold font-mono uppercase">
                              {camp.platform}
                            </span>
                            <span className="text-[10px] text-text-muted font-bold font-mono">{camp.budget}</span>
                          </div>
                          <h4 className="font-bold text-text-primary text-xs mt-1.5">{camp.name}</h4>
                        </div>
                      </div>

                      {/* Status / Quick KPI details */}
                      <div className="flex items-center gap-3.5 self-end md:self-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive 
                            ? 'bg-positive/10 text-positive' 
                            : isReady 
                              ? 'bg-brand-soft text-brand-strong' 
                              : 'bg-bg-subtle text-text-muted animate-pulse'
                        }`}>
                          {isActive && '● Active / 配信中'}
                          {isReady && 'Ready / 送信準備完了'}
                          {isGenerating && 'Generating...'}
                          {isPending && '待機中'}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {adsState.tasks.find(t => t.id === 'a3')?.status === 'running' && (
              <div className="p-3.5 bg-brand-soft border border-brand/10 rounded-xl text-brand-strong text-[10px] flex items-center gap-2.5 animate-pulse mt-4">
                <CheckCircle className="w-4 h-4" />
                <span>Meta および Google API 経由での最終審査・キャンペーン構築リクエストを処理中...</span>
              </div>
            )}
            
            {adsState.tasks.find(t => t.id === 'a4')?.status === 'completed' && (
              <div className="p-3.5 bg-positive/10 border border-positive/10 rounded-xl text-positive text-[10px] flex items-center gap-2.5 mt-4">
                <CheckCircle className="w-4 h-4" />
                <span>3個 of 自動生成キャンペーンが配信面に正常にデプロイされました。自動運用中。</span>
              </div>
            )}

          </div>

        </section>
      )}

      {/* 3. Performance Analytics Tab (The Dashboard) */}
      {activeTab === 'dashboard' && (
        <section className="space-y-6 animate-fade-in">
          
          {/* KPI Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Sales Card */}
            <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm text-left">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase">Gross Sales</h4>
              <div className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums tracking-tight">
                {formatCurrency(metrics.sales)}
              </div>
              <p className="text-[9px] text-positive font-medium mt-1">リアルタイム購買実績</p>
            </div>

            {/* CPA Card */}
            <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm text-left">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase">Cost Per Acquisition (CPA)</h4>
              <div className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums tracking-tight">
                {formatCurrency(metrics.cpa)}
              </div>
              <p className="text-[9px] text-positive font-medium mt-1">
                獲得単価目標: {formatCurrency(scenario.ads.metrics.cpaTo)} (削減達成中)
              </p>
            </div>

            {/* ROAS Card */}
            <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm text-left">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase">Return on Ad Spend (ROAS)</h4>
              <div className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums tracking-tight">
                {metrics.roas.toFixed(2)}x
              </div>
              <p className="text-[9px] text-positive font-medium mt-1">
                費用対効果: 前期比 +{Math.round((metrics.roas / scenario.ads.metrics.roasFrom - 1) * 100)}%
              </p>
            </div>

            {/* Total Spend Card */}
            <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm text-left">
              <h4 className="text-[10px] font-bold text-text-secondary uppercase">Total Spent</h4>
              <div className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums tracking-tight">
                {formatCurrency(metrics.spend)}
              </div>
              <p className="text-[9px] text-text-muted mt-1">消化済広告費用</p>
            </div>

          </div>

          {/* Recharts Graphs Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sales Line Graph */}
            <div className="lg:col-span-8 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
              <div>
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Revenue Trend</h3>
                <h2 className="text-sm font-bold text-text-primary mt-1">7-Day Sales Growth</h2>
              </div>

              {/* Chart Body */}
              <div className="w-full h-64 mt-4 text-xs">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getLineData()} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F4F8F8" />
                      <XAxis dataKey="name" stroke="#93A1A1" fontSize={10} tickLine={false} />
                      <YAxis stroke="#93A1A1" fontSize={10} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          border: '1px solid #E6EDED',
                          borderRadius: '8px',
                          color: '#0E1A1B'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Sales" 
                        stroke="#0bbfca" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 4, stroke: '#0bbfca', strokeWidth: 2, fill: '#FFFFFF' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-bg-subtle flex items-center justify-center text-text-muted">Loading chart...</div>
                )}
              </div>
            </div>

            {/* Channel Revenue Donut */}
            <div className="lg:col-span-4 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[380px]">
              <div>
                <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Acquisition Split</h3>
                <h2 className="text-sm font-bold text-text-primary mt-1">Channel Contribution</h2>
              </div>

              {/* Chart Body */}
              <div className="w-full h-48 relative my-4 flex items-center justify-center">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full bg-bg-subtle flex items-center justify-center text-text-muted">Loading chart...</div>
                )}
                {/* Center total text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Total</span>
                  <span className="text-base font-bold text-text-primary mt-0.5 tabular-nums">
                    {formatCurrency(metrics.sales)}
                  </span>
                </div>
              </div>

              {/* Legends Custom */}
              <div className="space-y-1.5 text-[11px]">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-text-secondary font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-text-primary tabular-nums">
                      {Math.round((item.value / metrics.sales) * 100 || 0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Campaign details performance table */}
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm overflow-hidden">
            <h3 className="font-bold text-text-primary text-sm mb-4">エージェント別入札調整パフォーマンス</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border-custom text-text-muted uppercase text-[10px] font-bold">
                    <th className="pb-3 font-semibold">キャンペーン名</th>
                    <th className="pb-3 font-semibold">プラットフォーム</th>
                    <th className="pb-3 font-semibold">平均CPC</th>
                    <th className="pb-3 font-semibold">実CPA</th>
                    <th className="pb-3 font-semibold">ROAS</th>
                    <th className="pb-3 font-semibold text-right">ステータス</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-custom font-medium">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="text-text-secondary font-mono">
                      <td className="py-3 text-text-primary font-bold font-sans">{c.name}</td>
                      <td className="py-3">{c.platform}</td>
                      <td className="py-3 tabular-nums">¥{c.cpc}</td>
                      <td className="py-3 text-negative font-bold tabular-nums">¥{c.cpa.toLocaleString()}</td>
                      <td className="py-3 text-brand-strong font-bold tabular-nums">{c.roas}x</td>
                      <td className="py-3 text-right">
                        <span className="px-2 py-0.5 bg-positive/10 text-positive rounded-full text-[9px] font-bold font-sans">
                          最適化適用済
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </section>
      )}

    </div>
  );
}
