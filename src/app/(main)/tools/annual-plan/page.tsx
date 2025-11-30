"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IconChevronRight, IconLightning, IconCalendar, IconTrendingUp } from "@/components/icons";

interface MonthData {
  content: number;
  ads: number;
  webinar: number;
  exhibition: number;
  other: number;
  expectedLeads: number;
  actualLeads: number | null;
}

const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

const defaultMonthlyData: MonthData[] = [
  { content: 200000, ads: 400000, webinar: 100000, exhibition: 0, other: 50000, expectedLeads: 0, actualLeads: null },
  { content: 200000, ads: 400000, webinar: 100000, exhibition: 0, other: 50000, expectedLeads: 0, actualLeads: null },
  { content: 250000, ads: 500000, webinar: 150000, exhibition: 500000, other: 100000, expectedLeads: 0, actualLeads: null },
  { content: 200000, ads: 400000, webinar: 100000, exhibition: 0, other: 50000, expectedLeads: 0, actualLeads: null },
  { content: 200000, ads: 400000, webinar: 100000, exhibition: 0, other: 50000, expectedLeads: 0, actualLeads: null },
  { content: 250000, ads: 500000, webinar: 150000, exhibition: 500000, other: 100000, expectedLeads: 0, actualLeads: null },
  { content: 150000, ads: 300000, webinar: 0, exhibition: 0, other: 50000, expectedLeads: 0, actualLeads: null },
  { content: 150000, ads: 300000, webinar: 0, exhibition: 0, other: 50000, expectedLeads: 0, actualLeads: null },
  { content: 250000, ads: 500000, webinar: 150000, exhibition: 500000, other: 100000, expectedLeads: 0, actualLeads: null },
  { content: 200000, ads: 400000, webinar: 100000, exhibition: 0, other: 50000, expectedLeads: 0, actualLeads: null },
  { content: 200000, ads: 400000, webinar: 100000, exhibition: 0, other: 50000, expectedLeads: 0, actualLeads: null },
  { content: 300000, ads: 600000, webinar: 200000, exhibition: 800000, other: 150000, expectedLeads: 0, actualLeads: null },
];

// チャネル別のリード獲得効率（予算あたりの期待リード数）
const channelEfficiency = {
  content: 0.015,    // 10万円あたり1.5リード
  ads: 0.02,         // 10万円あたり2リード
  webinar: 0.08,     // 10万円あたり8リード
  exhibition: 0.05,  // 10万円あたり5リード
  other: 0.01,       // 10万円あたり1リード
};

