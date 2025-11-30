import { NextRequest, NextResponse } from "next/server";
import { verifySlackRequest, sendMessage, uploadImage } from "@/lib/slack";
import { generateText, generateImage } from "@/lib/gemini";

/**
 * 子分1号 - Slash Commands Handler
 * /gemini, /image などのコマンドを処理します
 */

// 環境変数
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    // リクエストボディを取得
    const body = await req.text();
    const params = new URLSearchParams(body);
    
    // Slack署名の検証
    const signature = req.headers.get("x-slack-signature") || "";
    const timestamp = req.headers.get("x-slack-request-timestamp") || "";

    if (SLACK_SIGNING_SECRET && !verifySlackRequest(SLACK_SIGNING_SECRET, signature, timestamp, body)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const command = params.get("command");
    const text = params.get("text") || "";
    const channelId = params.get("channel_id") || "";
    const responseUrl = params.get("response_url") || "";

    // コマンドに応じて処理
    switch (command) {
      case "/gemini":
      case "/ai":
      case "/kobun":
        handleGeminiCommand(text, channelId, responseUrl).catch(console.error);
        return NextResponse.json({
          response_type: "in_channel",
          text: "🤔 子分1号が考え中...",
        });

      case "/image":
      case "/画像":
        handleImageCommand(text, channelId, responseUrl).catch(console.error);
        return NextResponse.json({
          response_type: "in_channel",
          text: `🎨 子分1号が画像を生成中... 「${text}」`,
        });

      default:
        return NextResponse.json({
          response_type: "ephemeral",
          text: "不明なコマンドです。",
        });
    }
  } catch (error) {
    console.error("Slack command handler error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * /gemini コマンドを処理
 */
async function handleGeminiCommand(
  text: string,
  channelId: string,
  responseUrl: string
): Promise<void> {
  try {
    if (!text.trim()) {
      await sendDelayedResponse(responseUrl, {
        response_type: "ephemeral",
        text: "質問を入力してください。例: `/gemini 今日の天気は？`",
      });
      return;
    }

    const response = await generateText(text);

    await sendDelayedResponse(responseUrl, {
      response_type: "in_channel",
      text: response,
    });
  } catch (error) {
    console.error("Gemini command error:", error);
    await sendDelayedResponse(responseUrl, {
      response_type: "ephemeral",
      text: "エラーが発生しました。もう一度お試しください。",
    });
  }
}

/**
 * /image コマンドを処理
 */
async function handleImageCommand(
  text: string,
  channelId: string,
  responseUrl: string
): Promise<void> {
  try {
    if (!text.trim()) {
      await sendDelayedResponse(responseUrl, {
        response_type: "ephemeral",
        text: "画像の説明を入力してください。例: `/image 美しい夕焼けの海岸`",
      });
      return;
    }

    const imageBase64 = await generateImage(text);

    if (imageBase64) {
      const imageBuffer = Buffer.from(imageBase64, "base64");
      await uploadImage(
        channelId,
        imageBuffer,
        "generated-image.png",
        `生成画像: ${text}`
      );
      
      await sendDelayedResponse(responseUrl, {
        response_type: "in_channel",
        text: `✅ 画像を生成しました: 「${text}」`,
        replace_original: true,
      });
    } else {
      // 画像生成に失敗した場合
      const description = await generateText(
        `以下のプロンプトに基づいて、詳細な画像の説明を日本語で書いてください: ${text}`
      );
      
      await sendDelayedResponse(responseUrl, {
        response_type: "in_channel",
        text: `⚠️ 画像生成機能は現在利用できません。代わりに説明を生成しました:\n\n${description}`,
        replace_original: true,
      });
    }
  } catch (error) {
    console.error("Image command error:", error);
    await sendDelayedResponse(responseUrl, {
      response_type: "ephemeral",
      text: "画像生成中にエラーが発生しました。",
      replace_original: true,
    });
  }
}

/**
 * 遅延レスポンスを送信
 */
async function sendDelayedResponse(
  responseUrl: string,
  payload: object
): Promise<void> {
  await fetch(responseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

