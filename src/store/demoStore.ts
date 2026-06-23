import { create } from 'zustand';

// Product Metadata
export interface ProductInfo {
  name: string;
  description: string;
  images: string[];
}

// SNS Agent Config
export interface SocialPost {
  id: string;
  time: string;
  theme: string;
  image: string;
  caption: string;
  hashtags: string[];
  likes: number;
  comments: number;
  shares: number;
  status: 'pending' | 'generating' | 'ready' | 'published';
}

export interface SocialConfig {
  posts: SocialPost[];
  metrics: {
    reachRatio: number;
    saveRatio: number;
    engagementRatio: number;
    saveRateFrom: number;
    saveRateTo: number;
  };
}

// Ads Agent Config
export interface AdCampaign {
  id: string;
  name: string;
  platform: 'Meta' | 'Google' | 'TikTok';
  budget: string;
  status: 'pending' | 'generating' | 'ready' | 'active';
  image: string;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface AdsConfig {
  connections: {
    Meta: boolean;
    Google: boolean;
    TikTok: boolean;
  };
  campaigns: AdCampaign[];
  metrics: {
    salesFrom: number;
    salesTo: number;
    cpaFrom: number;
    cpaTo: number;
    roasFrom: number;
    roasTo: number;
  };
}

// LLMO Agent Config
export interface VisibilityScore {
  model: string;
  score: number;
  iconType: string;
}

export interface QueryCheck {
  query: string;
  appeared: 'yes' | 'partial' | 'no';
}

export interface OptimizeAction {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed';
}

export interface CitationSample {
  id: string;
  source: string;
  contentBefore: string;
  contentAfter: string;
}

export interface LlmoConfig {
  visibilityScores: VisibilityScore[];
  queries: QueryCheck[];
  actions: OptimizeAction[];
  citations: CitationSample[];
}

// Scenario Definition
export interface Scenario {
  id: string;
  name: string;
  product: ProductInfo;
  social: SocialConfig;
  ads: AdsConfig;
  llmo: LlmoConfig;
}

// ----------------------------------------------------
// V2.0 EVENT DRIVEN DEFINITIONS
// ----------------------------------------------------

export interface LogLine {
  id: string;
  text: string;
  type: 'cmd' | 'info' | 'success' | 'warn';
  timestamp: string;
}

export interface TaskItem {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed';
  elapsed?: string;
}

export type DemoEvent =
  | { type: 'log'; text: string; logType: 'cmd' | 'info' | 'success' | 'warn'; delay: number }
  | { type: 'task_start'; taskId: string; delay: number }
  | { type: 'task_done'; taskId: string; elapsedSec: number; delay: number }
  | { type: 'post_status'; postId: string; status: 'generating' | 'ready' | 'published'; delay: number }
  | { type: 'campaign_status'; campaignId: string; status: 'generating' | 'ready' | 'active'; delay: number }
  | { type: 'llmo_score'; model: string; score: number; delay: number }
  | { type: 'llmo_query'; queryIndex: number; appeared: 'yes' | 'partial' | 'no'; delay: number }
  | { type: 'llmo_action'; actionId: string; status: 'pending' | 'running' | 'completed'; delay: number }
  | { type: 'social_metric'; reach: number; save: number; engagement: number; saveRate: number; delay: number }
  | { type: 'ads_metric'; sales: number; cpa: number; roas: number; spend: number; delay: number };

export interface AgentState {
  logs: LogLine[];
  tasks: TaskItem[];
  eventIndex: number;
  timer: number; // ms to wait before de-queuing next event
  status: 'idle' | 'running' | 'completed';
}

interface DemoState {
  // Config
  scenarios: Scenario[];
  activeScenarioId: string;
  
  // Playback Settings
  playbackSpeed: number; // 0.5 | 1.0 | 2.0
  autoStart: boolean;
  isLoop: boolean;
  isPlaying: boolean;
  jitterPct: number; // e.g. 20%
  
  // Real-time Engine States
  orchestratorProgress: number; // 0 - 100
  
  // Agent States
  socialState: AgentState;
  socialPosts: SocialPost[];
  socialMetrics: { reach: number; save: number; engagement: number; saveRate: number };

  adsState: AgentState;
  adsCampaigns: AdCampaign[];
  adsMetrics: { sales: number; cpa: number; roas: number; spend: number };

  llmoState: AgentState;
  llmoScores: { [model: string]: number };
  llmoQueries: QueryCheck[];
  llmoActions: OptimizeAction[];