export default function AnnualPlanPage() {
  const [monthlyData, setMonthlyData] = useState<MonthData[]>(defaultMonthlyData);
  const [annualTarget, setAnnualTarget] = useState(2000);
  const [cpaTarget, setCpaTarget] = useState(30000);
  const [viewMode, setViewMode] = useState<"budget" | "leads">("budget");

  const updateMonth = (monthIndex: number, field: keyof MonthData, value: number) => {
    const newData = [...monthlyData];
    newData[monthIndex] = { ...newData[monthIndex], [field]: value };
    setMonthlyData(newData);
  };

  const results = useMemo(() => {
    const monthlyResults = monthlyData.map((month, idx) => {
      const total = month.content + month.ads + month.webinar + month.exhibition + month.other;
      const expectedLeads = Math.round(
        (month.content * channelEfficiency.content +
        month.ads * channelEfficiency.ads +
        month.webinar * channelEfficiency.webinar +
        month.exhibition * channelEfficiency.exhibition +
        month.other * channelEfficiency.other) / 100
      );
      const cpa = expectedLeads > 0 ? Math.round(total / expectedLeads) : 0;
      
      return {
        ...month,
        total,
        expectedLeads,
        cpa,
        monthIndex: idx,
      };
    });

    const totals = monthlyResults.reduce((acc, m) => ({
      content: acc.content + m.content,
      ads: acc.ads + m.ads,
      webinar: acc.webinar + m.webinar,
      exhibition: acc.exhibition + m.exhibition,
      other: acc.other + m.other,
      total: acc.total + m.total,
      expectedLeads: acc.expectedLeads + m.expectedLeads,
    }), { content: 0, ads: 0, webinar: 0, exhibition: 0, other: 0, total: 0, expectedLeads: 0 });

    const avgCpa = totals.expectedLeads > 0 ? Math.round(totals.total / totals.expectedLeads) : 0;
    const achievementRate = Math.round((totals.expectedLeads / annualTarget) * 100);
    const cpaVsTarget = cpaTarget > 0 ? Math.round((avgCpa / cpaTarget) * 100) : 0;

    // 四半期ごとの集計
    const quarters = [
      monthlyResults.slice(0, 3),
      monthlyResults.slice(3, 6),
      monthlyResults.slice(6, 9),
      monthlyResults.slice(9, 12),
    ].map((q, idx) => ({
      name: `Q${idx + 1}`,
      budget: q.reduce((acc, m) => acc + m.total, 0),
      leads: q.reduce((acc, m) => acc + m.expectedLeads, 0),
    }));

    return { monthlyResults, totals, avgCpa, achievementRate, cpaVsTarget, quarters };
  }, [monthlyData, annualTarget, cpaTarget]);

  const formatCurrency = (value: number) => `¥${value.toLocaleString()}`;

  const getCpaColor = (cpa: number) => {
    if (cpa === 0) return "text-foreground-muted";
    if (cpa <= cpaTarget * 0.8) return "text-green-600";
    if (cpa <= cpaTarget) return "text-foreground";
    if (cpa <= cpaTarget * 1.2) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-background-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
          <IconChevronRight className="w-4 h-4" />
          <Link href="/tools" className="hover:text-foreground transition-colors">ツール一覧</Link>
          <IconChevronRight className="w-4 h-4" />
          <span className="text-foreground">年間マーケティングプラン作成</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <IconCalendar className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">
              年間マーケティングプラン作成
            </h1>
          </div>
          <p className="text-foreground-muted">
            月別・チャネル別に予算を入力し、年間のリード獲得計画を策定します。
          </p>
        </div>

        {/* Target Settings */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="font-bold text-foreground mb-4">年間目標設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                年間リード目標
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={annualTarget}
                  onChange={(e) => setAnnualTarget(Number(e.target.value))}
                  className="w-full pr-12 pl-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">件</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                目標CPA
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">¥</span>
                <input
                  type="number"
                  value={cpaTarget}
                  onChange={(e) => setCpaTarget(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                表示モード
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("budget")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    viewMode === "budget" 
                      ? "bg-primary text-white border-primary" 
                      : "border-border hover:bg-background-secondary"
                  }`}
                >
                  予算入力
                </button>
                <button
                  onClick={() => setViewMode("leads")}
                  className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${
                    viewMode === "leads" 
                      ? "bg-primary text-white border-primary" 
                      : "border-border hover:bg-background-secondary"
                  }`}
                >
                  リード予測
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">年間予算合計</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(results.totals.total)}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">予想リード数</p>
            <p className="text-lg font-bold text-primary">{results.totals.expectedLeads.toLocaleString()}件</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">目標達成率</p>
            <p className={`text-lg font-bold ${results.achievementRate >= 100 ? "text-green-600" : "text-orange-500"}`}>
              {results.achievementRate}%
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">平均CPA</p>
            <p className={`text-lg font-bold ${getCpaColor(results.avgCpa)}`}>
              {formatCurrency(results.avgCpa)}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <p className="text-xs text-foreground-muted mb-1">CPA目標比</p>
            <p className={`text-lg font-bold ${results.cpaVsTarget <= 100 ? "text-green-600" : "text-red-500"}`}>
              {results.cpaVsTarget}%
            </p>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden mb-6">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-bold text-foreground">月別予算計画表</h2>
              <p className="text-sm text-foreground-muted mt-1">各セルをクリックして予算を編集できます（単位: 万円）</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="text-left py-3 px-3 font-medium text-foreground-muted sticky left-0 bg-background-secondary z-10 min-w-[80px]">月</th>
                  <th className="text-right py-3 px-3 font-medium text-foreground-muted min-w-[100px]">コンテンツ</th>
                  <th className="text-right py-3 px-3 font-medium text-foreground-muted min-w-[100px]">広告</th>
                  <th className="text-right py-3 px-3 font-medium text-foreground-muted min-w-[100px]">ウェビナー</th>
                  <th className="text-right py-3 px-3 font-medium text-foreground-muted min-w-[100px]">展示会</th>
                  <th className="text-right py-3 px-3 font-medium text-foreground-muted min-w-[100px]">その他</th>
                  <th className="text-right py-3 px-3 font-medium text-white bg-foreground min-w-[100px]">月合計</th>
                  <th className="text-right py-3 px-3 font-medium text-white bg-primary min-w-[80px]">予想リード</th>
                  <th className="text-right py-3 px-3 font-medium text-white bg-primary min-w-[80px]">CPA</th>
                </tr>
              </thead>
              <tbody>
                {results.monthlyResults.map((month, idx) => (
                  <tr key={idx} className={`border-t border-border ${idx % 3 === 2 ? "border-b-2 border-b-primary/20" : ""}`}>
                    <td className="py-2 px-3 font-medium text-foreground sticky left-0 bg-white z-10">
                      <div className="flex items-center gap-2">
                        <span>{months[idx]}</span>
                        {idx % 3 === 2 && (
                          <span className="text-xs text-primary font-medium">Q{Math.floor(idx / 3) + 1}末</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={month.content / 10000}
                        onChange={(e) => updateMonth(idx, "content", Number(e.target.value) * 10000)}
                        className="w-full text-right px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-blue-50/50"
                        step={1}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={month.ads / 10000}
                        onChange={(e) => updateMonth(idx, "ads", Number(e.target.value) * 10000)}
                        className="w-full text-right px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-green-50/50"
                        step={1}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={month.webinar / 10000}
                        onChange={(e) => updateMonth(idx, "webinar", Number(e.target.value) * 10000)}
                        className="w-full text-right px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-purple-50/50"
                        step={1}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={month.exhibition / 10000}
                        onChange={(e) => updateMonth(idx, "exhibition", Number(e.target.value) * 10000)}
                        className="w-full text-right px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-orange-50/50"
                        step={1}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={month.other / 10000}
                        onChange={(e) => updateMonth(idx, "other", Number(e.target.value) * 10000)}
                        className="w-full text-right px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-gray-50/50"
                        step={1}
                      />
                    </td>
                    <td className="py-2 px-3 text-right font-medium bg-foreground/5">
                      {(month.total / 10000).toLocaleString()}万
                    </td>
                    <td className="py-2 px-3 text-right font-medium bg-primary/10 text-primary">
                      {month.expectedLeads}件
                    </td>
                    <td className={`py-2 px-3 text-right font-medium bg-primary/10 ${getCpaColor(month.cpa)}`}>
                      {month.cpa > 0 ? formatCurrency(month.cpa) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-foreground text-white font-medium">
                <tr>
                  <td className="py-3 px-3 sticky left-0 bg-foreground z-10">年間合計</td>
                  <td className="py-3 px-3 text-right">{(results.totals.content / 10000).toLocaleString()}万</td>
                  <td className="py-3 px-3 text-right">{(results.totals.ads / 10000).toLocaleString()}万</td>
                  <td className="py-3 px-3 text-right">{(results.totals.webinar / 10000).toLocaleString()}万</td>
                  <td className="py-3 px-3 text-right">{(results.totals.exhibition / 10000).toLocaleString()}万</td>
                  <td className="py-3 px-3 text-right">{(results.totals.other / 10000).toLocaleString()}万</td>
                  <td className="py-3 px-3 text-right bg-white/10">{(results.totals.total / 10000).toLocaleString()}万</td>
                  <td className="py-3 px-3 text-right bg-white/20">{results.totals.expectedLeads.toLocaleString()}件</td>
                  <td className="py-3 px-3 text-right bg-white/20">{formatCurrency(results.avgCpa)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Quarterly Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <IconTrendingUp className="w-5 h-5 text-primary" />
              四半期別サマリー
            </h3>
            <div className="space-y-4">
              {results.quarters.map((q, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-foreground">{q.name}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground-muted">{(q.budget / 10000).toLocaleString()}万円</span>
                      <span className="text-primary font-medium">{q.leads}件</span>
                    </div>
                    <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(q.leads / (annualTarget / 4)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="font-bold text-foreground mb-4">チャネル別予算配分</h3>
            <div className="space-y-3">
              {[
                { name: "コンテンツ", value: results.totals.content, color: "bg-blue-500" },
                { name: "広告", value: results.totals.ads, color: "bg-green-500" },
                { name: "ウェビナー", value: results.totals.webinar, color: "bg-purple-500" },
                { name: "展示会", value: results.totals.exhibition, color: "bg-orange-500" },
                { name: "その他", value: results.totals.other, color: "bg-gray-500" },
              ].map((channel) => {
                const percentage = results.totals.total > 0 
                  ? (channel.value / results.totals.total) * 100 
                  : 0;
                return (
                  <div key={channel.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{channel.name}</span>
                      <span className="text-foreground-muted">
                        {(channel.value / 10000).toLocaleString()}万円 ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${channel.color} rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Gap Analysis */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h3 className="font-bold text-foreground mb-4">目標達成ギャップ分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg ${results.achievementRate >= 100 ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"}`}>
              <p className="text-sm font-medium mb-1">リード目標との差分</p>
              <p className={`text-2xl font-bold ${results.achievementRate >= 100 ? "text-green-600" : "text-orange-600"}`}>
                {results.achievementRate >= 100 ? "+" : ""}{results.totals.expectedLeads - annualTarget}件
              </p>
              <p className="text-sm text-foreground-muted mt-1">
                目標: {annualTarget.toLocaleString()}件 / 予測: {results.totals.expectedLeads.toLocaleString()}件
              </p>
            </div>
            <div className={`p-4 rounded-lg ${results.cpaVsTarget <= 100 ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <p className="text-sm font-medium mb-1">CPA目標との差分</p>
              <p className={`text-2xl font-bold ${results.cpaVsTarget <= 100 ? "text-green-600" : "text-red-600"}`}>
                {results.cpaVsTarget <= 100 ? "" : "+"}{formatCurrency(results.avgCpa - cpaTarget)}
              </p>
              <p className="text-sm text-foreground-muted mt-1">
                目標: {formatCurrency(cpaTarget)} / 予測: {formatCurrency(results.avgCpa)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm font-medium mb-1">目標達成に必要な追加予算</p>
              <p className="text-2xl font-bold text-blue-600">
                {results.achievementRate >= 100 ? "達成見込み" : formatCurrency(Math.max(0, (annualTarget - results.totals.expectedLeads) * cpaTarget))}
              </p>
              <p className="text-sm text-foreground-muted mt-1">
                {results.achievementRate >= 100 ? "現在の計画で目標を達成できます" : `不足リード: ${annualTarget - results.totals.expectedLeads}件`}
              </p>
            </div>
          </div>
        </div>

        {/* Prompt Section */}
        <div className="p-6 bg-white rounded-xl border border-border">
          <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <IconLightning className="w-5 h-5 text-primary" />
            このツールをCursorで作るには？
          </h3>
          <p className="text-sm text-foreground-muted mb-4">
            以下のようなプロンプトをCursorのComposer (Command + I) に入力するだけで、このようなツールが作れます。
          </p>
          <div className="bg-foreground text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <code>
              年間マーケティングプラン作成ツールを作ってください。
              12ヶ月×5チャネル（コンテンツ、広告、ウェビナー、展示会、その他）の表形式で予算を入力できるようにし、
              チャネル別のリード獲得効率から月別・年間の予想リード数を自動計算します。
              年間目標との達成率、目標CPAとの比較、四半期ごとのサマリー、ギャップ分析も表示してください。
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

