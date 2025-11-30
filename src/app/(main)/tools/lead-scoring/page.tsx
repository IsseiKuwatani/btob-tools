"use client";

import { useState } from "react";
import Link from "next/link";
import { IconUsers, IconMail, IconEye, IconStar, IconRefresh, IconChevronRight, IconLightning, IconFilter, IconTarget, IconTrendingUp, IconLightBulb } from "@/components/icons";

// モックデータ
const mockLeads = [
  {
    id: 1,
    name: "田中 健一",
    company: "株式会社テックスタート",
    email: "tanaka@techstart.co.jp",
    score: 92,
    status: "hot",
    lastActivity: "料金ページを3回閲覧",
    lastActivityTime: "2時間前",
    activities: {
      pageViews: 28,
      emailOpens: 5,
      downloads: 2,
      formSubmits: 1,
    },
  },
  {
    id: 2,
    name: "山田 美咲",
    company: "グローバルソリューションズ",
    email: "yamada@global-sol.jp",
    score: 85,
    status: "hot",
    lastActivity: "ホワイトペーパーをダウンロード",
    lastActivityTime: "5時間前",
    activities: {
      pageViews: 22,
      emailOpens: 4,
      downloads: 3,
      formSubmits: 1,
    },
  },
  {
    id: 3,
    name: "佐藤 雄太",
    company: "イノベーションラボ",
    email: "sato@innovation-lab.jp",
    score: 68,
    status: "warm",
    lastActivity: "メールをクリック",
    lastActivityTime: "1日前",
    activities: {
      pageViews: 15,
      emailOpens: 3,
      downloads: 1,
      formSubmits: 0,
    },
  },
  {
    id: 4,
    name: "鈴木 花子",
    company: "デジタルマーケティング社",
    email: "suzuki@dm-company.jp",
    score: 55,
    status: "warm",
    lastActivity: "ブログ記事を閲覧",
    lastActivityTime: "2日前",
    activities: {
      pageViews: 12,
      emailOpens: 2,
      downloads: 0,
      formSubmits: 0,
    },
  },
  {
    id: 5,
    name: "高橋 誠",
    company: "ビジネスコンサルティング",
    email: "takahashi@biz-consul.jp",
    score: 42,
    status: "cold",
    lastActivity: "メールを開封",
    lastActivityTime: "5日前",
    activities: {
      pageViews: 5,
      emailOpens: 2,
      downloads: 0,
      formSubmits: 0,
    },
  },
  {
    id: 6,
    name: "伊藤 真理",
    company: "クラウドサービス株式会社",
    email: "ito@cloud-service.jp",
    score: 35,
    status: "cold",
    lastActivity: "サイト訪問",
    lastActivityTime: "1週間前",
    activities: {
      pageViews: 3,
      emailOpens: 1,
      downloads: 0,
      formSubmits: 0,
    },
  },
];

const summaryData = {
  totalLeads: 156,
  hotLeads: 28,
  warmLeads: 64,
  coldLeads: 64,
  avgScore: 58,
};

