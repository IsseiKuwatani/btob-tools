"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { IconChevronRight, IconLightning, IconTrendingUp, IconCurrency } from "@/components/icons";

interface Channel {
  id: string;
  name: string;
  budget: number;
  cpc: number;
  cvr: number;
  enabled: boolean;
}

const defaultChannels: Channel[] = [
  { id: "listing", name: "リスティング広告", budget: 500000, cpc: 200, cvr: 2.5, enabled: true },
  { id: "facebook", name: "Facebook広告", budget: 300000, cpc: 150, cvr: 1.8, enabled: true },
  { id: "linkedin", name: "LinkedIn広告", budget: 400000, cpc: 500, cvr: 3.5, enabled: true },
  { id: "display", name: "ディスプレイ広告", budget: 200000, cpc: 80, cvr: 0.8, enabled: true },
  { id: "content", name: "コンテンツマーケ", budget: 300000, cpc: 50, cvr: 4.0, enabled: true },
  { id: "webinar", name: "ウェビナー", budget: 150000, cpc: 0, cvr: 15.0, enabled: true },
  { id: "exhibition", name: "展示会・イベント", budget: 500000, cpc: 0, cvr: 8.0, enabled: false },
  { id: "referral", name: "紹介・リファラル", budget: 100000, cpc: 0, cvr: 20.0, enabled: false },
];

