import { WebClient, KnownBlock } from "@slack/web-api";
import crypto from "crypto";

// Slack Web API クライアント
const token = process.env.SLACK_BOT_TOKEN;
if (!token) {
  console.warn("⚠️ SLACK_BOT_TOKEN is not set!");
}
export const slackClient = new WebClient(token);

/**
 * Slackリクエストの署名を検証
 */
export function verifySlackRequest(
  signingSecret: string,
  signature: string,
  timestamp: string,
  body: string
): boolean {
  // タイムスタンプが5分以上古い場合はリプレイ攻撃の可能性
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp)) > 60 * 5) {
    return false;
  }

  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature =
    "v0=" +
    crypto
      .createHmac("sha256", signingSecret)
      .update(sigBasestring)
      .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(mySignature, "utf8"),
    Buffer.from(signature, "utf8")
  );
}

/**
 * Slackにテキストメッセージを送信
 */
export async function sendMessage(
  channel: string,
  text: string,
  threadTs?: string
): Promise<void> {
  console.log("Sending message to channel:", channel, "text:", text.substring(0, 50));
  try {
    const result = await slackClient.chat.postMessage({
      channel,
      text,
      thread_ts: threadTs,
    });
    console.log("Message sent successfully:", result.ok);
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
}

/**
 * Slackにリッチメッセージを送信（Block Kit）
 */
export async function sendRichMessage(
  channel: string,
  blocks: KnownBlock[],
  text: string,
  threadTs?: string
): Promise<void> {
  await slackClient.chat.postMessage({
    channel,
    text,
    blocks,
    thread_ts: threadTs,
  });
}

/**
 * Slackに画像をアップロード
 */
export async function uploadImage(
  channel: string,
  imageBuffer: Buffer,
  filename: string,
  title: string,
  threadTs?: string
): Promise<void> {
  if (threadTs) {
    await slackClient.filesUploadV2({
      channel_id: channel,
      file: imageBuffer,
      filename,
      title,
      thread_ts: threadTs,
    });
  } else {
    await slackClient.filesUploadV2({
      channel_id: channel,
      file: imageBuffer,
      filename,
      title,
    });
  }
}

/**
 * Slackから画像をダウンロード
 */
export async function downloadFile(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * メンションを除去してプロンプトを抽出
 */
export function extractPrompt(text: string, botUserId: string): string {
  // <@UXXXXXX> 形式のメンションを除去
  return text
    .replace(new RegExp(`<@${botUserId}>`, "g"), "")
    .trim();
}

/**
 * 「思考中...」のリアクションを追加
 */
export async function addThinkingReaction(
  channel: string,
  timestamp: string
): Promise<void> {
  try {
    await slackClient.reactions.add({
      channel,
      timestamp,
      name: "hourglass_flowing_sand",
    });
  } catch {
    // リアクションの追加に失敗しても続行
  }
}

/**
 * リアクションを削除
 */
export async function removeReaction(
  channel: string,
  timestamp: string,
  name: string
): Promise<void> {
  try {
    await slackClient.reactions.remove({
      channel,
      timestamp,
      name,
    });
  } catch {
    // リアクションの削除に失敗しても続行
  }
}

