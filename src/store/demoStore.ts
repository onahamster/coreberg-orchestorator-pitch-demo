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
  strategyLogs: string[];
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
  strategyLogs: string[];
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

// Zustand store state definition
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
  // Global ticks and progresses
  orchestratorProgress: number; // 0 - 100
  
  // Social states
  socialStepIndex: number; // 0: Strategy, 1: Creative, 2: Publish, 3: Optimize
  socialStepProgress: number; // 0 - 100 within step
  socialStepDuration: number; // current step target duration in ms (with jitter)
  socialStrategyLogsVisible: string[];
  socialPosts: SocialPost[];
  socialMetrics: { reach: number; save: number; engagement: number; saveRate: number };

  // Ads states
  adsStepIndex: number; // 0: Strategy, 1: Creative, 2: Deploy, 3: Dashboard
  adsStepProgress: number;
  adsStepDuration: number;
  adsStrategyLogsVisible: string[];
  adsCampaigns: AdCampaign[];
  adsMetrics: { sales: number; cpa: number; roas: number; spend: number };

  // LLMO states
  llmoStepIndex: number; // 0: Visibility, 1: Actions, 2: Citations & Updates
  llmoStepProgress: number;
  llmoStepDuration: number;
  llmoScores: { [model: string]: number };
  llmoActions: OptimizeAction[];
  llmoQueries: QueryCheck[];

  // Actions
  startDemo: () => void;
  pauseDemo: () => void;
  resetDemo: () => void;
  stepForward: () => void;
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
      strategyLogs: [
        '商品メタデータ "AURALI Smart Earbuds" の解析完了。',
        'コアバリューを「彫刻的な静寂」「高品位サウンド」に設定。',
        '競合ノイズキャンセリング製品（B&O, Master & Dynamic）のポジショニング分析を実行。',
        '主要ターゲット層：30代前後ミニマリスト、デザイナー、テックアーリーアダプター。',
        '今週の投稿戦略カレンダー（7枠）を作成しました。配信を開始します。'
      ],
      posts: [
        { id: 'p1', time: 'Mon 09:00', theme: '彫刻としてのプロダクトデザイン', image: '/images/aurali_earbuds_1.png', caption: '美学と技術の融合。アルミニウム削り出しによる継ぎ目のないフォルムが、耳元に彫刻のような静寂をもたらします。AURALIが生み出す、一切の無駄を省いた純粋なリスニング体験。', hashtags: ['aurali', 'minimaldesign', 'earbuds', 'audiophile'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p2', time: 'Tue 18:00', theme: 'ライフスタイルに溶け込む音', image: '/images/aurali_lifestyle_1.png', caption: '朝の静かな一杯と、AURALI。余計なノイズを完全に遮断し、お気に入りの旋律だけを心に届ける。あなたの集中力を邪魔しない、まるで空気のような存在です。', hashtags: ['minimalist', 'workspace', 'coffeeandmusic', 'anc'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p3', time: 'Wed 12:00', theme: 'ノイズキャンセリングの工学', image: '/images/aurali_earbuds_1.png', caption: '45dBの騒音カットと、独自の気圧感知センサー。都市の喧騒の中にいることを忘れるほど、静寂はパーソナルになります。驚異の遮音性を支える、極小の精密パーツ群。', hashtags: ['soundtech', 'acoustic', 'minimalism', 'premiumtech'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p4', time: 'Thu 20:00', theme: 'デザイナーによるインプレッション', image: '/images/aurali_lifestyle_1.png', caption: '「ただのイヤホンではなく、耳につけるモダンなオブジェ」。著名インダストリアルデザイナーが語る、AURALIのデザインフィロソフィーとその機能美。', hashtags: ['designphilosophy', 'object', 'craftsmanship', 'industrialdesign'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p5', time: 'Fri 17:00', theme: '週末のディテール', image: '/images/aurali_earbuds_1.png', caption: '旅立ちの瞬間も、お気に入りのサウンドトラックと共に。最大30時間のバッテリーライフで、途切れることのない静寂と高揚感を提供します。', hashtags: ['traveltech', 'audio', 'earphones', 'luxurybrand'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p6', time: 'Sat 10:00', theme: '静寂を身にまとう', image: '/images/aurali_lifestyle_1.png', caption: 'どんな装いにも、スマートに溶け込む。過剰な主張を削ぎ落とし、マテリアル本来の美しさを引き出したAURALIが、あなたの日常の質を高めます。', hashtags: ['minimalfashion', 'techaccessories', 'soundscape', 'dailyroutine'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p7', time: 'Sun 15:00', theme: '音質の純粋性への問い', image: '/images/aurali_earbuds_1.png', caption: '原音にどこまで忠実でいられるか。AURALI独自のカスタムドライバーが奏でる、歪みのない澄み渡るような高音と、深くタイトな低音。', hashtags: ['hifi', 'soundart', 'minimalaesthetic', 'premium'], likes: 0, comments: 0, shares: 0, status: 'pending' }
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
      strategyLogs: [
        '配信アカウント「AURALI Official」の接続を確認。',
        '高購買意欲層：類似製品購入者、デザイン・ガジェット関心層へのセグメンテーション完了。',
        '広告アセットの自動生成を開始：Meta用Reelsサイズ 2パターン / Google用P-MAX 2パターン。',
        '推定目標ROASを設定: 280% / CPA許容値 4,000円。',
        '自動配信入札エンジンをアクティブにしました。審査へ送信します。'
      ],
      campaigns: [
        { id: 'c1', name: 'AURALI_Brand_Concept_Meta', platform: 'Meta', budget: '¥5,000 / 日', status: 'pending', image: '/images/aurali_earbuds_1.png', cpc: 0, cpa: 0, roas: 0 },
        { id: 'c2', name: 'AURALI_Sound_Tech_Google', platform: 'Google', budget: '¥8,000 / 日', status: 'pending', image: '/images/aurali_lifestyle_1.png', cpc: 0, cpa: 0, roas: 0 },
        { id: 'c3', name: 'AURALI_Lifestyle_Video_Meta', platform: 'Meta', budget: '¥6,000 / 日', status: 'pending', image: '/images/aurali_lifestyle_1.png', cpc: 0, cpa: 0, roas: 0 }
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
      strategyLogs: [
        '商品メタデータ "LIN Minimal Apparel" の解析完了。',
        'コアバリューを「エフォートレスな美学」「サステナブルかつ普遍的」に設定。',
        '競合アパレルブランド（Lemaire, Margaret Howell）のSNSコンテンツ分析。',
        '主要ターゲット層：丁寧な暮らしを好む20代後半〜40代、クリエイター、ミニマリスト。',
        '今週の投稿戦略カレンダー（7枠）を作成しました。配信を開始します。'
      ],
      posts: [
        { id: 'p1', time: 'Mon 10:00', theme: 'リネン素材の持つ独自の呼吸', image: '/images/lin_apparel_1.png', caption: '丁寧に手摘みされた天然リネン。自然なシワと、空気を含むような軽やかさが、日々の装いに上質な心地よさを与えます。LINが追求する、エフォートレスな美学。', hashtags: ['linapparel', 'linenwear', 'slowfashion', 'genderless'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p2', time: 'Tue 19:00', theme: 'ギャラリーに溶け込むシルエット', image: '/images/lin_apparel_2.png', caption: '直線の美しさと、身体の動きに寄り添うドレープ。過剰な装飾をすべて取り払い、まとう人の個性を引き立てるライトベージュのウールコート。', hashtags: ['minimalism', 'fashionpost', 'gallerylook', 'sustainablefashion'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p3', time: 'Wed 13:00', theme: 'タイムレスであることの意味', image: '/images/lin_apparel_1.png', caption: 'ワンシーズンで終わらない服作り。何年経っても色褪せないクラフトマンシップと、強度に優れたオーガニック繊維の織り。', hashtags: ['timeless', 'qualityfabrics', 'craftsmanship', 'organicclothing'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p4', time: 'Thu 21:00', theme: '静寂の中のクローズアップ', image: '/images/lin_apparel_2.png', caption: '「ただ着るのではなく、空間と調和する」。生地のテクスチャとカッティングの妙が、身にまとうだけで姿勢と心を正してくれます。', hashtags: ['minimalistfashion', 'simplelife', 'texturelove', 'architecturalfashion'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p5', time: 'Fri 18:00', theme: '金曜日のリラックスシルエット', image: '/images/lin_apparel_1.png', caption: 'オンとオフの境界線をあいまいに。どんなシーンでも気負わず着こなせる、ニュートラルカラーのコンフォートフィットシャツ。', hashtags: ['comfortfit', 'neutrals', 'weekendstyle', 'cleanlines'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p6', time: 'Sat 11:00', theme: '日常の彫刻', image: '/images/lin_apparel_2.png', caption: 'コンクリートの美しさと調和する、LINのフォルム。都会の慌ただしさから切り離されたような、凛とした佇まいを演出します。', hashtags: ['cityscape', 'minimaldesign', 'fashionart', 'modernist'], likes: 0, comments: 0, shares: 0, status: 'pending' },
        { id: 'p7', time: 'Sun 16:00', theme: 'ディテールに宿る持続可能性', image: '/images/lin_apparel_1.png', caption: 'ボタンひとつ、縫い糸ひとつまで。環境への配慮と品質の妥協のない両立が、これからのアパレルのスタンダードに。', hashtags: ['eco-friendly', 'standards', 'sustainablelifestyle', 'minimaliststyle'], likes: 0, comments: 0, shares: 0, status: 'pending' }
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
      strategyLogs: [
        '配信アカウント「LIN Official Store」の接続を確認。',
        'ターゲットセグメント：サステナブルアパレル、ミニマリズム、デザイナーズブランド関心層。',
        '広告アセットの自動生成を開始：Meta / TikTok向け縦型リール素材 3パターン。',
        '目標ROASを設定: 310% / 目標CPA 3,200円。',
        'スマートクリエイティブ入札をオンにしました。Meta & TikTokへ一括送信します。'
      ],
      campaigns: [
        { id: 'c1', name: 'LIN_Minimalism_Concept_Meta', platform: 'Meta', budget: '¥6,000 / 日', status: 'pending', image: '/images/lin_apparel_1.png', cpc: 0, cpa: 0, roas: 0 },
        { id: 'c2', name: 'LIN_Linen_Nature_TikTok', platform: 'TikTok', budget: '¥5,000 / 日', status: 'pending', image: '/images/lin_apparel_1.png', cpc: 0, cpa: 0, roas: 0 },
        { id: 'c3', name: 'LIN_Gallery_Style_Meta', platform: 'Meta', budget: '¥7,000 / 日', status: 'pending', image: '/images/lin_apparel_2.png', cpc: 0, cpa: 0, roas: 0 }
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

// Helper to resolve duration with random jitter
function resolveStepDuration(baseMs: number, speed: number, jitterPct: number): number {
  const jitterVal = (Math.random() * 2 - 1) * (jitterPct / 100); // e.g. ±20% -> -0.2 to +0.2
  return Math.max(500, (baseMs * (1 + jitterVal)) / speed);
}

// Scenarios step metrics calculation
// 1. Social steps configuration
const SOCIAL_STEP_DEFAULTS = [
  { label: 'Strategy Planning', baseMs: 8000 },
  { label: 'Creative Content Generation', baseMs: 12000 },
  { label: 'Schedule & Publish', baseMs: 6000 },
  { label: 'Optimize & Loop Feedbacks', baseMs: 8000 }
];

// 2. Ads steps configuration
const ADS_STEP_DEFAULTS = [
  { label: 'Strategy & Segmentation', baseMs: 9000 },
  { label: 'Creative Generation', baseMs: 11000 },
  { label: 'Ad Campaign Deployment', baseMs: 7000 },
  { label: 'Dashboard & CPA Optimization', baseMs: 8000 }
];

// 3. LLMO steps configuration
const LLMO_STEP_DEFAULTS = [
  { label: 'AI Visibility Audit', baseMs: 7000 },
  { label: 'Entity & Content Optimization', baseMs: 12000 },
  { label: 'Citations Update', baseMs: 7000 }
];

// Load localStorage helper if client-side
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

export const useDemoStore = create<DemoState>((set, get) => ({
  // Scenarios list & active
  scenarios: loadFromStorage<Scenario[]>('coreberg_scenarios', INITIAL_PRESETS),
  activeScenarioId: loadFromStorage<string>('coreberg_active_id', 'aurali'),
  
  // Playback Settings
  playbackSpeed: loadFromStorage<number>('coreberg_speed', 1.0),
  autoStart: loadFromStorage<boolean>('coreberg_autostart', true),
  isLoop: loadFromStorage<boolean>('coreberg_isloop', true),
  isPlaying: false,
  jitterPct: loadFromStorage<number>('coreberg_jitter', 20),

  // Engine States
  orchestratorProgress: 0,
  
  // Social
  socialStepIndex: 0,
  socialStepProgress: 0,
  socialStepDuration: 8000,
  socialStrategyLogsVisible: [],
  socialPosts: [],
  socialMetrics: { reach: 1.0, save: 1.0, engagement: 1.0, saveRate: 0.35 },

  // Ads
  adsStepIndex: 0,
  adsStepProgress: 0,
  adsStepDuration: 9000,
  adsStrategyLogsVisible: [],
  adsCampaigns: [],
  adsMetrics: { sales: 0, cpa: 0, roas: 0, spend: 0 },

  // LLMO
  llmoStepIndex: 0,
  llmoStepProgress: 0,
  llmoStepDuration: 7000,
  llmoScores: {},
  llmoActions: [],
  llmoQueries: [],

  // Methods
  startDemo: () => {
    set({ isPlaying: true });
    
    // If resetting from completed, restart
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
    
    // Calculate first step durations
    const speed = state.playbackSpeed;
    const jitter = state.jitterPct;
    
    const socialDur = resolveStepDuration(SOCIAL_STEP_DEFAULTS[0].baseMs, speed, jitter);
    const adsDur = resolveStepDuration(ADS_STEP_DEFAULTS[0].baseMs, speed, jitter);
    const llmoDur = resolveStepDuration(LLMO_STEP_DEFAULTS[0].baseMs, speed, jitter);

    // Initial scores for LLMO
    const initialScores: { [model: string]: number } = {};
    scenario.llmo.visibilityScores.forEach(s => {
      initialScores[s.model] = s.score; // start with baseline
    });

    set({
      isPlaying: false,
      orchestratorProgress: 0,
      
      // Social
      socialStepIndex: 0,
      socialStepProgress: 0,
      socialStepDuration: socialDur,
      socialStrategyLogsVisible: [],
      socialPosts: scenario.social.posts.map(p => ({ ...p, status: 'pending', likes: 0, comments: 0, shares: 0 })),
      socialMetrics: { reach: 1.0, save: 1.0, engagement: 1.0, saveRate: scenario.social.metrics.saveRateFrom },

      // Ads
      adsStepIndex: 0,
      adsStepProgress: 0,
      adsStepDuration: adsDur,
      adsStrategyLogsVisible: [],
      adsCampaigns: scenario.ads.campaigns.map(c => ({ ...c, status: 'pending', cpc: 0, cpa: 0, roas: 0 })),
      adsMetrics: { sales: 0, cpa: scenario.ads.metrics.cpaFrom, roas: scenario.ads.metrics.roasFrom, spend: 0 },

      // LLMO
      llmoStepIndex: 0,
      llmoStepProgress: 0,
      llmoStepDuration: llmoDur,
      llmoScores: initialScores,
      llmoActions: scenario.llmo.actions.map(a => ({ ...a, status: 'pending' })),
      llmoQueries: scenario.llmo.queries.map(q => ({ ...q, appeared: 'no' })),
    });
  },

  stepForward: () => {
    // Force step forward on active or all agents manually (for custom shortcuts)
    const state = get();
    
    // Simple incremental step for social, ads, and llmo
    const nextSocialIndex = (state.socialStepIndex + 1) % 4;
    const nextAdsIndex = (state.adsStepIndex + 1) % 4;
    const nextLlmoIndex = (state.llmoStepIndex + 1) % 3;

    const scenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
    const speed = state.playbackSpeed;
    const jitter = state.jitterPct;

    // Advance steps
    set({
      socialStepIndex: nextSocialIndex,
      socialStepProgress: 0,
      socialStepDuration: resolveStepDuration(SOCIAL_STEP_DEFAULTS[nextSocialIndex].baseMs, speed, jitter),
      
      adsStepIndex: nextAdsIndex,
      adsStepProgress: 0,
      adsStepDuration: resolveStepDuration(ADS_STEP_DEFAULTS[nextAdsIndex].baseMs, speed, jitter),
      
      llmoStepIndex: nextLlmoIndex,
      llmoStepProgress: 0,
      llmoStepDuration: resolveStepDuration(LLMO_STEP_DEFAULTS[nextLlmoIndex].baseMs, speed, jitter),
    });

    // Helper functions can run on index updates
    // (Ensure logs / data fill instantly for previous steps)
    if (nextSocialIndex === 0) {
      // Wrap loop / reset metrics
      get().resetDemo();
    }
  },

  setSpeed: (speed) => {
    set({ playbackSpeed: speed });
    saveToStorage('coreberg_speed', speed);
    // Recalculate remaining duration for current steps based on new speed
    const state = get();
    set({
      socialStepDuration: (state.socialStepDuration * state.playbackSpeed) / speed,
      adsStepDuration: (state.adsStepDuration * state.playbackSpeed) / speed,
      llmoStepDuration: (state.llmoStepDuration * state.playbackSpeed) / speed,
    });
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
    saveToStorage('coreberg_scenarios', updatedScenarios);
    
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

  // The engine tick loop (called from frontend hook)
  tick: (dtMs) => {
    const state = get();
    if (!state.isPlaying) return;

    const scenario = state.scenarios.find(s => s.id === state.activeScenarioId) || state.scenarios[0];
    const speed = state.playbackSpeed;
    const jitter = state.jitterPct;

    // 1. Update Global Orchestrator Progress
    // We base Orchestrator Progress on the average progress of the three agents
    const averageStepPercentage = (
      ((state.socialStepIndex * 100 + state.socialStepProgress) / 400) +
      ((state.adsStepIndex * 100 + state.adsStepProgress) / 400) +
      ((state.llmoStepIndex * 100 + state.llmoStepProgress) / 300)
    ) / 3 * 100;

    set({ orchestratorProgress: Math.min(100, Math.round(averageStepPercentage)) });

    // ----------------------------------------------------
    // SOCIAL AGENT ENGINE
    // ----------------------------------------------------
    let newSocialProgress = state.socialStepProgress + (dtMs / state.socialStepDuration) * 100;
    let newSocialStepIndex = state.socialStepIndex;
    let newSocialStepDuration = state.socialStepDuration;

    if (newSocialProgress >= 100) {
      if (state.socialStepIndex < 3) {
        newSocialStepIndex += 1;
        newSocialProgress = 0;
        newSocialStepDuration = resolveStepDuration(SOCIAL_STEP_DEFAULTS[newSocialStepIndex].baseMs, speed, jitter);
      } else {
        // Step 3 (Optimize) finished
        if (state.isLoop) {
          // Restart loop
          newSocialStepIndex = 0;
          newSocialProgress = 0;
          newSocialStepDuration = resolveStepDuration(SOCIAL_STEP_DEFAULTS[0].baseMs, speed, jitter);
        } else {
          newSocialProgress = 100;
        }
      }
    }

    // Process details inside Social steps
    let newSocialLogsVisible = [...state.socialStrategyLogsVisible];
    let newSocialPosts = [...state.socialPosts];
    let newSocialMetrics = { ...state.socialMetrics };

    if (newSocialStepIndex === 0) {
      // Step 0: Strategy (1 line of log added sequentially based on progress)
      const logLinesCount = scenario.social.strategyLogs.length;
      const visibleCount = Math.min(
        logLinesCount,
        Math.floor((newSocialProgress / 100) * (logLinesCount + 1))
      );
      newSocialLogsVisible = scenario.social.strategyLogs.slice(0, visibleCount);
      
      // Reset posts & metrics
      newSocialPosts = scenario.social.posts.map(p => ({ ...p, status: 'pending', likes: 0, comments: 0, shares: 0 }));
      newSocialMetrics = { reach: 1.0, save: 1.0, engagement: 1.0, saveRate: scenario.social.metrics.saveRateFrom };
    } 
    else if (newSocialStepIndex === 1) {
      // Step 1: Creative (posts statuses transit from pending -> generating -> ready)
      // Set logs to complete
      newSocialLogsVisible = scenario.social.strategyLogs;
      
      const totalPosts = newSocialPosts.length;
      // We shuffle or sequentially make posts ready
      newSocialPosts = newSocialPosts.map((p, idx) => {
        // Randomize ready states based on progress and post index
        const triggerReady = (newSocialProgress / 100) * totalPosts;
        if (triggerReady > idx + 0.5) {
          return { ...p, status: 'ready' as const };
        } else if (triggerReady > idx) {
          return { ...p, status: 'generating' as const };
        } else {
          return { ...p, status: 'pending' as const };
        }
      });
    }
    else if (newSocialStepIndex === 2) {
      // Step 2: Publish (posts transit from ready -> published)
      newSocialPosts = newSocialPosts.map(p => ({ ...p, status: 'ready' })); // ensure all ready
      const totalPosts = newSocialPosts.length;
      newSocialPosts = newSocialPosts.map((p, idx) => {
        const triggerPublish = (newSocialProgress / 100) * totalPosts;
        if (triggerPublish > idx) {
          return { ...p, status: 'published' as const };
        }
        return p;
      });
    }
    else if (newSocialStepIndex === 3) {
      // Step 3: Optimize (Published posts gain likes/KPIs count up)
      newSocialPosts = newSocialPosts.map(p => ({ ...p, status: 'published' })); // ensure published
      
      const progressFactor = newSocialProgress / 100;
      
      // Interpolate metrics
      const reach = 1.0 + (scenario.social.metrics.reachRatio - 1.0) * progressFactor;
      const save = 1.0 + (scenario.social.metrics.saveRatio - 1.0) * progressFactor;
      const engagement = 1.0 + (scenario.social.metrics.engagementRatio - 1.0) * progressFactor;
      const saveRate = scenario.social.metrics.saveRateFrom + (scenario.social.metrics.saveRateTo - scenario.social.metrics.saveRateFrom) * progressFactor;

      newSocialMetrics = { reach, save, engagement, saveRate };

      // Give posts likes & engagement
      newSocialPosts = newSocialPosts.map((p, idx) => {
        const baseLikes = 250 + (idx * 150);
        return {
          ...p,
          likes: Math.round(baseLikes * reach),
          comments: Math.round((baseLikes / 15) * engagement),
          shares: Math.round((baseLikes / 20) * save),
        };
      });
    }

    // ----------------------------------------------------
    // ADS AGENT ENGINE
    // ----------------------------------------------------
    let newAdsProgress = state.adsStepProgress + (dtMs / state.adsStepDuration) * 100;
    let newAdsStepIndex = state.adsStepIndex;
    let newAdsStepDuration = state.adsStepDuration;

    if (newAdsProgress >= 100) {
      if (state.adsStepIndex < 3) {
        newAdsStepIndex += 1;
        newAdsProgress = 0;
        newAdsStepDuration = resolveStepDuration(ADS_STEP_DEFAULTS[newAdsStepIndex].baseMs, speed, jitter);
      } else {
        // Complete or loop
        if (state.isLoop) {
          newAdsStepIndex = 0;
          newAdsProgress = 0;
          newAdsStepDuration = resolveStepDuration(ADS_STEP_DEFAULTS[0].baseMs, speed, jitter);
        } else {
          newAdsProgress = 100;
        }
      }
    }

    let newAdsLogsVisible = [...state.adsStrategyLogsVisible];
    let newAdsCampaigns = [...state.adsCampaigns];
    let newAdsMetrics = { ...state.adsMetrics };

    if (newAdsStepIndex === 0) {
      // Step 0: Strategy Log sequential
      const logLinesCount = scenario.ads.strategyLogs.length;
      const visibleCount = Math.min(
        logLinesCount,
        Math.floor((newAdsProgress / 100) * (logLinesCount + 1))
      );
      newAdsLogsVisible = scenario.ads.strategyLogs.slice(0, visibleCount);
      newAdsCampaigns = scenario.ads.campaigns.map(c => ({ ...c, status: 'pending', cpc: 0, cpa: 0, roas: 0 }));
      newAdsMetrics = { sales: 0, cpa: scenario.ads.metrics.cpaFrom, roas: scenario.ads.metrics.roasFrom, spend: 0 };
    } 
    else if (newAdsStepIndex === 1) {
      // Step 1: Creative Generation (campaigns: pending -> generating -> ready)
      newAdsLogsVisible = scenario.ads.strategyLogs;
      const totalCampaigns = newAdsCampaigns.length;
      newAdsCampaigns = newAdsCampaigns.map((c, idx) => {
        const triggerReady = (newAdsProgress / 100) * totalCampaigns;
        if (triggerReady > idx + 0.5) {
          return { ...c, status: 'ready' as const };
        } else if (triggerReady > idx) {
          return { ...c, status: 'generating' as const };
        } else {
          return { ...c, status: 'pending' as const };
        }
      });
    }
    else if (newAdsStepIndex === 2) {
      // Step 2: Deploy & Meta submit (ready -> active)
      newAdsCampaigns = newAdsCampaigns.map(c => ({ ...c, status: 'ready' }));
      const totalCampaigns = newAdsCampaigns.length;
      newAdsCampaigns = newAdsCampaigns.map((c, idx) => {
        const triggerActive = (newAdsProgress / 100) * totalCampaigns;
        if (triggerActive > idx) {
          return { ...c, status: 'active' as const };
        }
        return c;
      });
    }
    else if (newAdsStepIndex === 3) {
      // Step 3: Dashboard data metrics count up & CPA decrease
      newAdsCampaigns = newAdsCampaigns.map(c => ({ ...c, status: 'active' }));
      
      const progressFactor = newAdsProgress / 100;
      
      // Calculate CPA curve (easOut: fast drop, then stable)
      // CPA goes down, Sales goes up, ROAS goes up
      const cpaCurve = 1 - Math.sin((progressFactor * Math.PI) / 2); // easeOut curve
      const cpa = scenario.ads.metrics.cpaFrom - (scenario.ads.metrics.cpaFrom - scenario.ads.metrics.cpaTo) * (1 - cpaCurve);
      
      const sales = scenario.ads.metrics.salesFrom + (scenario.ads.metrics.salesTo - scenario.ads.metrics.salesFrom) * progressFactor;
      const roas = scenario.ads.metrics.roasFrom + (scenario.ads.metrics.roasTo - scenario.ads.metrics.roasFrom) * progressFactor;
      const spend = sales / roas;

      newAdsMetrics = { sales, cpa, roas, spend };

      // Distribute KPI values to campaigns
      newAdsCampaigns = newAdsCampaigns.map((c, idx) => {
        const share = (idx === 1) ? 0.5 : 0.25; // campaign 2 does more
        return {
          ...c,
          cpc: Math.round(75 + idx * 15 * (1 - progressFactor * 0.2)),
          cpa: Math.round(cpa * (1 + (idx - 1) * 0.1)),
          roas: Number((roas * (1 - (idx - 1) * 0.05)).toFixed(2))
        };
      });
    }

    // ----------------------------------------------------
    // LLMO AGENT ENGINE
    // ----------------------------------------------------
    let newLlmoProgress = state.llmoStepProgress + (dtMs / state.llmoStepDuration) * 100;
    let newLlmoStepIndex = state.llmoStepIndex;
    let newLlmoStepDuration = state.llmoStepDuration;

    if (newLlmoProgress >= 100) {
      if (state.llmoStepIndex < 2) {
        newLlmoStepIndex += 1;
        newLlmoProgress = 0;
        newLlmoStepDuration = resolveStepDuration(LLMO_STEP_DEFAULTS[newLlmoStepIndex].baseMs, speed, jitter);
      } else {
        if (state.isLoop) {
          newLlmoStepIndex = 0;
          newLlmoProgress = 0;
          newLlmoStepDuration = resolveStepDuration(LLMO_STEP_DEFAULTS[0].baseMs, speed, jitter);
        } else {
          newLlmoProgress = 100;
        }
      }
    }

    let newLlmoScores = { ...state.llmoScores };
    let newLlmoActions = [...state.llmoActions];
    let newLlmoQueries = [...state.llmoQueries];

    if (newLlmoStepIndex === 0) {
      // Step 0: Audit Score (Baseline scores)
      scenario.llmo.visibilityScores.forEach(s => {
        newLlmoScores[s.model] = s.score;
      });
      newLlmoActions = scenario.llmo.actions.map(a => ({ ...a, status: 'pending' }));
      newLlmoQueries = scenario.llmo.queries.map(q => ({ ...q, appeared: 'no' }));
    }
    else if (newLlmoStepIndex === 1) {
      // Step 1: Actions Execution (pending -> running -> completed)
      const totalActions = newLlmoActions.length;
      newLlmoActions = newLlmoActions.map((action, idx) => {
        const triggerProgress = (newLlmoProgress / 100) * totalActions;
        if (triggerProgress > idx + 0.8) {
          return { ...action, status: 'completed' as const };
        } else if (triggerProgress > idx) {
          return { ...action, status: 'running' as const };
        } else {
          return { ...action, status: 'pending' as const };
        }
      });

      // Gradually increase scores slightly during execution
      const progressFactor = newLlmoProgress / 100;
      scenario.llmo.visibilityScores.forEach(s => {
        const delta = Math.round(15 * progressFactor); // partial score gain
        newLlmoScores[s.model] = s.score + delta;
      });
    }
    else if (newLlmoStepIndex === 2) {
      // Step 2: Final citations update (scores hit max, actions all completed, query checks pass)
      newLlmoActions = newLlmoActions.map(a => ({ ...a, status: 'completed' }));
      
      const progressFactor = newLlmoProgress / 100;

      // Scores hit target (e.g. baseline + 30-40 points)
      scenario.llmo.visibilityScores.forEach(s => {
        const targetBonus = 35; // e.g. 35 -> 70
        newLlmoScores[s.model] = s.score + Math.round(targetBonus * progressFactor);
      });

      // Queries status transition
      // Query 0: yes, Query 1: yes/partial, Query 2: yes
      newLlmoQueries = scenario.llmo.queries.map((q, idx) => {
        const trigger = (newLlmoProgress / 100) * 3;
        if (trigger > idx) {
          const finalState = (idx === 1) ? 'partial' as const : 'yes' as const;
          return { ...q, appeared: finalState };
        }
        return q;
      });
    }

    set({
      socialStepIndex: newSocialStepIndex,
      socialStepProgress: newSocialProgress,
      socialStepDuration: newSocialStepDuration,
      socialStrategyLogsVisible: newSocialLogsVisible,
      socialPosts: newSocialPosts,
      socialMetrics: newSocialMetrics,

      adsStepIndex: newAdsStepIndex,
      adsStepProgress: newAdsProgress,
      adsStepDuration: newAdsStepDuration,
      adsStrategyLogsVisible: newAdsLogsVisible,
      adsCampaigns: newAdsCampaigns,
      adsMetrics: newAdsMetrics,

      llmoStepIndex: newLlmoStepIndex,
      llmoStepProgress: newLlmoProgress,
      llmoStepDuration: newLlmoStepDuration,
      llmoScores: newLlmoScores,
      llmoActions: newLlmoActions,
      llmoQueries: newLlmoQueries
    });
  }
}));
