import { NextRequest } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const runtime = 'edge'; // Cloudflare-compatible edge runtime

export async function POST(req: NextRequest) {
  try {
    const { messages, agentContext } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || '';

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      // APIキーがない場合のフォールバック（デモ用ダミー応答ストリーミング）
      const mockResponse = getMockResponse(lastMessage, agentContext);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          // モックテキストを少しずつ送信する
          const chunks = mockResponse.match(/.{1,4}/g) || [mockResponse];
          for (const chunk of chunks) {
            controller.enqueue(encoder.encode(chunk));
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // システムプロンプトの設定
    const systemInstruction = `あなたはCorebergの自律型AIマーケティングOrchestratorデモで動作するAIアシスタントです。ピッチ資料を閲覧している投資家からの質問に、洗練された品位ある日本語で簡潔に答えてください。
現在閲覧中のコンテキスト: ${agentContext || '全体ダッシュボード'}。
余計なダサい言葉遣い、過剰な絵文字、AIらしい定型文は避け、テックとしての凄みが伝わるように簡潔かつ論理的にお答えください。`;

    const chatResponse = await ai.models.generateContentStream({
      model: 'gemini-3.1-flash-lite',
      contents: lastMessage,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of chatResponse) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return new Response('デモ環境でのリクエスト処理中にエラーが発生しました。現在、モックアップモードで代替稼働しています。', { status: 500 });
  }
}

function getMockResponse(message: string, context: string): string {
  const msg = message.toLowerCase();
  
  if (context === 'social') {
    if (msg.includes('効果') || msg.includes('数字') || msg.includes('改善') || msg.includes('メリット')) {
      return `Coreberg Socialエージェントは、投稿後のエンゲージメントおよび保存率を常時監視し、成果の高いクリエイティブの傾向（構図、配色、キャプションのトーン）を自律学習します。
デモデータが示す通り、第4フェーズの改善サイクルでは、保存率が0.35%から1.40%（約4倍）へ向上するプロセスが完全に自動化されています。`;
    }
    return `Coreberg Socialエージェントは、自律的に競合分析を行い、ターゲットに適したカレンダーを自動生成、画像とキャプションを生成して予約投稿まで完結させます。現在、企画から改善までの4つのステップがリアルタイムで推移しています。`;
  }
  
  if (context === 'ads') {
    if (msg.includes('cpa') || msg.includes('roas') || msg.includes('予算') || msg.includes('広告')) {
      return `Coreberg Creative/Adsエージェントは、設定された上限予算内で最も獲得効率の高い配信面にアロケーションを動的変更します。
今回のデモシナリオでは、MetaとGoogle Adsに接続し、配信開始後にCPAが30%以上削減され、目標ROASを超えるアロケーション最適化が自動で行われる推移をシミュレートしています。`;
    }
    return `Coreberg Adsエージェントは、商材情報を元に広告アセット（複数サイズ）を自動生成し、API経由で即座に出稿を行います。接続から最適化ダッシュボードの更新まで完全に自律して稼働します。`;
  }

  if (context === 'llmo') {
    if (msg.includes('llmo') || msg.includes('仕組み') || msg.includes('最適化') || msg.includes('対策')) {
      return `LLMO（Large Language Model Optimization）は、ChatGPTやGeminiなどのLLMがユーザーの質問に対して自社ブランドを推奨する確率を向上させる技術です。
本システムは、主要モデルの回答構造を監査し、構造化データ・FAQ・権威性ソースの調整を自動実行することで、引用スコアを倍増させます。`;
    }
    return `LLMO対策エージェントは、主要LLMにおけるブランド認知スコアを監査し、クエリ出現状況の確認、構造化データ等の最適化アクションを順次実行して、モデル内の引用サンプル（Before/After）を更新します。`;
  }

  // デフォルト
  if (msg.includes('投資') || msg.includes('ピッチ') || msg.includes('強み')) {
    return `Corebergの強みは、人間の運用者が入ることなく「戦略立案 ➔ 制作 ➔ 出稿 ➔ 効果測定 ➔ 学習」のループを自律的に回し続けるOrchestratorアーキテクチャにあります。
これにより、マーケティングコストを大幅に削減しつつ、スピードと精度を極限まで高めています。`;
  }

  return `Coreberg Orchestrator のデモ環境へようこそ。
左側のナビゲーションから「SNS」「広告」「LLMO」の各自律エージェントの挙動をご確認いただけます。
何か具体的なエージェントの仕組みや、取得できる効果についてご質問はありますか？`;
}
