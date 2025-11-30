"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IconChevronRight, IconLightning, IconArrowRight, IconCheck } from "@/components/icons";

export default function ExitPopupPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasShownPopup, setHasShownPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [demoMode, setDemoMode] = useState<"waiting" | "triggered" | "submitted">("waiting");

  // 離脱検知
  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 0 && !hasShownPopup && !showPopup) {
      setShowPopup(true);
      setHasShownPopup(true);
      setDemoMode("triggered");
    }
  }, [hasShownPopup, showPopup]);

  useEffect(() => {
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [handleMouseLeave]);

  // カウントダウン
  useEffect(() => {
    if (showPopup && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setDemoMode("submitted");
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };

  const triggerPopupManually = () => {
    if (!hasShownPopup) {
      setShowPopup(true);
      setHasShownPopup(true);
      setDemoMode("triggered");
    }
  };

  const resetDemo = () => {
    setShowPopup(false);
    setHasShownPopup(false);
    setIsSubmitted(false);
    setCountdown(10);
    setDemoMode("waiting");
    setEmail("");
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
          <span className="text-foreground">離脱検知ポップアップ</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <span className="text-xs text-primary font-medium bg-primary-light px-2 py-1 rounded">
            デモ
          </span>
          <h1 className="text-2xl font-bold text-foreground mt-2">
            離脱検知ポップアップ
          </h1>
          <p className="text-foreground-muted mt-1">
            マウスが画面外（上）に出ると、ポップアップが表示されます
          </p>
          
          {/* Demo Status */}
          <div className="mt-6 p-4 bg-background-secondary rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  demoMode === "waiting" ? "bg-yellow-500 animate-pulse" :
                  demoMode === "triggered" ? "bg-primary" :
                  "bg-green-500"
                }`} />
                <span className="text-sm font-medium text-foreground">
                  {demoMode === "waiting" && "マウスを画面上部に移動してください"}
                  {demoMode === "triggered" && "ポップアップが表示されました！"}
                  {demoMode === "submitted" && "リード獲得成功！"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={triggerPopupManually}
                  disabled={hasShownPopup}
                  className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  手動でトリガー
                </button>
                <button
                  onClick={resetDemo}
                  className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-background-secondary transition-colors"
                >
                  リセット
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Landing Page */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {/* Hero */}
          <div className="bg-primary text-white p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              BtoBマーケティングを<br />次のステージへ
            </h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              リード獲得から商談化まで、ワンストップで支援。
              導入企業の平均CVRは2.5倍に向上しています。
            </p>
            <button className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-blue-50 transition-colors">
              無料で始める
            </button>
          </div>

          {/* Features */}
          <div className="p-12">
            <h3 className="text-xl font-bold text-foreground text-center mb-8">
              選ばれる3つの理由
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "導入が簡単", desc: "タグを1行追加するだけで即日導入可能" },
                { title: "効果が見える", desc: "リアルタイムダッシュボードで成果を可視化" },
                { title: "サポート充実", desc: "専任担当者が成功までしっかり伴走" },
              ].map((feature, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold">{i + 1}</span>
                  </div>
                  <h4 className="font-bold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-foreground-muted">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-background-secondary p-8 text-center">
            <p className="text-foreground-muted mb-4">
              ↑ マウスを画面上部に移動すると、離脱防止ポップアップが表示されます
            </p>
          </div>
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
              離脱検知ポップアップを作ってください。
              マウスが画面上部に出たときにポップアップを表示します。
              カウントダウンタイマーを表示し、緊急性を演出してください。
              メールアドレスの入力フォームと、限定オファーの文言を含めてください。
            </code>
          </div>
        </div>
      </div>

      {/* Exit Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {!isSubmitted ? (
              <>
                {/* Header with countdown */}
                <div className="bg-primary text-white p-6 text-center relative">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="absolute top-4 right-4 text-white/70 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{countdown}</span>
                    <span className="text-blue-100 ml-1">秒</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">
                    ちょっと待って！
                  </h3>
                  <p className="text-blue-100">
                    今なら特別オファーをご用意しています
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded">
                        限定
                      </span>
                      <span className="text-sm text-foreground-muted">
                        本日限りの特別オファー
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-foreground mb-2">
                      初月無料 + 導入サポート付き
                    </h4>
                    <p className="text-foreground-muted text-sm">
                      通常10万円の導入サポートが無料に。
                      このページを離れると、このオファーは表示されません。
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
                      className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                    >
                      特別オファーを受け取る
                      <IconArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <p className="text-xs text-foreground-muted text-center mt-4">
                    ※ デモ用です。実際には送信されません。
                  </p>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <IconCheck className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  ありがとうございます！
                </h3>
                <p className="text-foreground-muted">
                  特別オファーの詳細をメールでお送りします。
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