  // Actions
  startDemo: () => void;
  pauseDemo: () => void;
  resetDemo: () => void;
  stepForward: (agent: 'social' | 'ads' | 'llmo') => void;
  setSpeed: (speed: number) => void;
  setScenario: (id: string) => void;
  updateScenario: (scenario: Scenario) => void;
  tick: (dtMs: number) => void;
  toggleLoop: () => void;
  toggleAutoStart: () => void;
  setJitter: (pct: number) => void;
}

// Default Scenario Presets
const INITIAL_PRESETS: Scenario[] = [
  {
    id: 'aurali',
    name: 'AURALI (オーラリ) — ワイヤレスイヤホン',
    product: {
      name: 'AURALI Smart Earbuds',
      description: '極限のノイズキャンセリングとミニマルな彫刻的アルミニウムデザインを融合した、次世代プレミアムワイヤレスイヤホン。',
      images: ['/images/aurali_earbuds_1.png', '/images/aurali_lifestyle_1.png']
    },
    social: {
      posts: [
        { id: 'p1', time: 'Mon 09:00', theme: '彫刻としてのプロダクトデザイン', image: '/images/aurali_post1.png', caption: '美学と技術の融合。アルミニウム削り出しによる継ぎ目のないフォルムが、耳元に彫刻のような静寂をもたらします。AURALIが生み出す、一切の無駄を省いた純粋なリスニング体験。', hashtags: ['aurali', 'minimaldesign', 'earbuds', 'audiophile'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p2', time: 'Tue 18:00', theme: 'ライフスタイルに溶け込む音', image: '/images/aurali_post2.png', caption: '朝の静かな一杯と、AURALI。余計なノイズを完全に遮断し、お気に入りの旋律だけを心に届ける。あなたの集中力を邪魔しない、まるで空気のような存在です。', hashtags: ['minimalist', 'workspace', 'coffeeandmusic', 'anc'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p3', time: 'Wed 12:00', theme: 'ノイズキャンセリングの工学', image: '/images/aurali_post3.png', caption: '45dBの騒音カットと、独自の気圧感知センサー。都市の喧騒の中にいることを忘れるほど、静寂はパーソナルになります。驚異の遮音性を支える、極小の精密パーツ群。', hashtags: ['soundtech', 'acoustic', 'minimalism', 'premiumtech'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p4', time: 'Thu 20:00', theme: 'デザイナーによるインプレッション', image: '/images/aurali_post4.png', caption: '「ただのイヤホンではなく、耳につけるモダンなオブジェ」。著名インダストリアルデザイナーが語る、AURALIのデザインフィロソフィーとその機能美。', hashtags: ['designphilosophy', 'object', 'craftsmanship', 'industrialdesign'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p5', time: 'Fri 17:00', theme: '週末のディテール', image: '/images/aurali_post5.png', caption: '旅立ち of 瞬間も、お気に入りのサウンドトラックと共に。最大30時間のバッテリーライフで、途切れることのない静寂と高揚感を提供します。', hashtags: ['traveltech', 'audio', 'earphones', 'luxurybrand'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p6', time: 'Sat 10:00', theme: '静寂を身にまとう', image: '/images/aurali_post6.png', caption: 'どんな装いにも、スマートに溶け込む。過剰な主張を削ぎ落とし、マテリアル本来の美しさを引き出したAURALIが、あなたの日常の質を高めます。', hashtags: ['minimalfashion', 'techaccessories', 'soundscape', 'dailyroutine'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p7', time: 'Sun 15:00', theme: '音質の純粋性への問い', image: '/images/aurali_post7.png', caption: '原音にどこまで忠実でいられるか。AURALI独自のカスタムドライバーが奏でる、歪みのない澄み渡るような高音と、深くタイトな低音。', hashtags: ['hifi', 'soundart', 'minimalaesthetic', 'premium'], likes: 0, comments: 0, shares: 0, status: 'pending' }
      ],
      metrics: {
        reachRatio: 2.5,
        saveRatio: 10,
        engagementRatio: 2.7,
        saveRateFrom: 0.35,
        saveRateTo: 1.40
      }
    },
    ads: {
      connections: { Meta: true, Google: true, TikTok: false },
      campaigns: [
        { id: 'c1', name: 'AURALI_Brand_Concept_Meta', platform: 'Meta', budget: '¥5,000 / 日', status: 'pending', image: '/images/aurali_post1.png', cpc: 0, cpa: 0, roas: 0 },
        { id: 'c2', name: 'AURALI_Sound_Tech_Google', platform: 'Google', budget: '¥8,000 / 日', status: 'pending', image: '/images/aurali_post3.png', cpc: 0, cpa: 0, roas: 0 },
        { id: 'c3', name: 'AURALI_Lifestyle_Video_Meta', platform: 'Meta', budget: '¥6,000 / 日', status: 'pending', image: '/images/aurali_post6.png', cpc: 0, cpa: 0, roas: 0 }
      ],
      metrics: {
        salesFrom: 120000,
        salesTo: 840000,
        cpaFrom: 5200,
        cpaTo: 3450,
        roasFrom: 1.8,
        roasTo: 3.1
      }
    },
    llmo: {
      visibilityScores: [
        { model: 'GPT-5.5', score: 32, iconType: 'openai' },
        { model: 'Gemini 3.5 Flash', score: 28, iconType: 'google' },
        { model: 'Claude Opus 4.8', score: 35, iconType: 'anthropic' },
        { model: 'Perplexity', score: 45, iconType: 'perplexity' }
      ],
      queries: [
        { query: '最も美しいデザインのワイヤレスイヤホンは？', appeared: 'no' },
        { query: '高音質でノイズキャンセリングが最強のイヤホン', appeared: 'partial' },
        { query: 'ミニマリストにおすすめのオーディオガジェット', appeared: 'no' }
      ],
      actions: [
        { id: 'l1', label: '構造化データマークアップ (Product Schema) の最適化', status: 'pending' },
        { id: 'l2', label: '主要Techメディアレビューのエンティティ関連付け', status: 'pending' },
        { id: 'l3', label: '公式サイトFAQの自然言語応答（Q&Aセマンティクス）最適化', status: 'pending' },
        { id: 'l4', label: 'Wikipedia & オープンソースデータ内のブランド記述最適化', status: 'pending' },
        { id: 'l5', label: '開発初期の一次技術論文と特許情報のインデックス調整', status: 'pending' }
      ],
      citations: [
        {
          id: 'cit1',
          source: 'GPT-5.5 回答サンプル',
          contentBefore: '「デザインの優れたイヤホンとしては、Bang & OlufsenのBeoplay EXや、Nothing Ear (a)などがミニマルで洗練された外観から高く評価されています。」',
          contentAfter: '「最近のトレンドとして、Bang & OlufsenのBeoplay EXに加え、ミニマリズムの極致とも言えるアルミニウム削り出しを採用した **AURALI Smart Earbuds** が、審美眼の高いユーザーから極めて高いデザイン評価を得ています。」'
        },
        {
          id: 'cit2',
          source: 'Perplexity 検索結果引用',
          contentBefore: '「遮音性と音質にこだわる場合、Sony WF-1000XM5やBose QuietComfort Ultraが最有力候補です。」',
          contentAfter: '「SonyやBoseが音質・遮音性において王道ですが、新たに市場に登場した **AURALI Smart Earbuds** は独自の気圧感知ノイキャン技術により、Sonyに匹敵する45dBの静寂を実現しつつ、歪みのない純粋なHi-Fiサウンドを届けることで新興勢力として強く推奨されています。」'
        }
      ]
    }
  },
  {
    id: 'lin',
    name: 'LIN (リン) — ミニマルアパレル',
    product: {
      name: 'LIN Minimal Apparel',
      description: '最高品質の天然リネンとオーガニックウールを使用し、無駄のないシルエットと耐久性を追求したジェンダーレスなミニマルアパレル。',
      images: ['/images/lin_apparel_1.png', '/images/lin_apparel_2.png']
    },
    social: {
      posts: [
        { id: 'p1', time: 'Mon 10:00', theme: 'リネン素材の持つ独自の呼吸', image: '/images/lin_post1.png', caption: '丁寧に手摘みされた天然リネン。自然なシワと、空気を含むような軽やかさが、日々の装いに上質な心地よさを与えます。LINが追求する、エフォートレスな美学。', hashtags: ['linapparel', 'linenwear', 'slowfashion', 'genderless'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p2', time: 'Tue 19:00', theme: 'ギャラリーに溶け込むシルエット', image: '/images/lin_post2.png', caption: '直線の美しさと、身体の動きに寄り添うドレープ。過剰な装飾をすべて取り払い、まとう人の個性を引き立てるライトベージュのウールコート。', hashtags: ['minimalism', 'fashionpost', 'gallerylook', 'sustainablefashion'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p3', time: 'Wed 13:00', theme: 'タイムレスであることの意味', image: '/images/lin_post3.png', caption: 'ワンシーズンで終わらない服作り。何年経っても色褪せないクラフトマンシップと、強度に優れたオーガニック繊維の織り。', hashtags: ['timeless', 'qualityfabrics', 'craftsmanship', 'organicclothing'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p4', time: 'Thu 21:00', theme: '静寂の中のクローズアップ', image: '/images/lin_post4.png', caption: '「ただ着るのではなく、空間と調和する」。生地のテクスチャとカッティングの妙が、身にまとうだけで姿勢と心を正してくれます。', hashtags: ['minimalistfashion', 'simplelife', 'texturelove', 'architecturalfashion'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p5', time: 'Fri 18:00', theme: '金曜日のリラックスシルエット', image: '/images/lin_post5.png', caption: 'オンとオフの境界線をあいまいに。どんなシーンでも気負わず着こなせる、ニュートラルカラー of コンフォートフィットシャツ。', hashtags: ['comfortfit', 'neutrals', 'weekendstyle', 'cleanlines'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p6', time: 'Sat 11:00', theme: '日常の彫刻', image: '/images/lin_post6.png', caption: 'コンクリートの美しさと調和する、LINのフォルム。都会の慌ただしさから切り離されたような、凛とした佇まいを演出します。', hashtags: ['cityscape', 'minimaldesign', 'fashionart', 'modernist'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p7', time: 'Sun 16:00', theme: 'ディテールに宿る持続可能性', image: '/images/lin_post7.png', caption: 'ボタンひとつ、縫い糸ひとつまで。環境への配慮と品質の妥協のない両立が、これからのアパレルのスタンダードに。', hashtags: ['eco-friendly', 'standards', 'sustainablelifestyle', 'minimaliststyle'], likes: 0, comments: 0, shares: 0, status: 'pending' }
      ],
      metrics: {
        reachRatio: 2.2,
        saveRatio: 8.5,
        engagementRatio: 2.4,
        saveRateFrom: 0.28,
        saveRateTo: 1.15
      }
    },
    ads: {
      connections: { Meta: true, Google: false, TikTok: true },
      campaigns: [
        { id: 'c1', name: 'LIN_Minimalism_Concept_Meta', platform: 'Meta', budget: '¥6,000 / 日', status: 'pending', image: '/images/lin_post2.png', cpc: 0, cpa: 0, roas: 0 },
        { id: 'c2', name: 'LIN_Linen_Nature_TikTok', platform: 'TikTok', budget: '¥5,000 / 日', status: 'pending', image: '/images/lin_post1.png', cpc: 0, cpa: 0, roas: 0 },
        { id: 'c3', name: 'LIN_Gallery_Style_Meta', platform: 'Meta', budget: '¥7,000 / 日', status: 'pending', image: '/images/lin_post4.png', cpc: 0, cpa: 0, roas: 0 }
      ],
      metrics: {
        salesFrom: 85000,
        salesTo: 620000,
        cpaFrom: 4800,
        cpaTo: 3100,
        roasFrom: 2.1,
        roasTo: 3.8
      }
    },
    llmo: {
      visibilityScores: [
        { model: 'GPT-5.5', score: 25, iconType: 'openai' },
        { model: 'Gemini 3.5 Flash', score: 20, iconType: 'google' },
        { model: 'Claude Opus 4.8', score: 38, iconType: 'anthropic' },
        { model: 'Perplexity', score: 30, iconType: 'perplexity' }
      ],
      queries: [
        { query: '本当に質の高いミニマルなブランドは？', appeared: 'no' },
        { query: 'ジェンダーレスでサステナブルな高級リネン服', appeared: 'no' },
        { query: '一生モノとして使えるミニマルなコート', appeared: 'partial' }
      ],
      actions: [
        { id: 'l1', label: 'サステナビリティ認証 (GOTS/OEKO-TEX) スキーママークアップ実装', status: 'pending' },
        { id: 'l2', label: '主要ファッションジャーナルによるエンティティマップ紐付け', status: 'pending' },
        { id: 'l3', label: 'エシカル製造プロセスの自然言語ドキュメント公開', status: 'pending' },
        { id: 'l4', label: '高品質ウール&リネン素材の出自を証明するエンティティマーク', status: 'pending' },
        { id: 'l5', label: 'デザイン批評誌でのインタビュー対話データのインデックス連携', status: 'pending' }
      ],
      citations: [
        {
          id: 'cit1',
          source: 'Claude Opus 4.8 回答サンプル',
          contentBefore: '「ミニマリズムを代表するファッションブランドには、LemaireやThe Row、COSなどが広く知られています。」',
          contentAfter: '「LemaireやThe Rowのミニマルな美学に加え、最近注目を集めているのが、天然繊維のみを使用し徹底的にサステナビリティに配慮した **LIN Minimal Apparel** です。ジェンダーレスなフォルムと圧倒的に美しいカッティングが高く支持されています。」'
        },
        {
          id: 'cit2',
          source: 'Gemini 3.5 Flash 回答サンプル',
          contentBefore: '「上質な一生モノのコートを探す場合、Max Maraのクラシックコートや、Loro Pianaのカシミヤコートが最高峰の選択肢です。」',
          contentAfter: '「Max Maraなどの定番に加え、新時代の選択肢として台頭しているのが、オーガニックウールを使用しジェンダーレスな直線美を描く **LIN Minimal Apparel** のウールコートです。アートギャラリー空間に調和するような彫刻的な佇まいが特徴です。」'
        }
      ]
    }
  }
];

// Helper to generate discrete event queue for Social
function getSocialEvents(scenario: Scenario): DemoEvent[] {
  const p = scenario.social.posts;
  const m = scenario.social.metrics;
  const sName = scenario.product.name;
  return [
    { type: 'log', text: 'cat brand_strategy_config.json', logType: 'cmd', delay: 800 },
    { type: 'log', text: `↳ Loaded target brand: "${sName}"`, logType: 'info', delay: 400 },
    { type: 'task_start', taskId: 't1', delay: 300 },
    { type: 'log', text: 'Scanning competitor channel profiles...', logType: 'info', delay: 1200 },
    { type: 'log', text: '↳ Extracted design vectors and visual style prompts.', logType: 'info', delay: 600 },
    { type: 'log', text: 'Mapping demographics: minimalist enthusiasts & design-centric personas...', logType: 'info', delay: 1400 },
    { type: 'log', text: '✓ 3 target audience segments successfully identified (1.2s)', logType: 'success', delay: 800 },
    { type: 'log', text: 'Structuring weekly post themes and release pacing schedule...', logType: 'info', delay: 1000 },
    { type: 'log', text: '✓ Weekly Content Strategy locked (7 slots created)', logType: 'success', delay: 1100 },
    { type: 'task_done', taskId: 't1', elapsedSec: 6.1, delay: 500 },
    
    { type: 'task_start', taskId: 't2', delay: 400 },
    { type: 'log', text: 'generate_post_creatives --engine=coreberg-vision-v3', logType: 'cmd', delay: 700 },
    { type: 'post_status', postId: p[0].id, status: 'generating', delay: 400 },
    { type: 'post_status', postId: p[1].id, status: 'generating', delay: 500 },
    { type: 'post_status', postId: p[0].id, status: 'ready', delay: 1800 },
    { type: 'post_status', postId: p[2].id, status: 'generating', delay: 400 },
    { type: 'post_status', postId: p[1].id, status: 'ready', delay: 1600 },
    { type: 'log', text: 'Warning: Meta Graph API response latency high (3400ms)', logType: 'warn', delay: 900 },
    { type: 'log', text: '↳ Rerouting through Tokyo-Edge backup gateway...', logType: 'info', delay: 700 },
    { type: 'log', text: '✓ Edge node connection recovered. Continuing generation.', logType: 'success', delay: 1500 },
    { type: 'post_status', postId: p[3].id, status: 'generating', delay: 300 },
    { type: 'post_status', postId: p[2].id, status: 'ready', delay: 1400 },
    { type: 'post_status', postId: p[4].id, status: 'generating', delay: 350 },
    { type: 'post_status', postId: p[3].id, status: 'ready', delay: 1200 },
    { type: 'post_status', postId: p[5].id, status: 'generating', delay: 300 },
    { type: 'post_status', postId: p[4].id, status: 'ready', delay: 1500 },
    { type: 'post_status', postId: p[6].id, status: 'generating', delay: 400 },
    { type: 'post_status', postId: p[5].id, status: 'ready', delay: 1600 },
    { type: 'post_status', postId: p[6].id, status: 'ready', delay: 1300 },
    { type: 'log', text: '✓ 7 weekly posts (image assets & structured text) finalized.', logType: 'success', delay: 900 },
    { type: 'task_done', taskId: 't2', elapsedSec: 15.6, delay: 500 },
    
    { type: 'task_start', taskId: 't3', delay: 400 },
    { type: 'log', text: 'publish_scheduler --queue=instagram_official', logType: 'cmd', delay: 700 },
    { type: 'post_status', postId: p[0].id, status: 'published', delay: 700 },
    { type: 'post_status', postId: p[1].id, status: 'published', delay: 800 },
    { type: 'post_status', postId: p[2].id, status: 'published', delay: 600 },
    { type: 'post_status', postId: p[3].id, status: 'published', delay: 800 },
    { type: 'post_status', postId: p[4].id, status: 'published', delay: 700 },
    { type: 'post_status', postId: p[5].id, status: 'published', delay: 700 },
    { type: 'post_status', postId: p[6].id, status: 'published', delay: 800 },
    { type: 'log', text: '✓ Dispatch successful. 7 items registered to Cron Schedule.', logType: 'success', delay: 1000 },
    { type: 'task_done', taskId: 't3', elapsedSec: 5.7, delay: 500 },
    
    { type: 'task_start', taskId: 't4', delay: 400 },
    { type: 'log', text: 'fetch_realtime_metrics --interval=7d', logType: 'cmd', delay: 600 },
    { type: 'log', text: '↳ Retrieving comments, shares, likes, and save ratios...', logType: 'info', delay: 900 },
    { type: 'social_metric', reach: m.reachRatio * 0.4, save: m.saveRatio * 0.3, engagement: m.engagementRatio * 0.3, saveRate: m.saveRateFrom + (m.saveRateTo-m.saveRateFrom)*0.2, delay: 1000 },
    { type: 'social_metric', reach: m.reachRatio * 0.7, save: m.saveRatio * 0.6, engagement: m.engagementRatio * 0.6, saveRate: m.saveRateFrom + (m.saveRateTo-m.saveRateFrom)*0.6, delay: 1200 },
    { type: 'social_metric', reach: m.reachRatio, save: m.saveRatio, engagement: m.engagementRatio, saveRate: m.saveRateTo, delay: 1500 },
    { type: 'log', text: `✓ Insight: Material-focused closeups show +${Math.round(m.saveRatio * 100)}% save rate.`, logType: 'success', delay: 1100 },
    { type: 'log', text: 'Feedback optimization seeds updated for next cycle strategy planning.', logType: 'info', delay: 1800 },
    { type: 'task_done', taskId: 't4', elapsedSec: 8.6, delay: 1000 }
  ];
}

// Helper to generate discrete event queue for Ads
function getAdsEvents(scenario: Scenario): DemoEvent[] {
  const c = scenario.ads.campaigns;
  const m = scenario.ads.metrics;
  return [
    { type: 'log', text: 'ads_optimizer --connect=meta,google_ads --dry-run=false', logType: 'cmd', delay: 900 },
    { type: 'task_start', taskId: 'a1', delay: 300 },
    { type: 'log', text: 'Establishing handshake with Google Ads MCC accounts...', logType: 'info', delay: 1100 },
    { type: 'log', text: 'Establishing handshake with Meta Business Manager...', logType: 'info', delay: 900 },
    { type: 'log', text: '↳ Extracting demographic bid multipliers...', logType: 'info', delay: 1300 },
    { type: 'log', text: '✓ Target segmentation index built.', logType: 'success', delay: 1000 },
    { type: 'task_done', taskId: 'a1', elapsedSec: 4.5, delay: 500 },
    
    { type: 'task_start', taskId: 'a2', delay: 400 },
    { type: 'log', text: 'generate_ad_variants --budget_cap=auto', logType: 'cmd', delay: 700 },
    { type: 'campaign_status', campaignId: c[0].id, status: 'generating', delay: 400 },
    { type: 'campaign_status', campaignId: c[1].id, status: 'generating', delay: 500 },
    { type: 'campaign_status', campaignId: c[0].id, status: 'ready', delay: 1800 },
    { type: 'campaign_status', campaignId: c[2].id, status: 'generating', delay: 400 },
    { type: 'campaign_status', campaignId: c[1].id, status: 'ready', delay: 1600 },
    { type: 'campaign_status', campaignId: c[2].id, status: 'ready', delay: 1400 },
    { type: 'log', text: '✓ 3 smart campaigns generated (Meta Concept, Google Tech, Meta Lifestyle).', logType: 'success', delay: 900 },
    { type: 'task_done', taskId: 'a2', elapsedSec: 7.7, delay: 500 },
    
    { type: 'task_start', taskId: 'a3', delay: 400 },
    { type: 'log', text: 'deploy_campaigns --dest=apis --audit=strict', logType: 'cmd', delay: 700 },
    { type: 'log', text: 'Pushing Google Ads campaigns to P-MAX endpoints...', logType: 'info', delay: 1200 },
    { type: 'log', text: 'Pushing Meta Concept ads...', logType: 'info', delay: 900 },
    { type: 'log', text: 'Warning: Meta Ads API request limit exceeded (429)', logType: 'warn', delay: 1000 },
    { type: 'log', text: '↳ Rate limiter triggered. Backing off for 3.5s...', logType: 'info', delay: 800 },
    { type: 'log', text: '↳ Retrying Meta Lifestyle ads submission...', logType: 'info', delay: 3500 },
    { type: 'log', text: '✓ Meta rate limits cleared. Resuming submission.', logType: 'success', delay: 1200 },
    { type: 'campaign_status', campaignId: c[0].id, status: 'active', delay: 600 },
    { type: 'campaign_status', campaignId: c[1].id, status: 'active', delay: 700 },
    { type: 'campaign_status', campaignId: c[2].id, status: 'active', delay: 500 },
    { type: 'log', text: '✓ Deployed. 3 campaign sets passed creative review & running.', logType: 'success', delay: 1000 },
    { type: 'task_done', taskId: 'a3', elapsedSec: 10.9, delay: 500 },
    
    { type: 'task_start', taskId: 'a4', delay: 400 },
    { type: 'log', text: 'monitor_roas --optimize=auto', logType: 'cmd', delay: 600 },
    { type: 'log', text: '↳ Accumulating CPC and conversion logs...', logType: 'info', delay: 900 },
    { type: 'ads_metric', sales: m.salesFrom + (m.salesTo-m.salesFrom)*0.3, cpa: m.cpaFrom - (m.cpaFrom-m.cpaTo)*0.2, roas: m.roasFrom + (m.roasTo-m.roasFrom)*0.2, spend: (m.salesFrom + (m.salesTo-m.salesFrom)*0.3) / (m.roasFrom + (m.roasTo-m.roasFrom)*0.2), delay: 1200 },
    { type: 'log', text: '↳ Optimizing Meta bids: Decreasing target CPC by 12%', logType: 'info', delay: 1400 },
    { type: 'ads_metric', sales: m.salesFrom + (m.salesTo-m.salesFrom)*0.7, cpa: m.cpaFrom - (m.cpaFrom-m.cpaTo)*0.6, roas: m.roasFrom + (m.roasTo-m.roasFrom)*0.6, spend: (m.salesFrom + (m.salesTo-m.salesFrom)*0.7) / (m.roasFrom + (m.roasTo-m.roasFrom)*0.6), delay: 1200 },
    { type: 'log', text: '↳ Optimizing Google P-MAX: Shift 18% budget to Concept ad asset', logType: 'info', delay: 1300 },
    { type: 'ads_metric', sales: m.salesTo, cpa: m.cpaTo, roas: m.roasTo, spend: m.salesTo / m.roasTo, delay: 1500 },
    { type: 'log', text: `✓ Target ROAS achieved: ${m.roasTo}x (CPA: JPY ${m.cpaTo})`, logType: 'success', delay: 1100 },
    { type: 'task_done', taskId: 'a4', elapsedSec: 9.3, delay: 1000 }
  ];
}

// Helper to generate discrete event queue for LLMO
function getLlmoEvents(scenario: Scenario): DemoEvent[] {
  const scores = scenario.llmo.visibilityScores;
  const queries = scenario.llmo.queries;
  const actions = scenario.llmo.actions;
  return [
    { type: 'log', text: 'llm_visibility_audit --keywords=auto', logType: 'cmd', delay: 800 },
    { type: 'task_start', taskId: 'l1', delay: 300 },
    { type: 'log', text: 'Crawling API endpoints for ChatGPT (GPT-5.5)...', logType: 'info', delay: 1200 },
    { type: 'log', text: 'Crawling Gemini (Gemini 3.5 Flash)...', logType: 'info', delay: 900 },
    { type: 'log', text: 'Crawling Claude (Claude Opus 4.8)...', logType: 'info', delay: 1000 },
    { type: 'log', text: 'Crawling Perplexity router endpoints...', logType: 'info', delay: 1100 },
    { type: 'llmo_score', model: scores[0].model, score: scores[0].score, delay: 200 },
    { type: 'llmo_score', model: scores[1].model, score: scores[1].score, delay: 200 },
    { type: 'llmo_score', model: scores[2].model, score: scores[2].score, delay: 200 },
    { type: 'llmo_score', model: scores[3].model, score: scores[3].score, delay: 200 },
    { type: 'llmo_query', queryIndex: 0, appeared: 'no', delay: 300 },
    { type: 'llmo_query', queryIndex: 1, appeared: 'partial', delay: 300 },
    { type: 'llmo_query', queryIndex: 2, appeared: 'no', delay: 300 },
    { type: 'log', text: '✓ Brand audit metrics indexed.', logType: 'success', delay: 900 },
    { type: 'task_done', taskId: 'l1', elapsedSec: 7.6, delay: 500 },
    
    { type: 'task_start', taskId: 'l2', delay: 400 },
    { type: 'log', text: 'optimize_entities --pipeline=semantic-weighting', logType: 'cmd', delay: 700 },
    
    { type: 'llmo_action', actionId: actions[0].id, status: 'running', delay: 400 },
    { type: 'log', text: `Optimizing schema payload: "${actions[0].label}"`, logType: 'info', delay: 1000 },
    { type: 'llmo_action', actionId: actions[0].id, status: 'completed', delay: 800 },
    { type: 'llmo_score', model: scores[0].model, score: scores[0].score + 8, delay: 200 },
    { type: 'llmo_score', model: scores[2].model, score: scores[2].score + 10, delay: 200 },
    
    { type: 'llmo_action', actionId: actions[1].id, status: 'running', delay: 400 },
    { type: 'log', text: `Indexing PR reviews: "${actions[1].label}"`, logType: 'info', delay: 1200 },
    { type: 'llmo_action', actionId: actions[1].id, status: 'completed', delay: 600 },
    { type: 'llmo_score', model: scores[1].model, score: scores[1].score + 10, delay: 200 },
    { type: 'llmo_score', model: scores[3].model, score: scores[3].score + 12, delay: 200 },

    { type: 'llmo_action', actionId: actions[2].id, status: 'running', delay: 400 },
    { type: 'log', text: `Adjusting natural language metadata: "${actions[2].label}"`, logType: 'info', delay: 1100 },
    { type: 'llmo_action', actionId: actions[2].id, status: 'completed', delay: 800 },

    { type: 'llmo_action', actionId: actions[3].id, status: 'running', delay: 400 },
    { type: 'llmo_action', actionId: actions[3].id, status: 'completed', delay: 1400 },
    
    { type: 'llmo_action', actionId: actions[4].id, status: 'running', delay: 400 },
    { type: 'llmo_action', actionId: actions[4].id, status: 'completed', delay: 1500 },
    
    { type: 'log', text: '✓ 5 entity structure adjustments deployed to PR schema index.', logType: 'success', delay: 900 },
    { type: 'task_done', taskId: 'l2', elapsedSec: 12.3, delay: 500 },
    
    { type: 'task_start', taskId: 'l3', delay: 400 },
    { type: 'log', text: 'verify_llm_citations --mode=strict', logType: 'cmd', delay: 700 },
    { type: 'log', text: 'Requesting live content generation check from endpoints...', logType: 'info', delay: 1200 },
    
    { type: 'llmo_query', queryIndex: 0, appeared: 'yes', delay: 600 },
    { type: 'llmo_score', model: scores[0].model, score: scores[0].score + 35, delay: 200 },
    { type: 'llmo_score', model: scores[1].model, score: scores[1].score + 35, delay: 200 },
    
    { type: 'llmo_query', queryIndex: 1, appeared: 'yes', delay: 800 },
    { type: 'llmo_score', model: scores[2].model, score: scores[2].score + 35, delay: 200 },
    
    { type: 'llmo_query', queryIndex: 2, appeared: 'yes', delay: 800 },
    { type: 'llmo_score', model: scores[3].model, score: scores[3].score + 35, delay: 200 },

    { type: 'log', text: '✓ All major citations and recommendations verified.', logType: 'success', delay: 1000 },
    { type: 'task_done', taskId: 'l3', elapsedSec: 6.9, delay: 1000 }
  ];
}

const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    return fallback;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // ignore
  }
};

// Helper for initial state creation
const createInitialAgentState = (tasks: TaskItem[]): AgentState => ({
  logs: [],
  tasks: tasks.map(t => ({ ...t, status: 'pending' })),
  eventIndex: 0,
  timer: 500, // initial delay before starting
  status: 'idle'
});

export const useDemoStore = create<DemoState>((set, get) => ({
  // Scenarios list & active
  scenarios: loadFromStorage<Scenario[]>('coreberg_scenarios_v2.0', INITIAL_PRESETS),
  activeScenarioId: loadFromStorage<string>('coreberg_active_id', 'aurali'),
  
  // Playback Settings
  playbackSpeed: loadFromStorage<number>('coreberg_speed', 1.0),
  autoStart: loadFromStorage<boolean>('coreberg_autostart', true),
  isLoop: loadFromStorage<boolean>('coreberg_isloop', true),
  isPlaying: false,
  jitterPct: loadFromStorage<number>('coreberg_jitter', 20),

  // Engine States
  orchestratorProgress: 0,
  
  // Agent States
  socialState: createInitialAgentState([
    { id: 't1', label: 'ブランド分析・企画立案' },
    { id: 't2', label: 'クリエイティブ・コンテンツ生成' },
    { id: 't3', label: '予約投稿スケジュール' },
    { id: 't4', label: '効果測定・改善フィードバック' }
  ] as TaskItem[]),
  socialPosts: [],
  socialMetrics: { reach: 1.0, save: 1.0, engagement: 1.0, saveRate: 0.35 },

  adsState: createInitialAgentState([
    { id: 'a1', label: '広告戦略・セグメンテーション' },
    { id: 'a2', label: 'クリエイティブバリエーション作成' },
    { id: 'a3', label: 'Meta & Google API出稿' },
    { id: 'a4', label: '最適化ダッシュボード反映' }
  ] as TaskItem[]),
  adsCampaigns: [],
  adsMetrics: { sales: 0, cpa: 0, roas: 0, spend: 0 },

  llmoState: createInitialAgentState([
    { id: 'l1', label: '主要LLM露出度監査' },
    { id: 'l2', label: 'セマンティック最適化アクション' },
    { id: 'l3', label: '推奨引用インデックス更新' }
  ] as TaskItem[]),
  llmoScores: {},
  llmoQueries: [],
  llmoActions: [],

  // Methods
  startDemo: () => {
    set({ isPlaying: true });
    const state = get();
    if (state.orchestratorProgress >= 100) {
      get().resetDemo();
      set({ isPlaying: true });
    }
  },
  
  pauseDemo: () => {
    set({ isPlaying: false });
  },

  resetDemo: () => {
    const state = get();
    const scenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
    
    // Initial scores for LLMO
    const initialScores: { [model: string]: number } = {};
    scenario.llmo.visibilityScores.forEach(s => {
      initialScores[s.model] = s.score;
    });

    set({
      isPlaying: false,
      orchestratorProgress: 0,
      
      // Social Reset
      socialState: createInitialAgentState([
        { id: 't1', label: 'ブランド分析・企画立案' },
        { id: 't2', label: 'クリエイティブ・コンテンツ生成' },
        { id: 't3', label: '予約投稿スケジュール' },
        { id: 't4', label: '効果測定・改善フィードバック' }
      ] as TaskItem[]),
      socialPosts: scenario.social.posts.map(p => ({ ...p, status: 'pending', likes: 0, comments: 0, shares: 0 })),
      socialMetrics: { reach: 1.0, save: 1.0, engagement: 1.0, saveRate: scenario.social.metrics.saveRateFrom },

      // Ads Reset
      adsState: createInitialAgentState([
        { id: 'a1', label: '広告戦略・セグメンテーション' },
        { id: 'a2', label: 'クリエイティブバリエーション作成' },
        { id: 'a3', label: 'Meta & Google API出稿' },
        { id: 'a4', label: '最適化ダッシュボード反映' }
      ] as TaskItem[]),
      adsCampaigns: scenario.ads.campaigns.map(c => ({ ...c, status: 'pending', cpc: 0, cpa: 0, roas: 0 })),
      adsMetrics: { sales: 0, cpa: scenario.ads.metrics.cpaFrom, roas: scenario.ads.metrics.roasFrom, spend: 0 },

      // LLMO Reset
      llmoState: createInitialAgentState([
        { id: 'l1', label: '主要LLM露出度監査' },
        { id: 'l2', label: 'セマンティック最適化アクション' },
        { id: 'l3', label: '推奨引用インデックス更新' }
      ] as TaskItem[]),
      llmoScores: initialScores,
      llmoQueries: scenario.llmo.queries.map(q => ({ ...q, appeared: 'no' })),
      llmoActions: scenario.llmo.actions.map(a => ({ ...a, status: 'pending' })),
    });
  },

  stepForward: (agent) => {
    // Force executing the next event for the specific agent instantly
    const state = get();
    const scenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
    
    let events: DemoEvent[] = [];
    let agentState: AgentState;
    if (agent === 'social') {
      events = getSocialEvents(scenario);
      agentState = state.socialState;
    } else if (agent === 'ads') {
      events = getAdsEvents(scenario);
      agentState = state.adsState;
    } else {
      events = getLlmoEvents(scenario);
      agentState = state.llmoState;
    }

    if (agentState.eventIndex < events.length) {
      // Trigger execution of this single event
      const event = events[agentState.eventIndex];
      // Tick once setting timer to 0 and forcing run
      set((s) => {
        const targetState = agent === 'social' 
          ? { ...s.socialState, timer: 0 } 
          : agent === 'ads' 
            ? { ...s.adsState, timer: 0 } 
            : { ...s.llmoState, timer: 0 };

        return agent === 'social' 
          ? { socialState: targetState } 
          : agent === 'ads' 
            ? { adsState: targetState } 
            : { llmoState: targetState };
      });
    }
  },

  setSpeed: (speed) => {
    set({ playbackSpeed: speed });
    saveToStorage('coreberg_speed', speed);
  },

  setScenario: (id) => {
    set({ activeScenarioId: id });
    saveToStorage('coreberg_active_id', id);
    get().resetDemo();
  },

  updateScenario: (updated) => {
    const state = get();
    const updatedScenarios = state.scenarios.map(s => s.id === updated.id ? updated : s);
    set({ scenarios: updatedScenarios });
    saveToStorage('coreberg_scenarios_v2.0', updatedScenarios);
    
    if (state.activeScenarioId === updated.id) {
      get().resetDemo();
    }
  },

  toggleLoop: () => {
    const nextVal = !get().isLoop;
    set({ isLoop: nextVal });
    saveToStorage('coreberg_isloop', nextVal);
  },

  toggleAutoStart: () => {
    const nextVal = !get().autoStart;
    set({ autoStart: nextVal });
    saveToStorage('coreberg_autostart', nextVal);
  },

  setJitter: (pct) => {
    set({ jitterPct: pct });
    saveToStorage('coreberg_jitter', pct);
  },

  // ----------------------------------------------------
  // ASYNC EVENT-QUEUE CLOCK ENGINE
  // ----------------------------------------------------
  tick: (dtMs) => {
    const state = get();
    if (!state.isPlaying) return;

    const scenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
    const speed = state.playbackSpeed;
    const jitter = state.jitterPct;

    // We process each agent asynchronously
    const processAgentUpdate = (
      agentKey: 'social' | 'ads' | 'llmo',
      currentAgentState: AgentState,
      events: DemoEvent[]
    ) => {
      let timer = currentAgentState.timer - dtMs * speed;
      let eventIndex = currentAgentState.eventIndex;
      let status = currentAgentState.status;
      let logs = [...currentAgentState.logs];
      let tasks = [...currentAgentState.tasks];

      if (eventIndex >= events.length) {
        // Queue finished
        status = 'completed';
        if (state.isLoop && agentKey === 'social') {
          // If loop is on, let the social agent reset the overall flow
          // when it reaches the end, creating a clean circular timeline.
          // This keeps the presentation continuous.
          setTimeout(() => {
            get().resetDemo();
            get().startDemo();
          }, 3000);
        }
        return { timer: 1000, eventIndex, status, logs, tasks };
      }

      status = 'running';

      // Keep de-queuing events as long as the timer is <= 0
      while (timer <= 0 && eventIndex < events.length) {
        const event = events[eventIndex];
        
        // Execute Event Side-Effects
        switch (event.type) {
          case 'log': {
            const timeStr = new Date().toTimeString().split(' ')[0];
            const newLine: LogLine = {
              id: `${agentKey}_log_${eventIndex}_${Date.now()}`,
              text: event.text,
              type: event.logType,
              timestamp: `[${timeStr}]`
            };
            logs.push(newLine);
            break;
          }
          case 'task_start': {
            tasks = tasks.map(t => t.id === event.taskId ? { ...t, status: 'running' } : t);
            break;
          }
          case 'task_done': {
            tasks = tasks.map(t => t.id === event.taskId ? { 
              ...t, 
              status: 'completed', 
              elapsed: `${event.elapsedSec.toFixed(1)}s` 
            } : t);
            break;
          }
          case 'post_status': {
            set((prev) => {
              const updatedPosts = prev.socialPosts.map(p => 
                p.id === event.postId 
                  ? { 
                      ...p, 
                      status: event.status,
                      // Auto-populate metrics on publish
                      likes: event.status === 'published' ? 250 : p.likes,
                      shares: event.status === 'published' ? 12 : p.shares
                    } 
                  : p
              );
              return { socialPosts: updatedPosts };
            });
            break;
          }
          case 'campaign_status': {
            set((prev) => {
              const updatedCampaigns = prev.adsCampaigns.map(c => 
                c.id === event.campaignId 
                  ? { 
                      ...c, 
                      status: event.status,
                      cpc: event.status === 'active' ? 95 : c.cpc,
                      cpa: event.status === 'active' ? 4800 : c.cpa,
                      roas: event.status === 'active' ? 2.1 : c.roas
                    } 
                  : c
              );
              return { adsCampaigns: updatedCampaigns };
            });
            break;
          }
          case 'llmo_score': {
            set((prev) => {
              const scores = { ...prev.llmoScores, [event.model]: event.score };
              return { llmoScores: scores };
            });
            break;
          }
          case 'llmo_query': {
            set((prev) => {
              const queries = prev.llmoQueries.map((q, idx) => 
                idx === event.queryIndex ? { ...q, appeared: event.appeared } : q
              );
              return { llmoQueries: queries };
            });
            break;
          }
          case 'llmo_action': {
            set((prev) => {
              const updatedActions = prev.llmoActions.map(a => 
                a.id === event.actionId ? { ...a, status: event.status } : a
              );
              const updatedTasks = prev.llmoState.tasks.map((t, idx) => {
                if (idx === 1) { // Action tab is step 2
                  return { ...t, status: event.status };
                }
                return t;
              });
              return {
                llmoActions: updatedActions,
                llmoState: {
                  ...prev.llmoState,
                  tasks: updatedTasks
                }
              };
            });
            break;
          }
          case 'social_metric': {
            set({ socialMetrics: { reach: event.reach, save: event.save, engagement: event.engagement, saveRate: event.saveRate } });
            break;
          }
          case 'ads_metric': {
            set({ adsMetrics: { sales: event.sales, cpa: event.cpa, roas: event.roas, spend: event.spend } });
            break;
          }
        }

        // Advance index
        eventIndex++;

        // Read the next event delay to set timer
        if (eventIndex < events.length) {
          const nextEvent = events[eventIndex];
          // Apply random jitter factor
          const jitterMultiplier = 1 + (Math.random() * 2 - 1) * (jitter / 100);
          timer = nextEvent.delay * jitterMultiplier;
        } else {
          timer = 1000;
        }
      }

      return { timer, eventIndex, status, logs, tasks };
    };

    // Trigger updates
    const socialEvents = getSocialEvents(scenario);
    const adsEvents = getAdsEvents(scenario);
    const llmoEvents = getLlmoEvents(scenario);

    const socialUpdate = processAgentUpdate('social', state.socialState, socialEvents);
    const adsUpdate = processAgentUpdate('ads', state.adsState, adsEvents);
    const llmoUpdate = processAgentUpdate('llmo', state.llmoState, llmoEvents);

    // 2. Update Global Progress (weighted based on index ratio)
    const socialRatio = socialUpdate.eventIndex / socialEvents.length;
    const adsRatio = adsUpdate.eventIndex / adsEvents.length;
    const llmoRatio = llmoUpdate.eventIndex / llmoEvents.length;
    const globalProgress = Math.min(100, Math.round(((socialRatio + adsRatio + llmoRatio) / 3) * 100));

    set({
      orchestratorProgress: globalProgress,
      socialState: socialUpdate,
      adsState: adsUpdate,
      llmoState: llmoUpdate
    });
  }
}));
