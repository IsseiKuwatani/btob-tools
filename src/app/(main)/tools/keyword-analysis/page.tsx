"use client";

import { useState } from "react";
import Link from "next/link";
import { IconSearch, IconTrendingUp, IconTrendingDown, IconEye, IconCursor, IconRefresh, IconChevronRight, IconLightning, IconLightBulb } from "@/components/icons";

// モックデータ
const mockKeywords = [
  { keyword: "BtoB マーケティング", clicks: 1250, impressions: 45000, ctr: 2.78, position: 3.2, trend: "up", change: 1.2 },
  { keyword: "リード獲得 方法", clicks: 890, impressions: 32000, ctr: 2.78, position: 5.1, trend: "up", change: 0.8 },
  { keyword: "SaaS マーケティング", clicks: 720, impressions: 28000, ctr: 2.57, position: 4.5, trend: "down", change: -0.5 },
  { keyword: "MA ツール 比較", clicks: 650, impressions: 25000, ctr: 2.60, position: 6.3, trend: "up", change: 2.1 },
  { keyword: "インサイドセールス", clicks: 580, impressions: 22000, ctr: 2.64, position: 7.8, trend: "stable", change: 0.1 },
  { keyword: "コンテンツマーケティング BtoB", clicks: 520, impressions: 19000, ctr: 2.74, position: 8.2, trend: "down", change: -1.3 },
  { keyword: "リードナーチャリング", clicks: 480, impressions: 18000, ctr: 2.67, position: 9.1, trend: "up", change: 0.6 },
  { keyword: "BtoB 広告", clicks: 420, impressions: 16000, ctr: 2.63, position: 11.5, trend: "down", change: -2.1 },
];

const summaryData = {
  totalClicks: 5510,
  totalImpressions: 205000,
  avgCtr: 2.69,
  avgPosition: 6.8,
  clicksChange: 12.5,
  impressionsChange: 8.2,
};

export default function KeywordAnalysisPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("28days");
  const [sortBy, setSortBy] = useState<"clicks" | "impressions" | "position">("clicks");

  const sortedKeywords = [...mockKeywords].sort((a, b) => {
    if (sortBy === "position") return a.position - b.position;
    return b[sortBy] - a[sortBy];
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background-secondary py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
            <IconChevronRight className="w-4 h-4" />
            <Link href="/tools" className="hover:text-foreground transition-colors">ツール一覧</Link>
            <IconChevronRight className="w-4 h-4" />
            <span className="text-foreground">キーワードパフォーマンス分析</span>
          </nav>

          {/* Connect Screen */}
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
              <IconSearch className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              キーワードパフォーマンス分析
            </h1>
            <p className="text-foreground-muted mb-8 max-w-md mx-auto">
              Google Search Consoleと連携して、キーワード別のクリック数・表示回数・順位を分析します。
            </p>
            
            <button
              onClick={() => setIsConnected(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Search Consoleと連携（デモ）
            </button>
            
            <p className="text-xs text-foreground-muted mt-4">
              ※ デモ用のモックデータが表示されます
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
                Search Console APIと連携するキーワード分析ダッシュボードを作ってください。
                キーワード別のクリック数・表示回数・CTR・平均順位を表示し、順位の変動トレンドも表示してください。
                期間選択とソート機能をつけてください。
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-secondary py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-2">
              <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
              <IconChevronRight className="w-4 h-4" />
              <Link href="/tools" className="hover:text-foreground transition-colors">ツール一覧</Link>
              <IconChevronRight className="w-4 h-4" />
              <span className="text-foreground">キーワードパフォーマンス分析</span>
            </nav>
            <h1 className="text-2xl font-bold text-foreground">キーワードパフォーマンス分析</h1>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-white border border-border rounded-lg text-sm"
            >
              <option value="7days">過去7日間</option>
              <option value="28days">過去28日間</option>
              <option value="3months">過去3ヶ月</option>
            </select>
            <button className="p-2 bg-white border border-border rounded-lg hover:bg-background-secondary transition-colors">
              <IconRefresh className="w-5 h-5 text-foreground-muted" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">合計クリック数</span>
              <IconCursor className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{summaryData.totalClicks.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+{summaryData.clicksChange}% 前期比</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">合計表示回数</span>
              <IconEye className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{summaryData.totalImpressions.toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-1">+{summaryData.impressionsChange}% 前期比</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">平均CTR</span>
              <IconTrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{summaryData.avgCtr}%</p>
            <p className="text-xs text-foreground-muted mt-1">業界平均: 2.5%</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">平均順位</span>
              <IconSearch className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{summaryData.avgPosition}位</p>
            <p className="text-xs text-foreground-muted mt-1">目標: 5位以内</p>
          </div>
        </div>

        {/* Keywords Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">キーワード別パフォーマンス</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground-muted">並び替え:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-2 py-1 bg-background-secondary border border-border rounded text-sm"
              >
                <option value="clicks">クリック数</option>
                <option value="impressions">表示回数</option>
                <option value="position">順位</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground-muted uppercase">キーワード</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase">クリック</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase">表示回数</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase">CTR</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase">順位</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-foreground-muted uppercase">トレンド</th>
                </tr>
              </thead>
              <tbody>
                {sortedKeywords.map((kw, index) => (
                  <tr key={index} className="border-t border-border hover:bg-background-secondary/50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-foreground">{kw.keyword}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">{kw.clicks.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-foreground-muted">{kw.impressions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-foreground-muted">{kw.ctr}%</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`font-medium ${kw.position <= 5 ? "text-green-600" : kw.position <= 10 ? "text-foreground" : "text-foreground-muted"}`}>
                        {kw.position.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-1">
                        {kw.trend === "up" ? (
                          <>
                            <IconTrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600">+{kw.change}</span>
                          </>
                        ) : kw.trend === "down" ? (
                          <>
                            <IconTrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-500">{kw.change}</span>
                          </>
                        ) : (
                          <span className="text-xs text-foreground-muted">-</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insight Card */}
        <div className="mt-6 bg-white rounded-xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <IconLightBulb className="w-5 h-5 text-primary" />
            改善ポイント
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <p className="text-sm font-medium text-green-800 mb-1">順位上昇中</p>
              <p className="text-sm text-green-700">
                「MA ツール 比較」が+2.1位上昇。このタイミングでコンテンツを強化すると上位表示のチャンス。
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <p className="text-sm font-medium text-red-800 mb-1">要対策</p>
              <p className="text-sm text-red-700">
                「BtoB 広告」が-2.1位下落。競合記事をチェックし、リライトを検討してください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

