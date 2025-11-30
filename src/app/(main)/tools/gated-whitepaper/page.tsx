"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconChevronRight, IconLightning, IconLock, IconCheck, IconArrowRight } from "@/components/icons";

// ホワイトペーパーのモックコンテンツ
const whitepaperContent = [
  {
    title: "はじめに",
    content: `BtoBマーケティングにおいて、リード獲得は最も重要な課題の一つです。
    
本ホワイトペーパーでは、実際に成果を上げている企業の事例をもとに、効果的なリード獲得戦略について解説します。

特に、デジタルマーケティングを活用した最新のアプローチに焦点を当て、すぐに実践できる具体的な施策をご紹介します。`,
  },
  {
    title: "第1章：BtoBマーケティングの現状",
    content: `2024年、BtoBマーケティングの環境は大きく変化しています。

【主な変化】
• 購買プロセスのデジタル化が加速
• 意思決定者の70%以上がオンラインで情報収集
• コンテンツマーケティングの重要性が増大
• MA（マーケティングオートメーション）の普及

これらの変化に対応できている企業とそうでない企業で、リード獲得の効率に大きな差が生まれています。`,
  },
  {
    title: "第2章：効果的なリード獲得チャネル",
    content: `BtoBで特に効果が高いリード獲得チャネルをご紹介します。

1. コンテンツマーケティング
   - ホワイトペーパー
   - ウェビナー
   - ブログ記事

2. 広告施策
   - リスティング広告
   - SNS広告（LinkedIn、Facebook）
   - リターゲティング広告

3. SEO対策
   - キーワード戦略
   - コンテンツSEO
   - テクニカルSEO`,
  },
];

const lockedContent = [
  {
    title: "第3章：CVRを2倍にする具体的施策",
    content: "※ この続きを読むにはメールアドレスの登録が必要です",
    isLocked: true,
  },
  {
    title: "第4章：成功事例5選",
    content: "※ この続きを読むにはメールアドレスの登録が必要です",
    isLocked: true,
  },
  {
    title: "第5章：今日から始める実践ステップ",
    content: "※ この続きを読むにはメールアドレスの登録が必要です",
    isLocked: true,
  },
];

