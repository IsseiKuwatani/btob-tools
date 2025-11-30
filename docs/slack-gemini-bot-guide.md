# 子分1号 - Slack × Gemini AI Bot セットアップガイド

## 🎯 概要

**子分1号**は、SlackからGemini AIを呼び出せるBotです。メンションやSlash Commandでテキスト応答、画像生成、画像解析が可能です。

**参考記事**: [Slackから生成AIを呼び出せるようにする - Ubie テックブログ](https://zenn.dev/ubie_dev/articles/6680c44737048d)

## ✨ 機能

### 1. テキスト応答
子分1号にメンションすると、Gemini AIが応答します。

```
@子分1号 今日のマーケティングトレンドを教えて
```

### 2. 画像生成
`/image` または `画像:` プレフィックスで画像を生成します。

```
@子分1号 /image 美しい夕焼けの海岸

# または
@子分1号 画像: モダンなオフィスのイラスト
```

### 3. 画像解析
画像を添付してメンションすると、画像を解析して説明します。

```
[画像を添付]
@子分1号 この画像のグラフを分析して
```

### 4. Slash Commands
```
/kobun 質問内容     # テキスト応答（子分1号専用）
/gemini 質問内容    # テキスト応答
/image 画像の説明   # 画像生成
```

## 🚀 セットアップ手順

### Step 1: Slack Appの作成

1. [Slack API](https://api.slack.com/apps) にアクセス
2. **Create New App** → **From scratch** を選択
3. アプリ名とワークスペースを設定

### Step 2: Bot Token Scopesの設定

**OAuth & Permissions** から以下のスコープを追加:

```
chat:write          # メッセージ送信
files:write         # ファイルアップロード
files:read          # ファイル読み取り
reactions:write     # リアクション追加
reactions:read      # リアクション読み取り
app_mentions:read   # メンション検知
im:history          # DMの履歴
im:read             # DM読み取り
im:write            # DM送信
```

### Step 3: Event Subscriptionsの設定

1. **Event Subscriptions** を有効化
2. **Request URL** に以下を設定:
   ```
   https://your-app.vercel.app/api/slack/events
   ```
3. **Subscribe to bot events** で以下を追加:
   - `app_mention`
   - `message.im`

### Step 4: Slash Commandsの設定（オプション）

**Slash Commands** から新しいコマンドを作成:

#### /gemini コマンド
- **Command**: `/gemini`
- **Request URL**: `https://your-app.vercel.app/api/slack/commands`
- **Short Description**: Gemini AIに質問する
- **Usage Hint**: [質問内容]

#### /image コマンド
- **Command**: `/image`
- **Request URL**: `https://your-app.vercel.app/api/slack/commands`
- **Short Description**: AI画像を生成する
- **Usage Hint**: [画像の説明]

### Step 5: アプリのインストール

1. **Install App** からワークスペースにインストール
2. **Bot User OAuth Token** をコピー（`xoxb-`で始まる）

### Step 6: 必要な情報を取得

#### Bot User ID の取得

```bash
curl -H "Authorization: Bearer xoxb-your-token" \
  https://slack.com/api/auth.test
```

レスポンスの `user_id` がBot User IDです。

#### Signing Secret の取得

**Basic Information** → **App Credentials** → **Signing Secret**

### Step 7: 環境変数の設定

Vercelで以下の環境変数を設定:

| 変数名 | 値 |
|--------|-----|
| `SLACK_BOT_TOKEN` | `xoxb-...` (Step 5で取得) |
| `SLACK_SIGNING_SECRET` | Signing Secret |
| `SLACK_BOT_USER_ID` | `UXXXXXXXX` (Step 6で取得) |
| `GEMINI_API_KEY` | Google AI StudioのAPIキー |

### Step 8: Vercelにデプロイ

```bash
npx vercel --prod
```

### Step 9: Request URLの設定

デプロイ後、Slack Appの設定で:

1. **Event Subscriptions** の Request URL を更新
2. **Slash Commands** の Request URL を更新

## 📁 ファイル構成

```
src/
├── app/
│   └── api/
│       └── slack/
│           ├── events/
│           │   └── route.ts    # メンション・DM処理
│           └── commands/
│               └── route.ts    # Slash Command処理
└── lib/
    ├── gemini.ts               # Gemini API連携
    └── slack.ts                # Slack API連携
```

## 🔧 カスタマイズ

### システムプロンプトの追加

`src/lib/gemini.ts` の `generateWithSystemPrompt` を使用:

```typescript
const response = await generateWithSystemPrompt(
  "あなたはBtoBマーケティングの専門家です。",
  userPrompt
);
```

### プリセットコマンドの追加

`src/app/api/slack/events/route.ts` にカスタムコマンドを追加:

```typescript
// /analyze コマンド
if (prompt.startsWith("/analyze ")) {
  const target = prompt.replace("/analyze ", "");
  const response = await generateText(
    `以下のマーケティング施策を分析してください: ${target}`
  );
  await sendMessage(channel, response, replyTs);
}
```

### リアクションによるトリガー

参考記事のように、特定のリアクションで処理をトリガーすることも可能:

```typescript
// reaction_added イベントを処理
if (event.type === "reaction_added" && event.reaction === "gemini") {
  // メッセージを取得して処理
}
```

## ⚠️ 注意事項

### Slackの3秒ルール

Slackは3秒以内にレスポンスを返す必要があります。本実装では:

1. 即座に `200 OK` を返す
2. バックグラウンドで処理
3. 完了後にメッセージを送信

### レート制限

- Slack API: Tier制限あり（通常は十分）
- Gemini API: 無料枠は1分あたり60リクエスト

### 画像生成について

Imagen 3 APIは現在プレビュー版です。利用できない場合は、テキストによる説明が生成されます。

## 🎉 活用例

### BtoBマーケティング向け

```
@子分1号 以下のLPの改善点を教えて
[スクリーンショットを添付]

@子分1号 /image BtoBセミナーの告知バナー、青基調でプロフェッショナルな雰囲気

@子分1号 「MAツール導入」のキーワードでSEO記事のタイトル案を10個考えて
```

### チーム活用

```
@子分1号 今月の営業会議のアジェンダ案を作って

@子分1号 この競合分析資料を要約して
[PDFのスクリーンショットを添付]
```

## 🔗 関連リンク

- [Slack API Documentation](https://api.slack.com/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [参考: Ubieテックブログ](https://zenn.dev/ubie_dev/articles/6680c44737048d)

## 💾 画像のストレージについて

生成した画像は **Slackワークスペースのストレージ** に直接アップロードされます。

- ✅ 外部ストレージ（S3、Cloudinaryなど）は不要
- ✅ Vercel BlobやSupabaseなども不要
- ✅ 無料ワークスペースでも5GBまでOK

```
Gemini API → Base64画像 → Slack filesUploadV2 → Slackに表示
```

---

**これで子分1号がSlackからAIを自由に呼び出してくれます！🤖**

