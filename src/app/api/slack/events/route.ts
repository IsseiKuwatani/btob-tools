import { NextRequest, NextResponse } from "next/server";
import {
  verifySlackRequest,
  sendMessage,
  uploadImage,
  extractPrompt,
  downloadFile,
} from "@/lib/slack";
import { generateText, generateImage, generateWithImage } from "@/lib/gemini";

/**
 * 子分1号 - Slack × Gemini AI Bot
 * メンションやSlash CommandでGemini AIを呼び出せます
 */

// Slack Event Types
interface SlackEvent {
  type: string;
  user?: string;
  text?: string;
  channel?: string;
  ts?: string;
  thread_ts?: string;
  files?: SlackFile[];
  bot_id?: string;
}

interface SlackFile {
  url_private: string;
  mimetype: string;
  name: string;
}

interface SlackEventPayload {
  type: string;
  challenge?: string;
  event?: SlackEvent;
}

// 環境変数
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || "";
const SLACK_BOT_USER_ID = process.env.SLACK_BOT_USER_ID || "";

// GETリクエスト - 動作確認用
export async function GET() {
  const hasToken = !!process.env.SLACK_BOT_TOKEN;
  const hasSecret = !!process.env.SLACK_SIGNING_SECRET;
  const hasBotId = !!process.env.SLACK_BOT_USER_ID;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    status: "子分1号 is ready! 🤖",
    env: {
      SLACK_BOT_TOKEN: hasToken ? "✅ Set" : "❌ Missing",
      SLACK_SIGNING_SECRET: hasSecret ? "✅ Set" : "❌ Missing",
      SLACK_BOT_USER_ID: hasBotId ? "✅ Set" : "❌ Missing",
      GEMINI_API_KEY: hasGemini ? "✅ Set" : "❌ Missing",
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await req.text();
    console.log("Received Slack event:", body.substring(0, 200));
    
    const payload: SlackEventPayload = JSON.parse(body);

    // Slack署名の検証（開発中はスキップ可能）
    const signature = req.headers.get("x-slack-signature") || "";
    const timestamp = req.headers.get("x-slack-request-timestamp") || "";

    if (SLACK_SIGNING_SECRET && signature && !verifySlackRequest(SLACK_SIGNING_SECRET, signature, timestamp, body)) {
      console.error("Invalid Slack signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // URL Verification Challenge (Slack App設定時に必要)
    if (payload.type === "url_verification") {
      console.log("URL verification challenge received");
      return NextResponse.json({ challenge: payload.challenge });
    }

    // Event Callback の処理
    if (payload.type === "event_callback" && payload.event) {
      const event = payload.event;
      console.log("Event type:", event.type, "Bot ID:", event.bot_id);

      // Bot自身のメッセージは無視
      if (event.bot_id) {
        console.log("Ignoring bot message");
        return NextResponse.json({ ok: true });
      }

      // app_mention イベント (メンションされた時)
      if (event.type === "app_mention" && event.channel && event.ts) {
        console.log("Handling app_mention event");
        // 非同期で処理（3秒ルール対策）
        handleMention(event).catch((err) => console.error("handleMention error:", err));
        return NextResponse.json({ ok: true });
      }

      // message イベント (DMの場合)
      if (event.type === "message" && event.channel?.startsWith("D") && event.ts) {
        console.log("Handling DM message event");
        handleMention(event).catch((err) => console.error("handleMention error:", err));
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Slack event handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// 考え中メッセージのバリエーション（人間っぽく）
const THINKING_MESSAGES = [
  "ふむふむ、ちょっと考えてみますね...🤔",
  "なるほど！少々お待ちを...✨",
  "おっ、いい質問ですね！考え中...💭",
  "了解です！ちょっと調べてみます...🔍",
  "はいはい！少し考えさせてください...🧠",
  "お、それですね！ちょっと待ってて...⏳",
];

/**
 * ランダムな考え中メッセージを取得
 */
function getThinkingMessage(): string {
  return THINKING_MESSAGES[Math.floor(Math.random() * THINKING_MESSAGES.length)];
}

/**
 * メンションを処理
 */
async function handleMention(event: SlackEvent): Promise<void> {
  const { channel, ts, thread_ts, text, files } = event;

  if (!channel || !ts || !text) {
    console.log("Missing required fields:", { channel, ts, text });
    return;
  }

  const replyTs = thread_ts || ts;

  try {
    const prompt = extractPrompt(text, SLACK_BOT_USER_ID);
    console.log("Processing prompt:", prompt);

    // 画像生成コマンドの検出
    if (prompt.startsWith("/image ") || prompt.startsWith("画像生成:") || prompt.startsWith("画像:")) {
      await handleImageGeneration(channel, prompt, replyTs);
    }
    // ファイルが添付されている場合（画像解析）
    else if (files && files.length > 0) {
      // まず「考え中」メッセージを送信
      await sendMessage(channel, "📷 画像を確認中...ちょっと待ってね！", replyTs);
      await handleImageAnalysis(channel, prompt, files, replyTs);
    }
    // 通常のテキスト応答
    else {
      // まず「考え中」メッセージを送信（人間っぽく）
      await sendMessage(channel, getThinkingMessage(), replyTs);
      await handleTextResponse(channel, prompt, replyTs);
    }
  } catch (error) {
    console.error("Handle mention error:", error);
    await sendMessage(
      channel,
      "あれ、ちょっとエラーが起きちゃいました...😅 もう一度試してもらえますか？",
      replyTs
    );
  }
}

/**
 * テキスト応答を処理
 */
async function handleTextResponse(
  channel: string,
  prompt: string,
  threadTs: string
): Promise<void> {
  if (!prompt) {
    await sendMessage(channel, "何かメッセージを入力してください！", threadTs);
    return;
  }

  console.log("Calling generateText with prompt:", prompt.substring(0, 50));
  const response = await generateText(prompt);
  console.log("generateText response received, length:", response.length);
  
  // 長いメッセージは分割
  if (response.length > 3000) {
    const chunks = splitMessage(response, 3000);
    for (const chunk of chunks) {
      await sendMessage(channel, chunk, threadTs);
    }
  } else {
    await sendMessage(channel, response, threadTs);
  }
}

/**
 * 画像生成を処理
 */
async function handleImageGeneration(
  channel: string,
  prompt: string,
  threadTs: string
): Promise<void> {
  // プレフィックスを除去
  const imagePrompt = prompt
    .replace(/^\/image\s+/, "")
    .replace(/^画像生成:\s*/, "")
    .replace(/^画像:\s*/, "")
    .trim();

  if (!imagePrompt) {
    await sendMessage(
      channel,
      "画像の説明を入力してください。例: `/image 美しい夕焼けの海岸`",
      threadTs
    );
    return;
  }

  await sendMessage(channel, `🎨 子分1号が画像を生成中... 「${imagePrompt}」`, threadTs);

  const imageBase64 = await generateImage(imagePrompt);

  if (imageBase64) {
    const imageBuffer = Buffer.from(imageBase64, "base64");
    await uploadImage(
      channel,
      imageBuffer,
      "generated-image.png",
      `生成画像: ${imagePrompt}`,
      threadTs
    );
  } else {
    // 画像生成に失敗した場合はテキストで説明を生成
    const description = await generateText(
      `あなたは画像の説明を生成するAIです。以下のプロンプトに基づいて、詳細な画像の説明を日本語で書いてください: ${imagePrompt}`
    );
    await sendMessage(
      channel,
      `⚠️ 画像生成機能は現在利用できません。代わりに説明を生成しました:\n\n${description}`,
      threadTs
    );
  }
}

/**
 * 画像解析を処理
 */
async function handleImageAnalysis(
  channel: string,
  prompt: string,
  files: SlackFile[],
  threadTs: string
): Promise<void> {
  const imageFile = files.find((f) =>
    f.mimetype.startsWith("image/")
  );

  if (!imageFile) {
    await sendMessage(
      channel,
      "画像ファイルを添付してください。",
      threadTs
    );
    return;
  }

  // 画像をダウンロード
  const imageBuffer = await downloadFile(imageFile.url_private);
  const imageBase64 = imageBuffer.toString("base64");

  // プロンプトが空の場合はデフォルト
  const analysisPrompt = prompt || "この画像について詳しく説明してください。";

  const response = await generateWithImage(
    analysisPrompt,
    imageBase64,
    imageFile.mimetype
  );

  await sendMessage(channel, response, threadTs);
}

/**
 * メッセージを指定文字数で分割
 */
function splitMessage(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  let current = "";

  const lines = text.split("\n");
  for (const line of lines) {
    if ((current + "\n" + line).length > maxLength) {
      if (current) chunks.push(current);
      current = line;
    } else {
      current = current ? current + "\n" + line : line;
    }
  }
  if (current) chunks.push(current);

  return chunks;
}