export default function BudgetSimulatorPage() {
  const [channels, setChannels] = useState<Channel[]>(defaultChannels);
  const [avgDealSize, setAvgDealSize] = useState(500000);
  const [closeRate, setCloseRate] = useState(20);

  const updateChannel = (id: string, field: keyof Channel, value: number | boolean) => {
    setChannels(channels.map(ch => 
      ch.id === id ? { ...ch, [field]: value } : ch
    ));
  };

  const results = useMemo(() => {
    const enabledChannels = channels.filter(ch => ch.enabled);
    
    const channelResults = enabledChannels.map(ch => {
      // 広告系（CPC > 0）とその他で計算を分ける
      let clicks = 0;
      let leads = 0;
      let cpa = 0;

      if (ch.cpc > 0) {
        clicks = Math.floor(ch.budget / ch.cpc);
        leads = Math.floor(clicks * (ch.cvr / 100));
        cpa = leads > 0 ? Math.round(ch.budget / leads) : 0;
      } else {
        // ウェビナーや展示会は予算から直接リードを計算（仮定: 予算10万円あたり基準リード数）
        const baseLeadsPerBudget = ch.cvr; // cvr をリード効率として使用
        leads = Math.floor((ch.budget / 100000) * baseLeadsPerBudget);
        cpa = leads > 0 ? Math.round(ch.budget / leads) : 0;
        clicks = leads * 5; // 参加者/閲覧者の概算
      }

      const deals = Math.floor(leads * (closeRate / 100));
      const revenue = deals * avgDealSize;
      const roi = ch.budget > 0 ? Math.round(((revenue - ch.budget) / ch.budget) * 100) : 0;

      return {
        ...ch,
        clicks,
        leads,
        cpa,
        deals,
        revenue,
        roi,
      };
    });

    // 合計
    const totals = channelResults.reduce((acc, ch) => ({
      budget: acc.budget + ch.budget,
      clicks: acc.clicks + ch.clicks,
      leads: acc.leads + ch.leads,
      deals: acc.deals + ch.deals,
      revenue: acc.revenue + ch.revenue,
    }), { budget: 0, clicks: 0, leads: 0, deals: 0, revenue: 0 });

    const avgCpa = totals.leads > 0 ? Math.round(totals.budget / totals.leads) : 0;
    const totalRoi = totals.budget > 0 ? Math.round(((totals.revenue - totals.budget) / totals.budget) * 100) : 0;

    // ベストチャネル
    const bestByLeads = [...channelResults].sort((a, b) => b.leads - a.leads)[0];
    const bestByCpa = [...channelResults].filter(ch => ch.cpa > 0).sort((a, b) => a.cpa - b.cpa)[0];
    const bestByRoi = [...channelResults].sort((a, b) => b.roi - a.roi)[0];

    return {
      channels: channelResults,
      totals: { ...totals, avgCpa, totalRoi },
      best: { byLeads: bestByLeads, byCpa: bestByCpa, byRoi: bestByRoi },
    };
  }, [channels, avgDealSize, closeRate]);

  const formatCurrency = (value: number) => `¥${value.toLocaleString()}`;
  const formatPercent = (value: number) => `${value}%`;

  return (
    <div className="min-h-screen bg-background-secondary py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">ホーム</Link>
          <IconChevronRight className="w-4 h-4" />
          <Link href="/tools" className="hover:text-foreground transition-colors">ツール一覧</Link>
          <IconChevronRight className="w-4 h-4" />
          <span className="text-foreground">マーケティング予算配分シミュレーター</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            マーケティング予算配分シミュレーター
          </h1>
          <p className="text-foreground-muted mt-1">
            チャネル別に予算を配分し、予想リード数・CPA・ROIを比較シミュレーションします
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="font-bold text-foreground mb-4">基本設定</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                平均受注単価
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted">¥</span>
                <input
                  type="number"
                  value={avgDealSize}
                  onChange={(e) => setAvgDealSize(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                リード→受注率
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={closeRate}
                  onChange={(e) => setCloseRate(Number(e.target.value))}
                  className="w-full pr-8 pl-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl border border-border overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <h2 className="font-bold text-foreground">チャネル別シミュレーション</h2>
            <p className="text-sm text-foreground-muted mt-1">各チャネルの予算・CPC・CVRを調整してください</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background-secondary">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-foreground-muted">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={channels.every(ch => ch.enabled)}
                      onChange={(e) => setChannels(channels.map(ch => ({ ...ch, enabled: e.target.checked })))}
                    />
                    チャネル
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-foreground-muted">月間予算</th>
                  <th className="text-right py-3 px-4 font-medium text-foreground-muted">CPC</th>
                  <th className="text-right py-3 px-4 font-medium text-foreground-muted">CVR</th>
                  <th className="text-right py-3 px-4 font-medium text-foreground-muted bg-primary-light">クリック数</th>
                  <th className="text-right py-3 px-4 font-medium text-foreground-muted bg-primary-light">リード数</th>
                  <th className="text-right py-3 px-4 font-medium text-foreground-muted bg-primary-light">CPA</th>
                  <th className="text-right py-3 px-4 font-medium text-foreground-muted bg-primary-light">受注数</th>
                  <th className="text-right py-3 px-4 font-medium text-foreground-muted bg-primary-light">売上</th>
                  <th className="text-right py-3 px-4 font-medium text-foreground-muted bg-primary-light">ROI</th>
                </tr>
              </thead>
              <tbody>
                {channels.map((channel, index) => {
                  const result = results.channels.find(ch => ch.id === channel.id);
                  return (
                    <tr key={channel.id} className={`border-t border-border ${!channel.enabled ? "opacity-40" : ""}`}>
                      <td className="py-3 px-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={channel.enabled}
                            onChange={(e) => updateChannel(channel.id, "enabled", e.target.checked)}
                            className="rounded"
                          />
                          <span className="font-medium text-foreground">{channel.name}</span>
                        </label>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={channel.budget}
                          onChange={(e) => updateChannel(channel.id, "budget", Number(e.target.value))}
                          className="w-28 text-right px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                          step={10000}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="number"
                          value={channel.cpc}
                          onChange={(e) => updateChannel(channel.id, "cpc", Number(e.target.value))}
                          className="w-20 text-right px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                          disabled={channel.cpc === 0}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <input
                            type="number"
                            value={channel.cvr}
                            onChange={(e) => updateChannel(channel.id, "cvr", Number(e.target.value))}
                            className="w-16 text-right px-2 py-1 border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            step={0.1}
                          />
                          <span className="text-foreground-muted">%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right bg-primary-light/30 text-foreground-muted">
                        {result?.clicks.toLocaleString() || "-"}
                      </td>
                      <td className="py-3 px-4 text-right bg-primary-light/30 font-medium">
                        {result?.leads.toLocaleString() || "-"}
                      </td>
                      <td className="py-3 px-4 text-right bg-primary-light/30">
                        <span className={result && result.cpa <= results.totals.avgCpa ? "text-green-600 font-medium" : ""}>
                          {result ? formatCurrency(result.cpa) : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right bg-primary-light/30">
                        {result?.deals.toLocaleString() || "-"}
                      </td>
                      <td className="py-3 px-4 text-right bg-primary-light/30">
                        {result ? formatCurrency(result.revenue) : "-"}
                      </td>
                      <td className="py-3 px-4 text-right bg-primary-light/30">
                        <span className={result && result.roi > 0 ? "text-green-600 font-medium" : result && result.roi < 0 ? "text-red-500" : ""}>
                          {result ? formatPercent(result.roi) : "-"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-foreground text-white font-medium">
                <tr>
                  <td className="py-3 px-4">合計 / 平均</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(results.totals.budget)}</td>
                  <td className="py-3 px-4 text-right">-</td>
                  <td className="py-3 px-4 text-right">-</td>
                  <td className="py-3 px-4 text-right">{results.totals.clicks.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{results.totals.leads.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(results.totals.avgCpa)}</td>
                  <td className="py-3 px-4 text-right">{results.totals.deals.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(results.totals.revenue)}</td>
                  <td className="py-3 px-4 text-right">{formatPercent(results.totals.totalRoi)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-foreground-muted mb-1">総予算</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(results.totals.budget)}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-foreground-muted mb-1">予想リード数</p>
            <p className="text-2xl font-bold text-primary">{results.totals.leads.toLocaleString()}件</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-foreground-muted mb-1">平均CPA</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(results.totals.avgCpa)}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-5">
            <p className="text-sm text-foreground-muted mb-1">予想売上</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(results.totals.revenue)}</p>
          </div>
        </div>

        {/* Best Channels */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <IconTrendingUp className="w-5 h-5 text-primary" />
            チャネル分析
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.best.byLeads && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium mb-1">リード数 No.1</p>
                <p className="font-bold text-foreground">{results.best.byLeads.name}</p>
                <p className="text-sm text-foreground-muted mt-1">
                  {results.best.byLeads.leads}件 / 月
                </p>
              </div>
            )}
            {results.best.byCpa && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium mb-1">CPA 最安</p>
                <p className="font-bold text-foreground">{results.best.byCpa.name}</p>
                <p className="text-sm text-foreground-muted mt-1">
                  {formatCurrency(results.best.byCpa.cpa)} / 件
                </p>
              </div>
            )}
            {results.best.byRoi && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-600 font-medium mb-1">ROI 最高</p>
                <p className="font-bold text-foreground">{results.best.byRoi.name}</p>
                <p className="text-sm text-foreground-muted mt-1">
                  ROI {formatPercent(results.best.byRoi.roi)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Budget Allocation Chart */}
        <div className="bg-white rounded-xl border border-border p-6 mb-6">
          <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <IconCurrency className="w-5 h-5 text-primary" />
            予算配分比率
          </h2>
          <div className="space-y-3">
            {results.channels.map((channel) => {
              const percentage = results.totals.budget > 0 
                ? (channel.budget / results.totals.budget) * 100 
                : 0;
              return (
                <div key={channel.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground">{channel.name}</span>
                    <span className="text-foreground-muted">
                      {formatCurrency(channel.budget)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-4 bg-background-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
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
              マーケティング予算配分シミュレーターを作ってください。
              リスティング、SNS広告、コンテンツマーケ、ウェビナー等のチャネルごとに
              予算・CPC・CVRを入力できる表形式にし、予想リード数・CPA・売上・ROIを自動計算します。
              チャネルごとにON/OFFを切り替えられるようにし、合計行も表示してください。
              最もリード数が多いチャネル、CPAが安いチャネル、ROIが高いチャネルを分析表示してください。
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