export default function LeadScoringPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedLead, setSelectedLead] = useState<typeof mockLeads[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "hot" | "warm" | "cold">("all");

  const filteredLeads = mockLeads.filter(lead => 
    filterStatus === "all" || lead.status === filterStatus
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
            <span className="text-foreground">リードスコアリング</span>
          </nav>

          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-6">
              <IconUsers className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              リードスコアリング
            </h1>
            <p className="text-foreground-muted mb-8 max-w-md mx-auto">
              HubSpotと連携して、リードの行動履歴からスコアを自動算出し、優先的にアプローチすべきリードを特定します。
            </p>
            
            <button
              onClick={() => setIsConnected(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff7a59] text-white font-medium rounded-lg hover:bg-[#e66a4d] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.984 2.21 2.21 0 00-4.42 0c0 .873.506 1.628 1.238 1.984V7.93a5.573 5.573 0 00-3.095 1.6L6.782 4.654a2.014 2.014 0 00.088-.592 2.03 2.03 0 10-2.03 2.03c.264 0 .515-.05.747-.142l6.43 4.86a5.566 5.566 0 00-.507 2.323c0 .86.194 1.674.542 2.401l-2.834 2.646a1.789 1.789 0 00-.535-.081 1.806 1.806 0 100 3.611 1.806 1.806 0 001.806-1.805c0-.227-.042-.443-.119-.643l2.768-2.585a5.573 5.573 0 003.965 1.653 5.588 5.588 0 005.588-5.588 5.588 5.588 0 00-4.527-5.482z"/>
              </svg>
              HubSpotと連携（デモ）
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
                HubSpot APIと連携するリードスコアリングダッシュボードを作ってください。
                リード一覧をスコア順に表示し、クリックすると行動履歴の詳細パネルが開くUIにしてください。
                Hot/Warm/Coldのステータスでフィルターできるようにしてください。
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
              <span className="text-foreground">リードスコアリング</span>
            </nav>
            <h1 className="text-2xl font-bold text-foreground">リードスコアリング</h1>
          </div>
          <button className="inline-flex items-center gap-2 p-2 bg-white border border-border rounded-lg hover:bg-background-secondary transition-colors">
            <IconRefresh className="w-5 h-5 text-foreground-muted" />
            <span className="text-sm">同期</span>
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-sm text-foreground-muted mb-1">総リード数</p>
            <p className="text-2xl font-bold text-foreground">{summaryData.totalLeads}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-sm text-foreground-muted mb-1">Hot</p>
            <p className="text-2xl font-bold text-red-500">{summaryData.hotLeads}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-sm text-foreground-muted mb-1">Warm</p>
            <p className="text-2xl font-bold text-yellow-500">{summaryData.warmLeads}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-sm text-foreground-muted mb-1">Cold</p>
            <p className="text-2xl font-bold text-blue-500">{summaryData.coldLeads}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-sm text-foreground-muted mb-1">平均スコア</p>
            <p className="text-2xl font-bold text-foreground">{summaryData.avgScore}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead List */}
          <div className="lg:col-span-2">
            {/* Filter */}
            <div className="bg-white rounded-xl border border-border p-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <IconFilter className="w-4 h-4 text-foreground-muted" />
                  <span className="text-sm text-foreground-muted">ステータス:</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { value: "all", label: "すべて", color: "bg-foreground" },
                    { value: "hot", label: "Hot", color: "bg-red-500" },
                    { value: "warm", label: "Warm", color: "bg-yellow-500" },
                    { value: "cold", label: "Cold", color: "bg-blue-500" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilterStatus(option.value as typeof filterStatus)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        filterStatus === option.value
                          ? `${option.color} text-white`
                          : "bg-background-secondary text-foreground-muted hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="divide-y divide-border">
                {filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`w-full p-4 text-left hover:bg-background-secondary/50 transition-colors ${
                      selectedLead?.id === lead.id ? "bg-primary-light" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-background-secondary flex items-center justify-center text-lg font-bold text-foreground-muted">
                            {lead.name.charAt(0)}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            lead.status === "hot" ? "bg-red-500" : lead.status === "warm" ? "bg-yellow-500" : "bg-blue-500"
                          }`}>
                            {lead.score}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{lead.name}</p>
                          <p className="text-sm text-foreground-muted">{lead.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground-muted">{lead.lastActivity}</p>
                        <p className="text-xs text-foreground-muted">{lead.lastActivityTime}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-1">
            {selectedLead ? (
              <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-background-secondary flex items-center justify-center text-2xl font-bold text-foreground-muted mx-auto mb-3">
                    {selectedLead.name.charAt(0)}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{selectedLead.name}</h3>
                  <p className="text-sm text-foreground-muted">{selectedLead.company}</p>
                  <p className="text-xs text-foreground-muted">{selectedLead.email}</p>
                </div>

                {/* Score */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground-muted">リードスコア</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      selectedLead.status === "hot" 
                        ? "bg-red-100 text-red-700" 
                        : selectedLead.status === "warm"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {selectedLead.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-background-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          selectedLead.score >= 70 ? "bg-red-500" : selectedLead.score >= 40 ? "bg-yellow-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${selectedLead.score}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-foreground">{selectedLead.score}</span>
                  </div>
                </div>

                {/* Activity Breakdown */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground mb-3">行動履歴</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-background-secondary rounded-lg text-center">
                      <IconEye className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{selectedLead.activities.pageViews}</p>
                      <p className="text-xs text-foreground-muted">ページ閲覧</p>
                    </div>
                    <div className="p-3 bg-background-secondary rounded-lg text-center">
                      <IconMail className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{selectedLead.activities.emailOpens}</p>
                      <p className="text-xs text-foreground-muted">メール開封</p>
                    </div>
                    <div className="p-3 bg-background-secondary rounded-lg text-center">
                      <IconTarget className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{selectedLead.activities.downloads}</p>
                      <p className="text-xs text-foreground-muted">DL数</p>
                    </div>
                    <div className="p-3 bg-background-secondary rounded-lg text-center">
                      <IconTrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
                      <p className="text-lg font-bold text-foreground">{selectedLead.activities.formSubmits}</p>
                      <p className="text-xs text-foreground-muted">フォーム送信</p>
                    </div>
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="p-4 bg-primary-light rounded-lg">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <IconLightBulb className="w-4 h-4 text-primary" />
                    推奨アクション
                  </h4>
                  <p className="text-sm text-foreground-muted">
                    {selectedLead.score >= 70 
                      ? "今すぐ架電してアポイントを取得しましょう！"
                      : selectedLead.score >= 40
                      ? "ナーチャリングメールを送信して関係を深めましょう。"
                      : "まずはメルマガ登録を促してコンタクトを維持しましょう。"
                    }
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-border p-12 text-center">
                <IconUsers className="w-12 h-12 text-foreground-muted/30 mx-auto mb-4" />
                <p className="text-sm text-foreground-muted">
                  リードをクリックすると<br />詳細が表示されます
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

