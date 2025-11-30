import { NextRequest, NextResponse } from "next/server";
import {
  verifySlackRequest,
  sendMessage,
  uploadImage,
  extractPrompt,
  addThinkingReaction,
  removeReaction,
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

export async function POST(req: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await req.text();
    const payload: SlackEventPayload = JSON.parse(body);

    // Slack署名の検証
    const signature = req.headers.get("x-slack-signature") || "";
    const timestamp = req.headers.get("x-slack-request-timestamp") || "";

    if (SLACK_SIGNING_SECRET && !verifySlackRequest(SLACK_SIGNING_SECRET, signature, timestamp, body)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // URL Verification Challenge (Slack App設定時に必要)
    if (payload.type === "url_verification") {
      return NextResponse.json({ challenge: payload.challenge });
    }

    // Event Callback の処理
    if (payload.type === "event_callback" && payload.event) {
      const event = payload.event;

      // Bot自身のメッセージは無視
      if (event.bot_id) {
        return NextResponse.json({ ok: true });
      }

      // app_mention イベント (メンションされた時)
      if (event.type === "app_mention" && event.channel && event.ts) {
        // 非同期で処理（3秒ルール対策）
        handleMention(event).catch(console.error);
        return NextResponse.json({ ok: true });
      }

      // message イベント (DMの場合)
      if (event.type === "message" && event.channel?.startsWith("D") && event.ts) {
        handleMention(event).catch(console.error);
        return NextResponse.json({ ok: true });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Slack event handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * メンションを処理
 */
async function handleMention(event: SlackEvent): Promise<void> {
  const { channel, ts, thread_ts, text, files } = event;

  if (!channel || !ts || !text) return;

  // 思考中リアクションを追加
  await addThinkingReaction(channel, ts);

  try {
    const prompt = extractPrompt(text, SLACK_BOT_USER_ID);
    const replyTs = thread_ts || ts;

    // 画像生成コマンドの検出
    if (prompt.startsWith("/image ") || prompt.startsWith("画像生成:") || prompt.startsWith("画像:")) {
      await handleImageGeneration(channel, prompt, replyTs);
    }
    // ファイルが添付されている場合（画像解析）
    else if (files && files.length > 0) {
      await handleImageAnalysis(channel, prompt, files, replyTs);
    }
    // 通常のテキスト応答
    else {
      await handleTextResponse(channel, prompt, replyTs);
    }
  } catch (error) {
    console.error("Handle mention error:", error);
    await sendMessage(
      channel,
      "エラーが発生しました。もう一度お試しください。",
      thread_ts || ts
    );
  } finally {
    // 思考中リアクションを削除
    await removeReaction(channel, ts, "hourglass_flowing_sand");
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

  const response = await generateText(prompt);
  
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

