'use client';

import React, { useState, useEffect } from 'react';
import { useDemoStore } from '@/store/demoStore';
import TerminalLog from '@/components/TerminalLog';
import { 
  Heart,
  MessageCircle,
  Bookmark,
  Send as PaperPlane,
  CheckCircle,
  RefreshCw,
  Clock,
  Compass,
  Cpu
} from 'lucide-react';

export default function SocialAgentPage() {
  const activeScenarioId = useDemoStore((state) => state.activeScenarioId);
  const scenarios = useDemoStore((state) => state.scenarios);
  const scenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];

  // Zustand states for Social
  const socialState = useDemoStore((state) => state.socialState);
  const posts = useDemoStore((state) => state.socialPosts);
  const metrics = useDemoStore((state) => state.socialMetrics);

  // Selected post to display in mock iPhone preview
  const [selectedPostId, setSelectedPostId] = useState<string>('p1');
  
  // Get active post safely
  const activePost = posts.find(p => p.id === selectedPostId) || posts[0] || scenario.social.posts[0];

  // Automatically select the post that is currently generating or has just been published
  useEffect(() => {
    const activeRunning = posts.find(p => p.status === 'generating') || 
                          posts.find(p => p.status === 'published') ||
                          posts[0];
    if (activeRunning) {
      setSelectedPostId(activeRunning.id);
    }
  }, [posts]);

  // Derived tasks completion rate helper
  const getCompletedTasksCount = () => {
    return socialState.tasks.filter(t => t.status === 'completed').length;
  };

  // Toast notification for publishing
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    // Check if the scheduler task is running or completed
    const publishTask = socialState.tasks.find(t => t.id === 't3');
    if (publishTask?.status === 'running') {
      const publishedCount = posts.filter(p => p.status === 'published').length;
      if (publishedCount > 0) {
        setToastMessage(`@${scenario.id}_official 投稿配信中... (${publishedCount}/${posts.length})`);
      }
    } else if (publishTask?.status === 'completed') {
      setToastMessage(`✓ @${scenario.id}_official 7件の全投稿をCronへ登録完了`);
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    } else {
      setToastMessage(null);
    }
  }, [posts, socialState.tasks]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-text-primary text-bg-surface text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-border-strong animate-slide-up">
          <CheckCircle className="w-4 h-4 text-brand" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Info */}
      <section className="bg-bg-surface border border-border-custom rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-soft text-brand-strong rounded-xl">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-text-secondary tracking-wider uppercase">CHANNEL CONTROLLER</h2>
            <h1 className="text-lg font-bold text-text-primary mt-0.5">SNS Agent Console</h1>
          </div>
        </div>
        
        {/* Step indicator progress block */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-subtle border border-border-custom rounded-full text-xs font-semibold text-text-secondary">
          <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
          <span>Task Queue Progress: {getCompletedTasksCount()} / {socialState.tasks.length}</span>
        </div>
      </section>

      {/* Main Grid: Checklist & Console on Left, Phone Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side (8 cols): Tasks & Main CLI Terminal */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Subtask Checkbox List */}
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase mb-4">EXECUTION PIPELINE</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {socialState.tasks.map((task) => {
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

          {/* CLI Terminal Container (The primary visual focus) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-text-secondary px-1.5">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-brand" />
                Orchestrator Log Stream (stdout)
              </span>
              <span className="text-[10px] font-mono text-text-muted">Jitter: Active</span>
            </div>
            <TerminalLog 
              logs={socialState.logs} 
              isRunning={socialState.status === 'running'} 
              maxHeightClass="h-72" 
            />
          </div>

          {/* Social Posts Generation List */}
          {socialState.status !== 'idle' && (
            <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
              <div className="flex justify-between items-center pb-3 border-b border-border-custom">
                <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase">CREATIVE THREADS</h3>
                <span className="text-[10px] font-mono text-text-muted">Generated: {posts.filter(p => p.status === 'ready' || p.status === 'published').length} / {posts.length}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col justify-between min-h-[120px] ${
                        isSelected 
                          ? 'border-brand bg-brand-soft/20 shadow-xs' 
                          : 'border-border-custom bg-bg-surface hover:bg-bg-subtle/30'
                      }`}
                    >
                      <div className="aspect-square w-full rounded-lg overflow-hidden bg-bg-subtle relative border border-border-custom flex items-center justify-center">
                        {isPending || isGenerating ? (
                          <div className="absolute inset-0 bg-gradient-to-r from-bg-subtle via-border to-bg-subtle bg-[length:400%_100%] animate-shimmer" />
                        ) : (
                          <img src={post.image} alt={post.theme} className="w-full h-full object-cover animate-fade-in" />
                        )}
                        {isGenerating && (
                          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                            <RefreshCw className="w-4 h-4 text-white animate-spin" />
                          </div>
                        )}
                      </div>

                      <div className="mt-2 text-center">
                        <div className="text-[8px] text-text-muted font-bold tracking-wide">{post.time}</div>
                        <div className="text-[9px] font-bold text-text-primary truncate mt-0.5">{post.theme}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metrics block (Visible during or after Optimize step) */}
          {socialState.tasks.find(t => t.id === 't4')?.status === 'completed' && (
            <div className="bg-bg-surface border border-border-custom rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
              <h3 className="text-xs font-bold text-text-secondary tracking-wider uppercase">LEARNED METRICS (LEARNING FEEDBACK ON)</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-bg-subtle rounded-xl border border-border-custom text-left">
                  <div className="text-[9px] text-text-secondary font-bold">Reach Ratio</div>
                  <div className="text-xl font-bold text-text-primary mt-1 tabular-nums">{metrics.reach.toFixed(2)}x</div>
                </div>
                <div className="p-3 bg-bg-subtle rounded-xl border border-border-custom text-left">
                  <div className="text-[9px] text-text-secondary font-bold">Save Rate</div>
                  <div className="text-xl font-bold text-text-primary mt-1 tabular-nums">{metrics.saveRate.toFixed(2)}%</div>
                </div>
                <div className="p-3 bg-bg-subtle rounded-xl border border-border-custom text-left">
                  <div className="text-[9px] text-text-secondary font-bold">Save Ratio</div>
                  <div className="text-xl font-bold text-text-primary mt-1 tabular-nums">{metrics.save.toFixed(2)}x</div>
                </div>
                <div className="p-3 bg-bg-subtle rounded-xl border border-border-custom text-left">
                  <div className="text-[9px] text-text-secondary font-bold">Engagement</div>
                  <div className="text-xl font-bold text-text-primary mt-1 tabular-nums">{metrics.engagement.toFixed(2)}x</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Side (4 cols): iPhone Instagram Preview Mockup */}
        <div className="lg:col-span-4 flex flex-col items-center">
          
          <h3 className="text-xs font-semibold text-text-secondary tracking-wider uppercase mb-3 text-left w-full pl-2">
            Instagram Feed Mockup
          </h3>
          
          {/* iPhone Container */}
          <div className="w-[300px] h-[580px] rounded-[36px] border-[8px] border-border-strong bg-white shadow-lg overflow-hidden flex flex-col justify-between relative select-none">
            
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-border-strong z-20 flex items-center justify-center">
              <div className="w-12 h-1 bg-border-custom rounded-full" />
            </div>

            {/* Header */}
            <div className="h-14 pt-4 px-4 border-b border-border-custom flex items-center justify-between bg-bg-surface z-10 flex-shrink-0">
              <span className="font-bold text-xs text-text-primary tracking-tight">Instagram</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-bg-subtle text-text-muted border border-border-custom font-mono">
                Preview
              </span>
            </div>

            {/* Feed Scroll area */}
            <div className="flex-1 overflow-y-auto bg-white flex flex-col">
              
              {/* Account header */}
              <div className="p-3 flex items-center gap-2.5 border-b border-border-custom/50 flex-shrink-0">
                <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white font-extrabold text-xs">
                  {scenario.name.substring(0, 1)}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-text-primary">@{scenario.id}_official</div>
                  <div className="text-[8px] text-text-muted font-medium">{activePost.time}</div>
                </div>
              </div>

              {/* Feed Image */}
              <div className="aspect-square bg-bg-subtle border-b border-border-custom relative flex items-center justify-center flex-shrink-0 animate-fade-in">
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
                    <span className="text-[10px] font-bold text-white px-2 py-1 bg-black/60 rounded">AI Processing...</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-3 flex justify-between items-center flex-shrink-0">
                <div className="flex gap-3 text-text-primary">
                  <Heart className={`w-4.5 h-4.5 ${activePost.likes > 0 ? 'text-negative fill-negative' : ''}`} />
                  <MessageCircle className="w-4.5 h-4.5" />
                  <PaperPlane className="w-4.5 h-4.5" />
                </div>
                <Bookmark className={`w-4.5 h-4.5 ${activePost.shares > 0 ? 'text-brand fill-brand' : ''}`} />
              </div>

              {/* Likes counter */}
              <div className="px-3 pb-2 text-[10px] font-bold text-text-primary flex-shrink-0 tabular-nums">
                {activePost.likes > 0 ? `${activePost.likes.toLocaleString()} likes` : '0 likes'}
              </div>

              {/* Text Area */}
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

            {/* Bottom Bar Indicator */}
            <div className="h-4 pb-1.5 flex items-center justify-center flex-shrink-0">
              <div className="w-24 h-1 bg-border-strong rounded-full" />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
