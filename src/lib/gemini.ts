import { GoogleGenAI } from "@google/genai";

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
    console.log("generateText: Starting with model:", TEXT_MODEL);
    console.log("generateText: API Key exists:", !!process.env.GEMINI_API_KEY);
    
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: prompt,
    });
    
    console.log("generateText: Response received");
    return response.text ?? "";
  } catch (error) {
    console.error("Gemini text generation error:", error);
    throw new Error("テキスト生成に失敗しました");
  }
}

/**
 * Geminiで画像を生成（Gemini 3 Pro Image Preview）
 * 参考: https://ai.google.dev/gemini-api/docs/image-generation?hl=ja
 */
export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: prompt,
    });

    // 画像データを取得
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          return part.inlineData.data; // Base64エンコードされた画像
        }
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

/**
 * 画像を参照して新しい画像を生成（Image-to-Image）
 * Nano Banana Pro (Gemini 3 Pro) のImage-to-Image機能
 * 参考: https://www.fotor.com/jp/blog/nano-banana-model-prompts/
 */
export async function generateImageFromReference(
  prompt: string,
  referenceImageBase64: string,
  mimeType: string = "image/png"
): Promise<string | null> {
  try {
    console.log("generateImageFromReference: Starting with model:", IMAGE_MODEL);
    
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: [
        {
          inlineData: {
            data: referenceImageBase64,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    });

    console.log("generateImageFromReference: Response received");

    // 画像データを取得
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          console.log("generateImageFromReference: Image data found");
          return part.inlineData.data; // Base64エンコードされた画像
        }
      }
    }
    
    console.log("generateImageFromReference: No image data in response");
    return null;
  } catch (error) {
    console.error("Gemini image-to-image generation error:", error);
    return null;
  }
}