export default function GatedWhitepaperPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showGate, setShowGate] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("whitepaper-container");
      if (container) {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight - container.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        setScrollProgress(progress);

        // 50%読んだらゲート表示
        if (progress >= 50 && !isUnlocked && !showGate) {
          setShowGate(true);
        }
      }
    };

    const container = document.getElementById("whitepaper-container");
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [isUnlocked, showGate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // デモ用に1秒待機
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // 1秒後にアンロック
    setTimeout(() => {
      setIsUnlocked(true);
      setShowGate(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background-secondary py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
          <IconChevronRight className="w-4 h-4" />
          <Link href="/tools" className="hover:text-foreground transition-colors">ツール一覧</Link>
          <IconChevronRight className="w-4 h-4" />
          <span className="text-foreground">ゲート付きホワイトペーパー</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-t-xl border border-border border-b-0 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs text-primary font-medium bg-primary-light px-2 py-1 rounded">
                デモ
              </span>
              <h1 className="text-2xl font-bold text-foreground mt-2">
                ゲート付きホワイトペーパービューア
              </h1>
              <p className="text-foreground-muted mt-1">
                途中まで読めて、続きはメアド入力で解放されるデモです
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-background-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-foreground-muted w-12">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>

        {/* Whitepaper Content */}
        <div className="relative">
          <div 
            id="whitepaper-container"
            className="bg-white border-x border-border h-[500px] overflow-y-auto p-8"
          >
            {/* Free Content */}
            {whitepaperContent.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                  {section.title}
                </h2>
                <div className="text-foreground-muted whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}

            {/* Locked Content */}
            {isUnlocked ? (
              // 解放後のコンテンツ
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    第3章：CVRを2倍にする具体的施策
                  </h2>
                  <div className="text-foreground-muted whitespace-pre-line leading-relaxed">
                    {`ここからが本題です。CVRを2倍にするための具体的な施策を5つご紹介します。

【施策1】ゲート付きコンテンツの活用
まさに今ご覧いただいているこの仕組みです。途中まで無料で見せることで、
・コンテンツの価値を実感してもらえる
・続きを読みたいというモチベーションが高まる
・質の高いリードを獲得できる

【施策2】離脱防止ポップアップ
ページを離れようとした瞬間にポップアップを表示します。
・最後のチャンスでオファーを提示
・限定オファーで緊急性を演出
・離脱率を30%削減した事例も`}
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    第4章：成功事例5選
                  </h2>
                  <div className="text-foreground-muted whitespace-pre-line leading-relaxed">
                    {`実際にCVRを大幅に改善した企業の事例をご紹介します。

【事例1】SaaS企業A社
・ゲート付きホワイトペーパーを導入
・リード獲得数が3倍に増加
・リードの質も向上（商談化率+40%）

【事例2】製造業B社
・チャット形式フォームに変更
・フォーム完了率が2.5倍に
・問い合わせ数が月間50件→125件に`}
                  </div>
                </div>
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground mb-4 pb-2 border-b border-border">
                    第5章：今日から始める実践ステップ
                  </h2>
                  <div className="text-foreground-muted whitespace-pre-line leading-relaxed">
                    {`最後に、今日からすぐに始められる実践ステップをまとめます。

Step 1: 現状のCVRを計測する
Step 2: ボトルネックを特定する
Step 3: この資料の施策から1つ選んで実装
Step 4: A/Bテストで効果を検証
Step 5: 効果があれば全ページに展開

お読みいただきありがとうございました！
ご不明点があればお気軽にお問い合わせください。`}
                  </div>
                </div>
              </>
            ) : (
              // ロック状態のコンテンツ
              lockedContent.map((section, index) => (
                <div key={index} className="mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
                  <h2 className="text-xl font-bold text-foreground-muted mb-4 pb-2 border-b border-border flex items-center gap-2">
                    <IconLock className="w-5 h-5" />
                    {section.title}
                  </h2>
                  <div className="text-foreground-muted blur-sm select-none">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Gate Modal */}
          {showGate && !isUnlocked && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-8">
              <div className="max-w-md w-full bg-white rounded-xl border border-border shadow-xl p-8">
                {!isSubmitted ? (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                        <IconLock className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        続きを読むには
                      </h3>
                      <p className="text-foreground-muted text-sm">
                        メールアドレスを入力すると、残りの3章すべてをお読みいただけます。
                      </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="メールアドレス"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            送信中...
                          </>
                        ) : (
                          <>
                            続きを読む
                            <IconArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                    
                    <p className="text-xs text-foreground-muted text-center mt-4">
                      ※ デモ用です。実際には送信されません。
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                      <IconCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      ありがとうございます！
                    </h3>
                    <p className="text-foreground-muted text-sm">
                      続きを表示しています...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-xl border border-border border-t-0 p-4 flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            {isUnlocked ? (
              <span className="flex items-center gap-1 text-green-600">
                <IconCheck className="w-4 h-4" />
                全コンテンツ解放済み
              </span>
            ) : (
              "50%まで読むとフォームが表示されます"
            )}
          </p>
        </div>

        {/* Prompt Section */}
        <div className="mt-10 p-6 bg-white rounded-xl border border-border">
          <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <IconLightning className="w-5 h-5 text-primary" />
            このツールをCursorで作るには？
          </h3>
          <p className="text-sm text-foreground-muted mb-4">
            以下のようなプロンプトをCursorのComposer (Command + I) に入力するだけで、このようなツールが作れます。
          </p>
          <div className="bg-foreground text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <code>
              ゲート付きホワイトペーパービューアを作ってください。
              スクロールで読了率を計測し、50%読んだところでメールアドレス入力フォームをモーダル表示します。
              入力が完了すると残りのコンテンツが解放されます。プログレスバーも表示してください。
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

