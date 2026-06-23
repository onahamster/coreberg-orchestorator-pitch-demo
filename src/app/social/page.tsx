'use client';

import React, { useState, useEffect } from 'react';
import { useDemoStore, SocialPost } from '@/store/demoStore';
import { 
  Compass, 
  Layers, 
  Send, 
  BarChart3,
  Heart,
  MessageCircle,
  Bookmark,
  Send as PaperPlane,
  RefreshCw,
  CheckCircle,
  ChevronRight,
  Brain
} from 'lucide-react';

export default function SocialAgentPage() {
  const activeScenarioId = useDemoStore((state) => state.activeScenarioId);
  const scenarios = useDemoStore((state) => state.scenarios);
  const scenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  // Zustand states for Social
  const socialStepIndex = useDemoStore((state) => state.socialStepIndex);
  const socialStepProgress = useDemoStore((state) => state.socialStepProgress);
  const strategyLogs = useDemoStore((state) => state.socialStrategyLogsVisible);
  const posts = useDemoStore((state) => state.socialPosts);
  const metrics = useDemoStore((state) => state.socialMetrics);

  // Selected post to display in mock iPhone preview
  const [selectedPostId, setSelectedPostId] = useState<string>('p1');
  const activePost = posts.find(p => p.id === selectedPostId) || posts[0] || scenario.social.posts[0];

  // Update selected post automatically as they generate/publish
  useEffect(() => {
    if (socialStepIndex === 1 || socialStepIndex === 2) {
      // Find the first post that is generating, ready, or just published to focus on
      const currentlyProcessing = posts.find(p => p.status === 'generating') || 
                                  posts.find(p => p.status === 'published') ||
                                  posts[0];
      if (currentlyProcessing) {
        setSelectedPostId(currentlyProcessing.id);
      }
    }
  }, [posts, socialStepIndex]);

  // Toast notification for publishing
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    if (socialStepIndex === 2) {
      const publishedCount = posts.filter(p => p.status === 'published').length;
      if (publishedCount > 0 && publishedCount <= posts.length) {
        setToastMessage(`@coreberg_demo に投稿を配信しました (${publishedCount}/${posts.length})`);
        const timer = setTimeout(() => setToastMessage(null), 2500);
        return () => clearTimeout(timer);
      }
    } else {
      setToastMessage(null);
    }
  }, [posts, socialStepIndex]);

  const steps = [
    { name: '企画立案', desc: 'Strategy', icon: Compass },
    { name: 'コンテンツ生成', desc: 'Creative', icon: Layers },
    { name: '予約投稿', desc: 'Publish', icon: Send },
    { name: '効果測定・改善', desc: 'Optimize', icon: BarChart3 }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-text-primary text-bg-surface text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-border-strong animate-slide-up">
          <CheckCircle className="w-4 h-4 text-brand" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 4-Step Pipeline Header Indicator */}
      <section className="bg-bg-surface border border-border-custom rounded-2xl p-4 shadow-sm">
        <div className="grid grid-cols-4 gap-2 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = socialStepIndex === idx;
            const isCompleted = socialStepIndex > idx;
            return (
              <div 
                key={idx} 
                className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-brand-soft border border-brand/20' 
                    : 'border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-lg flex items-center justify-center ${
                  isActive 
                    ? 'bg-brand text-white' 
                    : isCompleted 
                      ? 'bg-positive/10 text-positive' 
                      : 'bg-bg-subtle text-text-muted'
                }`}>
                  <Icon className="w-4 h-4" strokeWidth={2} />
                </div>
                <div className="hidden md:block">
                  <div className={`text-xs font-bold ${isActive ? 'text-brand-strong' : isCompleted ? 'text-positive' : 'text-text-secondary'}`}>
                    {step.name}
                  </div>
                  <div className="text-[9px] text-text-muted font-medium uppercase tracking-wider">{step.desc}</div>
                </div>
                
                {/* Progress bar inside the active card */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 h-0.5 bg-brand rounded-full transition-all duration-300" style={{ width: `${socialStepProgress}%` }} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Control/Work area & Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Area (8 cols): Workspace Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Phase Content Area */}
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm min-h-[480px] flex flex-col">
            
            {/* Step 0: Strategy Planning View */}
            {socialStepIndex === 0 && (
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-text-primary">思考プロセス：ブランド分析 & 企画立案</h3>
                  <div className="bg-bg-subtle rounded-xl p-4 font-mono text-[11px] leading-relaxed text-text-secondary space-y-2 border border-border-custom min-h-[160px]">
                    {strategyLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-2 animate-fade-in">
                        <span className="text-brand font-bold select-none">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                    {socialStepProgress < 100 && (
                      <div className="flex items-center gap-1.5 pl-4 text-text-muted mt-2 animate-pulse text-[10px]">
                        <RefreshCw className="w-3 h-3 animate-spin text-brand" />
                        <span>市場データ及びトレンドログを自律分析中...</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Display calendar preview placeholders or partial results */}
                <div className="mt-6 border-t border-border-custom pt-6">
                  <h4 className="text-xs font-bold text-text-secondary mb-3">生成予定の投稿テーマカレンダー</h4>
                  <div className="grid grid-cols-7 gap-2">
                    {scenario.social.posts.map((p, i) => (
                      <div key={i} className="bg-bg-base border border-border-custom rounded-lg p-2 text-center space-y-1">
                        <div className="text-[8px] text-text-muted font-bold tracking-wider">{p.time.split(' ')[0]}</div>
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-soft mx-auto animate-pulse" />
                        <div className="text-[8px] text-text-muted truncate px-0.5">{p.theme}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1 & 2: Creative & Publish View */}
            {(socialStepIndex === 1 || socialStepIndex === 2) && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-text-primary">
                      {socialStepIndex === 1 ? 'クリエイティブ・コンテンツ生成' : '投稿スケジュール & 配信'}
                    </h3>
                    <span className="text-[10px] text-text-muted font-semibold">全 7 件の投稿スレッド</span>
                  </div>

                  {/* Weekly posts list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[380px] overflow-y-auto pr-1">
                    {posts.map((post) => {
                      const isGenerating = post.status === 'generating';
                      const isPending = post.status === 'pending';
                      const isReady = post.status === 'ready';
                      const isPublished = post.status === 'published';
                      const isSelected = selectedPostId === post.id;

                      return (
                        <div 
                          key={post.id}
                          onClick={() => setSelectedPostId(post.id)}
                          className={`p-3 rounded-xl border transition-all text-left cursor-pointer flex gap-3 ${
                            isSelected 
                              ? 'border-brand bg-brand-soft/20 shadow-xs' 
                              : 'border-border-custom bg-bg-surface hover:bg-bg-subtle/40'
                          }`}
                        >
                          {/* Image box with Skeleton support */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-bg-subtle border border-border-custom relative flex-shrink-0 flex items-center justify-center">
                            {isPending || isGenerating ? (
                              <div className="absolute inset-0 bg-gradient-to-r from-bg-subtle via-border to-bg-subtle bg-[length:400%_100%] animate-shimmer" />
                            ) : (
                              <img src={post.image} alt={post.theme} className="w-full h-full object-cover animate-fade-in" />
                            )}
                            {isGenerating && (
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <RefreshCw className="w-4 h-4 text-white animate-spin" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[9px] text-text-muted font-bold tracking-wide uppercase">{post.time}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                                isPublished 
                                  ? 'bg-positive/10 text-positive' 
                                  : isReady 
                                    ? 'bg-brand-soft text-brand-strong' 
                                    : 'bg-bg-subtle text-text-muted animate-pulse'
                              }`}>
                                {isPublished && '配信済'}
                                {isReady && '生成完了'}
                                {isGenerating && '生成中'}
                                {isPending && '待機中'}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-text-primary truncate">{post.theme}</h4>
                            <p className="text-[10px] text-text-secondary truncate mt-0.5 leading-normal">
                              {post.caption}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 border-t border-border-custom pt-4 flex justify-between items-center text-[10px] text-text-secondary">
                  <span>クリックすると右側のプレビューに表示されます。</span>
                  {socialStepIndex === 1 && (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3 h-3 animate-spin text-brand" />
                      生成プロセス：画像合成 & コピーライティング実行中...
                    </span>
                  )}
                  {socialStepIndex === 2 && (
                    <span className="text-positive font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      API連携：予約配信処理中
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Optimize View */}
            {socialStepIndex === 3 && (
              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-border-custom pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-text-primary">運用データ改善 & フィードバックループ</h3>
                      <p className="text-[11px] text-text-secondary mt-1">配信完了後の実績をリアルタイム取得・分析中</p>
                    </div>
                    {/* Pulsing Loop Arrow */}
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-positive/15 text-positive font-bold text-[10px] rounded-full animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>ラーニングループ稼働中</span>
                    </div>
                  </div>

                  {/* Growth Metrics details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl border border-border-custom bg-bg-surface text-left">
                      <div className="text-[10px] font-bold text-text-secondary uppercase">Reach Multiplier</div>
                      <div className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums">
                        {metrics.reach.toFixed(2)}x
                      </div>
                      <div className="text-[9px] text-positive font-medium mt-1">前期比 +150% 達成</div>
                    </div>
                    <div className="p-4 rounded-xl border border-border-custom bg-bg-surface text-left">
                      <div className="text-[10px] font-bold text-text-secondary uppercase">Save Rate (平均)</div>
                      <div className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums">
                        {metrics.saveRate.toFixed(2)}%
                      </div>
                      <div className="text-[9px] text-positive font-medium mt-1">
                        目標値 {scenario.social.metrics.saveRateTo.toFixed(2)}% へ推移
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border border-border-custom bg-bg-surface text-left">
                      <div className="text-[10px] font-bold text-text-secondary uppercase">Save Ratio</div>
                      <div className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums">
                        {metrics.save.toFixed(2)}x
                      </div>
                      <div className="text-[9px] text-positive font-medium mt-1">保存数が飛躍的に増加</div>
                    </div>
                    <div className="p-4 rounded-xl border border-border-custom bg-bg-surface text-left">
                      <div className="text-[10px] font-bold text-text-secondary uppercase">Engagement</div>
                      <div className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums">
                        {metrics.engagement.toFixed(2)}x
                      </div>
                      <div className="text-[9px] text-positive font-medium mt-1">いいね・コメ比率向上</div>
                    </div>
                  </div>

                  {/* Learning analysis log */}
                  <div className="p-4 bg-bg-subtle rounded-xl border border-border-custom">
                    <h4 className="text-xs font-bold text-text-primary mb-2 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-brand" />
                      <span>AI Insights & Strategy Adjustment</span>
                    </h4>
                    <p className="text-[11px] text-text-secondary leading-relaxed">
                      「{posts[0]?.theme}」および「{posts[1]?.theme}」の投稿において、保存率（ユーザー保存数÷インプレッション）が基準値の {scenario.social.metrics.saveRateFrom.toFixed(2)}% を大幅に上回る **{metrics.saveRate.toFixed(2)}%** を記録しました。素材のマテリアル感にフォーカスした高解像度画像と、機能美に特化したキャプション構成がユーザーエンゲージメントを牽引したと分析。
                    </p>
                    <p className="text-[11px] text-brand-strong font-semibold mt-2.5 flex items-center gap-1 animate-pulse">
                      ➔ この学習データを元に次サイクル（企画立案）のプロンプト・戦略パラメータを自動更新し、次の配信計画へループします。
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-border-custom pt-4 text-[10px] text-text-secondary text-right">
                  ループ再生オンの場合、一定時間経過後に自動的に第1フェーズ「企画立案」へループバックします。
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Area (4 cols): iPhone Instagram Preview Mockup */}
        <div className="lg:col-span-4 flex flex-col items-center">
          
          <h3 className="text-xs font-semibold text-text-secondary tracking-wider uppercase mb-3 text-left w-full pl-2">
            Instagram Feed Mockup
          </h3>
          
          {/* iPhone Outer Container */}
          <div className="w-[300px] h-[580px] rounded-[36px] border-[8px] border-border-strong bg-white shadow-lg overflow-hidden flex flex-col justify-between relative select-none">
            
            {/* iPhone Top Speaker / Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-border-strong z-20 flex items-center justify-center">
              <div className="w-12 h-1 bg-border-custom rounded-full" />
            </div>

            {/* Instagram Header Mock */}
            <div className="h-14 pt-4 px-4 border-b border-border-custom flex items-center justify-between bg-bg-surface z-10 flex-shrink-0">
              <span className="font-bold text-xs text-text-primary tracking-tight">Instagram</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-bg-subtle text-text-muted border border-border-custom font-mono">
                Preview Mode
              </span>
            </div>

            {/* Scrollable Feed Container */}
            <div className="flex-1 overflow-y-auto bg-white flex flex-col">
              
              {/* Poster Account Header */}
              <div className="p-3 flex items-center gap-2.5 border-b border-border-custom/50 flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white font-extrabold text-xs">
                  {scenario.name.substring(0, 1)}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-text-primary">@{scenario.id}_official</div>
                  <div className="text-[8px] text-text-muted font-medium">{activePost.time}</div>
                </div>
              </div>

              {/* Feed Image display */}
              <div className="aspect-square bg-bg-subtle border-b border-border-custom relative flex items-center justify-center flex-shrink-0">
                {activePost.status === 'pending' || activePost.status === 'generating' ? (
                  <div className="absolute inset-0 bg-gradient-to-r from-bg-subtle via-border to-bg-subtle bg-[length:400%_100%] animate-shimmer" />
                ) : (
                  <img 
                    src={activePost.image} 
                    alt={activePost.theme} 
                    className="w-full h-full object-cover animate-fade-in" 
                  />
                )}
                {activePost.status === 'generating' && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white px-2 py-1 bg-black/60 rounded">AI Generating...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Header */}
              <div className="p-3 flex justify-between items-center flex-shrink-0">
                <div className="flex gap-3 text-text-primary">
                  <Heart className={`w-4.5 h-4.5 ${activePost.likes > 0 ? 'text-negative fill-negative' : ''}`} />
                  <MessageCircle className="w-4.5 h-4.5" />
                  <PaperPlane className="w-4.5 h-4.5" />
                </div>
                <Bookmark className={`w-4.5 h-4.5 ${activePost.shares > 0 ? 'text-brand fill-brand' : ''}`} />
              </div>

              {/* Likes & Engagement values */}
              <div className="px-3 pb-2 text-[10px] font-bold text-text-primary flex-shrink-0 tabular-nums">
                {activePost.likes > 0 ? `${activePost.likes.toLocaleString()} likes` : '0 likes'}
              </div>

              {/* Caption and description text */}
              <div className="px-3 pb-4 text-[10px] leading-relaxed text-text-secondary flex-1">
                <span className="font-bold text-text-primary mr-1.5">@{scenario.id}_official</span>
                {activePost.status === 'generating' ? (
                  <span className="text-text-muted animate-pulse">キャプション自動生成中...</span>
                ) : (
                  <span>
                    {activePost.caption}
                    <div className="mt-1.5 text-brand-strong font-medium">
                      {activePost.hashtags.map((h, idx) => ` #${h}`)}
                    </div>
                  </span>
                )}
              </div>

            </div>

            {/* iPhone Home Indicator Button */}
            <div className="h-4 pb-1.5 flex items-center justify-center flex-shrink-0">
              <div className="w-24 h-1 bg-border-strong rounded-full" />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
