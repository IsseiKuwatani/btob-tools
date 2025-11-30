import { GoogleGenAI, Modality, Part } from "@google/genai";

// Gemini クライアントの初期化
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// モデル名
const TEXT_MODEL = "gemini-2.5-flash";
const IMAGE_MODEL = "gemini-3-pro-image-preview";

/**
 * Geminiでテキスト応答を生成
 */
export async function generateText(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });
    return response.text ?? "";
  } catch (error) {
    console.error("Gemini text generation error:", error);
    throw new Error("テキスト生成に失敗しました");
  }
}

/**
 * Geminiで画像を生成（Gemini 3 Pro Image Preview）
 */
export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "2K",
        },
      },
    });

    // 画像データを取得
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
      const imagePart = parts.find((part: Part) => part.inlineData);
      if (imagePart?.inlineData?.data) {
        return imagePart.inlineData.data; // Base64エンコードされた画像
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini image generation error:", error);
    return null;
  }
}

/**
 * 画像付きプロンプトで応答を生成（マルチモーダル）
 */
export async function generateWithImage(
  prompt: string,
  imageBase64: string,
  mimeType: string = "image/png"
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    });
    return response.text ?? "";
  } catch (error) {
    console.error("Gemini multimodal generation error:", error);
    throw new Error("画像付き生成に失敗しました");
  }
}

/**
 * システムプロンプト付きでテキスト生成
 */
export async function generateWithSystemPrompt(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
      },
    });
    return response.text ?? "";
  } catch (error) {
    console.error("Gemini chat generation error:", error);
    throw new Error("チャット生成に失敗しました");
  }
}

