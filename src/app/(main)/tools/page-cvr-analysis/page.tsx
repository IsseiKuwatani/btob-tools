"use client";

import { useState } from "react";
import Link from "next/link";
import { IconChart, IconTrendingUp, IconTrendingDown, IconEye, IconTarget, IconRefresh, IconChevronRight, IconLightning, IconFilter, IconLightBulb } from "@/components/icons";

// モックデータ
const mockPages = [
  { 
    path: "/lp/saas-comparison", 
    title: "SaaS比較LP",
    sessions: 12500, 
    conversions: 375,
    cvr: 3.0, 
    bounceRate: 42,
    avgTime: "2:45",
    trend: "up",
    priority: "high"
  },
  { 
    path: "/lp/whitepaper-download", 
    title: "ホワイトペーパーDL",
    sessions: 8900, 
    conversions: 445,
    cvr: 5.0, 
    bounceRate: 35,
    avgTime: "3:12",
    trend: "up",
    priority: "low"
  },
  { 
    path: "/lp/free-trial", 
    title: "無料トライアルLP",
    sessions: 7200, 
    conversions: 144,
    cvr: 2.0, 
    bounceRate: 58,
    avgTime: "1:30",
    trend: "down",
    priority: "high"
  },
  { 
    path: "/service/pricing", 
    title: "料金ページ",
    sessions: 6800, 
    conversions: 204,
    cvr: 3.0, 
    bounceRate: 45,
    avgTime: "2:20",
    trend: "stable",
    priority: "medium"
  },
  { 
    path: "/blog/marketing-guide", 
    title: "マーケティングガイド",
    sessions: 5400, 
    conversions: 108,
    cvr: 2.0, 
    bounceRate: 52,
    avgTime: "4:15",
    trend: "up",
    priority: "medium"
  },
  { 
    path: "/lp/webinar", 
    title: "ウェビナー申込LP",
    sessions: 4200, 
    conversions: 168,
    cvr: 4.0, 
    bounceRate: 38,
    avgTime: "2:55",
    trend: "up",
    priority: "low"
  },
  { 
    path: "/contact", 
    title: "お問い合わせ",
    sessions: 3800, 
    conversions: 76,
    cvr: 2.0, 
    bounceRate: 62,
    avgTime: "1:10",
    trend: "down",
    priority: "high"
  },
];

const summaryData = {
  totalSessions: 48800,
  totalConversions: 1520,
  avgCvr: 3.11,
  avgBounceRate: 47.4,
};

export default function PageCvrAnalysisPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("28days");
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "medium" | "low">("all");

  const filteredPages = mockPages.filter(page => 
    filterPriority === "all" || page.priority === filterPriority
  );

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background-secondary py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
            <IconChevronRight className="w-4 h-4" />
            <Link href="/tools" className="hover:text-foreground transition-colors">ツール一覧</Link>
            <IconChevronRight className="w-4 h-4" />
            <span className="text-foreground">ページ別CVR分析</span>
          </nav>

          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
              <IconChart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              ページ別CVR分析
            </h1>
            <p className="text-foreground-muted mb-8 max-w-md mx-auto">
              Google Analytics 4と連携して、ページ別のセッション・CVR・離脱率を分析し、改善すべきページを特定します。
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
              GA4と連携（デモ）
            </button>
            
            <p className="text-xs text-foreground-muted mt-4">
              ※ デモ用のモックデータが表示されます
            </p>
          </div>

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
                GA4 APIと連携するページ別CVR分析ダッシュボードを作ってください。
                ページ別のセッション数・コンバージョン数・CVR・直帰率・平均滞在時間を表形式で表示し、
                改善優先度を自動判定してください。フィルター機能もつけてください。
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
              <span className="text-foreground">ページ別CVR分析</span>
            </nav>
            <h1 className="text-2xl font-bold text-foreground">ページ別CVR分析</h1>
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
              <span className="text-sm text-foreground-muted">総セッション</span>
              <IconEye className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{summaryData.totalSessions.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">総CV数</span>
              <IconTarget className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{summaryData.totalConversions.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">平均CVR</span>
              <IconTrendingUp className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{summaryData.avgCvr}%</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground-muted">平均直帰率</span>
              <IconChart className="w-5 h-5 text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{summaryData.avgBounceRate}%</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-border p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <IconFilter className="w-4 h-4 text-foreground-muted" />
              <span className="text-sm text-foreground-muted">優先度:</span>
            </div>
            <div className="flex gap-2">
              {[
                { value: "all", label: "すべて" },
                { value: "high", label: "高" },
                { value: "medium", label: "中" },
                { value: "low", label: "低" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterPriority(option.value as typeof filterPriority)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    filterPriority === option.value
                      ? "bg-primary text-white"
                      : "bg-background-secondary text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pages Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="text-left py-3 px-4 text-xs font-medium text-foreground-muted uppercase">ページ</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase">セッション</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase">CV数</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase">CVR</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase">直帰率</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-foreground-muted uppercase">滞在時間</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-foreground-muted uppercase">優先度</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page, index) => (
                  <tr key={index} className="border-t border-border hover:bg-background-secondary/50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground">{page.title}</p>
                        <p className="text-xs text-foreground-muted">{page.path}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-medium">{page.sessions.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">{page.conversions}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className={`font-medium ${page.cvr >= 3 ? "text-green-600" : page.cvr >= 2 ? "text-foreground" : "text-red-500"}`}>
                          {page.cvr.toFixed(1)}%
                        </span>
                        {page.trend === "up" && <IconTrendingUp className="w-3 h-3 text-green-600" />}
                        {page.trend === "down" && <IconTrendingDown className="w-3 h-3 text-red-500" />}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={page.bounceRate > 50 ? "text-red-500" : "text-foreground-muted"}>
                        {page.bounceRate}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right text-foreground-muted">{page.avgTime}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        page.priority === "high" 
                          ? "bg-red-100 text-red-700" 
                          : page.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {page.priority === "high" ? "高" : page.priority === "medium" ? "中" : "低"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-6 bg-white rounded-xl border border-border p-6">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <IconLightBulb className="w-5 h-5 text-primary" />
            改善レコメンド
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-100">
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded">優先度高</span>
              <div>
                <p className="font-medium text-red-800">無料トライアルLPの直帰率が高い</p>
                <p className="text-sm text-red-700 mt-1">
                  直帰率58%、CVR2.0%と低迷。ファーストビューの訴求内容と入力フォームの最適化を推奨。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs font-medium rounded">優先度中</span>
              <div>
                <p className="font-medium text-yellow-800">料金ページの滞在時間が短い</p>
                <p className="text-sm text-yellow-700 mt-1">
                  滞在時間2:20。プラン比較表の見せ方を工夫し、FAQを充実させることを推奨。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

