'use client';

import React, { useState } from 'react';
import { useDemoStore, Scenario } from '@/store/demoStore';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Download, 
  Upload, 
  CheckCircle, 
  Settings2,
  Sparkles,
  Sliders,
  Database
} from 'lucide-react';

export default function AdminPage() {
  // Zustand state
  const isPlaying = useDemoStore((state) => state.isPlaying);
  const startDemo = useDemoStore((state) => state.startDemo);
  const pauseDemo = useDemoStore((state) => state.pauseDemo);
  const resetDemo = useDemoStore((state) => state.resetDemo);
  
  const playbackSpeed = useDemoStore((state) => state.playbackSpeed);
  const setSpeed = useDemoStore((state) => state.setSpeed);
  const autoStart = useDemoStore((state) => state.autoStart);
  const toggleAutoStart = useDemoStore((state) => state.toggleAutoStart);
  const isLoop = useDemoStore((state) => state.isLoop);
  const toggleLoop = useDemoStore((state) => state.toggleLoop);
  const jitterPct = useDemoStore((state) => state.jitterPct);
  const setJitter = useDemoStore((state) => state.setJitter);

  const activeScenarioId = useDemoStore((state) => state.activeScenarioId);
  const scenarios = useDemoStore((state) => state.scenarios);
  const setScenario = useDemoStore((state) => state.setScenario);
  const updateScenario = useDemoStore((state) => state.updateScenario);

  // Active Scenario Editing Form Context
  const scenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  
  // Local edit states mapped to current scenario structure to avoid lag
  const [productName, setProductName] = useState(scenario.product.name);
  const [productDesc, setProductDesc] = useState(scenario.product.description);
  const [cpaFrom, setCpaFrom] = useState(scenario.ads.metrics.cpaFrom);
  const [cpaTo, setCpaTo] = useState(scenario.ads.metrics.cpaTo);
  const [salesTo, setSalesTo] = useState(scenario.ads.metrics.salesTo);

  // JSON Export/Import handler
  const [jsonText, setJsonText] = useState('');
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Handle active scenario update save
  const handleSaveScenario = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Copy scenario object and update specific values
    const updated: Scenario = {
      ...scenario,
      product: {
        ...scenario.product,
        name: productName,
        description: productDesc
      },
      ads: {
        ...scenario.ads,
        metrics: {
          ...scenario.ads.metrics,
          cpaFrom: Number(cpaFrom),
          cpaTo: Number(cpaTo),
          salesTo: Number(salesTo)
        }
      }
    };

    updateScenario(updated);
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  // Export scenario JSON
  const handleExportJSON = () => {
    setJsonText(JSON.stringify(scenario, null, 2));
  };

  // Import scenario JSON
  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonText) as Scenario;
      if (parsed.id && parsed.product && parsed.social && parsed.ads && parsed.llmo) {
        updateScenario(parsed);
        alert('シナリオデータを正常にインポートしました。');
        setJsonText('');
      } else {
        alert('不適切なデータ構造です。必要なエージェント定義が含まれていません。');
      }
    } catch (e) {
      alert('JSONの解析に失敗しました。書式をご確認ください。');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Save Notification Toast */}
      {isSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-text-primary text-bg-surface text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-border-strong animate-slide-up">
          <CheckCircle className="w-4 h-4 text-brand" />
          <span>シナリオコンテンツを更新しました。デモは初期状態にリセットされます。</span>
        </div>
      )}

      {/* Main Header */}
      <div>
        <h2 className="text-xs font-semibold text-text-secondary tracking-wider uppercase">System Console</h2>
        <h1 className="text-lg font-bold text-text-primary mt-1">Playback Settings & Presets</h1>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Playback & Preset Select (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          
          {/* Playback Controls Card */}
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-text-primary text-xs flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand" />
              <span>再生エンジン設定</span>
            </h3>

            {/* Direct Play/Pause */}
            <div className="flex gap-2">
              <button 
                onClick={resetDemo}
                className="p-2 rounded-lg border border-border-custom hover:bg-bg-subtle text-text-secondary cursor-pointer transition-colors"
                title="Reset Flow"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {isPlaying ? (
                <button 
                  onClick={pauseDemo}
                  className="flex-1 py-2 rounded-lg bg-text-primary text-bg-surface hover:bg-text-secondary flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  <span>デモを一時停止</span>
                </button>
              ) : (
                <button 
                  onClick={startDemo}
                  className="flex-1 py-2 rounded-lg bg-brand text-white hover:bg-brand-strong flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-colors shadow-sm"
                >
                  <Play className="w-4 h-4" fill="currentColor" />
                  <span>デモを自動進行</span>
                </button>
              )}
            </div>

            {/* Global speed multiplier */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-secondary uppercase">再生速度 (Speed)</label>
              <div className="grid grid-cols-3 gap-2">
                {[0.5, 1.0, 2.0].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      playbackSpeed === s
                        ? 'bg-brand border-brand text-white shadow-xs'
                        : 'border-border-custom bg-bg-surface text-text-secondary hover:bg-bg-subtle'
                    }`}
                  >
                    {s.toFixed(1)}x
                  </button>
                ))}
              </div>
            </div>

            {/* Jitter percentage (random delays) */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-text-secondary uppercase">
                <span>生成時間の揺らぎ (Jitter)</span>
                <span className="font-mono text-brand-strong">{jitterPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={jitterPct}
                onChange={(e) => setJitter(Number(e.target.value))}
                className="w-full h-1.5 bg-bg-subtle rounded-lg appearance-none cursor-pointer accent-brand border border-border-custom"
              />
              <p className="text-[9px] text-text-muted leading-relaxed">
                ※ 各プロセスの所要時間にランダムな揺らぎ（±%）を発生させ、よりリアリティのある非同期AI挙動を演出します。
              </p>
            </div>

            {/* Toggles */}
            <div className="space-y-3 pt-2 border-t border-border-custom">
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary font-medium">ロード時自動再生 (AutoStart)</span>
                <button
                  type="button"
                  onClick={toggleAutoStart}
                  className={`w-10 h-5 rounded-full transition-colors relative focus:outline-none ${
                    autoStart ? 'bg-brand' : 'bg-border-strong'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                    autoStart ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-secondary font-medium">ループ再生 (Infinite Loop)</span>
                <button
                  type="button"
                  onClick={toggleLoop}
                  className={`w-10 h-5 rounded-full transition-colors relative focus:outline-none ${
                    isLoop ? 'bg-brand' : 'bg-border-strong'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-all ${
                    isLoop ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Scenario Selection Preset Card */}
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-text-primary text-xs flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" />
              <span>商材シナリオプリセット</span>
            </h3>
            
            <div className="space-y-2">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setScenario(s.id);
                    setProductName(s.product.name);
                    setProductDesc(s.product.description);
                    setCpaFrom(s.ads.metrics.cpaFrom);
                    setCpaTo(s.ads.metrics.cpaTo);
                    setSalesTo(s.ads.metrics.salesTo);
                  }}
                  className={`w-full p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    activeScenarioId === s.id
                      ? 'border-brand bg-brand-soft/20 text-brand-strong shadow-xs'
                      : 'border-border-custom bg-bg-surface text-text-secondary hover:bg-bg-subtle'
                  }`}
                >
                  <div className="text-xs font-bold text-text-primary">{s.name}</div>
                  <div className="text-[10px] text-text-secondary truncate mt-1">{s.product.description}</div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Scenario Context Editor Form (7 cols) */}
        <div className="md:col-span-7 bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm">
          
          <form onSubmit={handleSaveScenario} className="space-y-6">
            <div className="flex justify-between items-center border-b border-border-custom pb-3">
              <div>
                <h3 className="font-bold text-text-primary text-xs flex items-center gap-2">
                  <Database className="w-4 h-4 text-brand" />
                  <span>シナリオ・コンテンツ編集</span>
                </h3>
                <p className="text-[10px] text-text-secondary mt-0.5">※ 保存すると表側のデモ画面に即座に反映されます</p>
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-text-primary hover:bg-text-secondary text-bg-surface rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存する</span>
              </button>
            </div>

            {/* Section 1: Product Config */}
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">1. 商品・サービス情報 (共通)</h4>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-text-secondary">商品名 (Product Name)</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-bg-surface text-text-primary focus:outline-none focus:border-brand-strong"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-text-secondary">商品説明 (Product Description)</label>
                <textarea
                  rows={3}
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-bg-surface text-text-primary focus:outline-none focus:border-brand-strong resize-none"
                  required
                />
              </div>
            </div>

            {/* Section 2: Ads Target KPIs */}
            <div className="space-y-4 pt-4 border-t border-border-custom">
              <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">2. 広告シミュレータ目標KPI数値</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-text-secondary">初期CPA (開始値)</label>
                  <input
                    type="number"
                    value={cpaFrom}
                    onChange={(e) => setCpaFrom(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-bg-surface text-text-primary focus:outline-none focus:border-brand-strong font-mono"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-text-secondary">目標CPA (改善後)</label>
                  <input
                    type="number"
                    value={cpaTo}
                    onChange={(e) => setCpaTo(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-bg-surface text-text-primary focus:outline-none focus:border-brand-strong font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-text-secondary">総売上高ターゲット</label>
                  <input
                    type="number"
                    value={salesTo}
                    onChange={(e) => setSalesTo(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border-custom bg-bg-surface text-text-primary focus:outline-none focus:border-brand-strong font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Data Export/Import Panel */}
            <div className="space-y-4 pt-4 border-t border-border-custom">
              <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                <span>3. JSON データの入出力（持ち出し・持ち込み用）</span>
              </h4>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="px-3 py-1.5 border border-border-custom hover:bg-bg-subtle text-text-secondary hover:text-text-primary font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>現在のシナリオをJSON出力</span>
                </button>
                
                {jsonText && (
                  <button
                    type="button"
                    onClick={handleImportJSON}
                    className="px-3 py-1.5 bg-brand hover:bg-brand-strong text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>JSONをインポートする</span>
                  </button>
                )}
              </div>

              {jsonText && (
                <div className="space-y-2 mt-2">
                  <textarea
                    rows={8}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    placeholder="JSON文字列をここにペースト、または出力結果をコピーしてください"
                    className="w-full p-3 font-mono text-[10px] rounded-lg border border-border-custom bg-bg-subtle text-text-secondary focus:outline-none"
                  />
                </div>
              )}
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
