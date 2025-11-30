# 診断系コンテンツをLPに埋め込む方法

## 🎯 概要

診断系コンテンツやインタラクティブツールをSTUDIOやWordPressなどのLPに埋め込むことで、ユーザーエンゲージメントを高めることができます。

ClaudeやGeminiでツール作成は可能ですが、**iframe埋め込み**を活用することで、より簡単に様々なプラットフォームに統合できます！

## 📌 埋め込み方法の比較

### 方法1: インラインコード埋め込み
- HTML/CSS/JSをそのまま埋め込む
- プラットフォームの制約を受けやすい
- コードの管理が煩雑になりがち

### 方法2: iframe埋め込み ⭐️おすすめ
- 独立したページとして動作
- どのプラットフォームにも統一的に埋め込める
- メンテナンスが容易
- セキュリティが高い

## 🚀 iframe埋め込みの実装フロー

### Step 1: Cursorでツールを作成

診断ツールやインタラクティブコンテンツを作成します。

```bash
# プロジェクトの作成例
npm create vite@latest my-diagnostic-tool
cd my-diagnostic-tool
npm install
```

### Step 2: iframe対応の設定

iframe内で正しく動作するように、以下の設定を確認：

#### 2-1. レスポンシブ対応
```css
/* iframe内で柔軟に表示されるようにする */
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
}
```

#### 2-2. メッセージング（オプション）
親ページとの通信が必要な場合：

```javascript
// iframe内のコード
window.parent.postMessage({
  type: 'diagnostic-result',
  data: resultData
}, '*');
```

```javascript
// 親ページのコード
window.addEventListener('message', (event) => {
  if (event.data.type === 'diagnostic-result') {
    console.log('診断結果:', event.data.data);
  }
});
```

#### 2-3. 高さの自動調整
```javascript
// iframe内で高さを親に通知
function notifyHeight() {
  const height = document.documentElement.scrollHeight;
  window.parent.postMessage({
    type: 'resize',
    height: height
  }, '*');
}

window.addEventListener('load', notifyHeight);
window.addEventListener('resize', notifyHeight);
```

### Step 3: Vercelにデプロイ

⚠️ **重要**: ローカル環境では iframe埋め込みは動作しません！

```bash
# Vercelにログイン
npx vercel login

# デプロイ
npx vercel --prod
```

デプロイ後、公開URLを取得します（例: `https://your-tool.vercel.app`）

### Step 4: STUDIOやWordPressに埋め込み

#### STUDIO での埋め込み

1. **埋め込み要素を追加**
   - 左メニューから「埋め込み」を選択
   - キャンバスに配置

2. **iframeコードを入力**
```html
<iframe 
  src="https://your-tool.vercel.app"
  width="100%"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
  allowfullscreen
></iframe>
```

#### WordPress での埋め込み

1. カスタムHTMLブロックを追加
2. 上記のiframeコードを貼り付け

#### その他のプラットフォーム

Wix、Webflow、Shopifyなども同様にiframeコードを埋め込むだけでOK！

## 🎨 iframe埋め込みのベストプラクティス

### 1. レスポンシブ対応
```html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="https://your-tool.vercel.app"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
  ></iframe>
</div>
```

### 2. ローディング最適化
```html
<iframe 
  src="https://your-tool.vercel.app"
  loading="lazy"
  title="診断ツール"
></iframe>
```

### 3. セキュリティ設定
```html
<iframe 
  src="https://your-tool.vercel.app"
  sandbox="allow-scripts allow-same-origin allow-forms"
></iframe>
```

## 🔧 トラブルシューティング

### iframe内でスクロールできない
```css
/* iframe内のbodyに追加 */
body {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
```

### iframeが表示されない
1. URLが正しいか確認
2. HTTPSで配信されているか確認
3. X-Frame-Optionsヘッダーを確認

```javascript
// vercel.json で設定
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "ALLOWALL"
        }
      ]
    }
  ]
}
```

### モバイルで正しく表示されない
```html
<!-- iframeを含むツール側のheadに追加 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

## 📊 活用例

### 1. BtoB向け診断ツール
- 課題診断
- ROI計算ツール
- 最適プラン診断

### 2. インタラクティブコンテンツ
- クイズ
- アンケート
- シミュレーター

### 3. データ可視化
- ダッシュボード
- レポート表示
- リアルタイムデータ表示

## 🎉 メリット

✅ **簡単に埋め込み可能** - どんなプラットフォームでも統一的に動作  
✅ **独立した環境** - LP側のスタイルや機能と干渉しない  
✅ **メンテナンスが容易** - ツール側を更新すれば全ての埋め込み先に反映  
✅ **セキュアな実装** - サンドボックス化されたコンテンツ  
✅ **スケーラブル** - Vercelの高速CDNで世界中に配信  

## 📝 注意点

⚠️ **ローカル環境では動作しません** - 必ずVercelなどにデプロイしてから埋め込む  
⚠️ **CORSの設定** - API通信がある場合は適切に設定  
⚠️ **パフォーマンス** - iframeは別ページなので読み込みに時間がかかる場合がある  

## 🔗 関連リンク

- [Vercel デプロイガイド](https://vercel.com/docs)
- [iframe のベストプラクティス](https://developer.mozilla.org/ja/docs/Web/HTML/Element/iframe)
- [STUDIO 埋め込み機能](https://help.studio.design/)

---

**これでLPに埋め込んでユーザーエンゲージメントを爆上げしましょう！🚀**

