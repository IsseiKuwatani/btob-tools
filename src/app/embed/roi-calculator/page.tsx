"use client";

import { useState, useMemo } from "react";

export default function ROICalculatorEmbed() {
  const [investment, setInvestment] = useState(100);
  const [monthlySavings, setMonthlySavings] = useState(50);
  const [timeSavingsHours, setTimeSavingsHours] = useState(40);
  const [hourlyRate, setHourlyRate] = useState(3000);
  const [showResult, setShowResult] = useState(false);

  const results = useMemo(() => {
    const timeSavingsValue = timeSavingsHours * hourlyRate;
    const totalMonthlySavings = monthlySavings * 10000 + timeSavingsValue;
    const investmentYen = investment * 10000;
    const yearlyBenefit = totalMonthlySavings * 12;
    const roi = Math.round(((yearlyBenefit - investmentYen) / investmentYen) * 100);
    const paybackMonths = investmentYen / totalMonthlySavings;

    return {
      totalMonthlySavings,
      yearlyBenefit,
      roi,
      paybackMonths: Math.round(paybackMonths * 10) / 10,
      timeSavingsValue,
    };
  }, [investment, monthlySavings, timeSavingsHours, hourlyRate]);

  const formatYen = (value: number) => `¥${value.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">ROI計算機</h1>
          <p className="text-[#5c5c7a] text-sm">投資対効果を可視化</p>
        </div>

        <div className="space-y-5">
          {/* Input Section */}
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h2 className="font-semibold text-[#1a1a2e] mb-5 text-sm">入力項目</h2>

            <div className="space-y-5">
              {/* Investment */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-[#1a1a2e]">初期投資額</label>
                  <span className="text-sm font-semibold text-[#2563eb]">{investment}万円</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-[#e8ecf3] rounded-full appearance-none cursor-pointer accent-[#2563eb]"
                />
                <div className="flex justify-between text-xs text-[#9ca3af] mt-1">
                  <span>10万円</span>
                  <span>1,000万円</span>
                </div>
              </div>

              {/* Monthly Savings */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-[#1a1a2e]">月間コスト削減額</label>
                  <span className="text-sm font-semibold text-[#2563eb]">{monthlySavings}万円</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={500}
                  step={1}
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(Number(e.target.value))}
                  className="w-full h-2 bg-[#e8ecf3] rounded-full appearance-none cursor-pointer accent-[#2563eb]"
                />
                <div className="flex justify-between text-xs text-[#9ca3af] mt-1">
                  <span>1万円</span>
                  <span>500万円</span>
                </div>
              </div>

              {/* Time Savings */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-[#1a1a2e]">月間時間削減</label>
                  <span className="text-sm font-semibold text-[#2563eb]">{timeSavingsHours}時間</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={500}
                  step={10}
                  value={timeSavingsHours}
                  onChange={(e) => setTimeSavingsHours(Number(e.target.value))}
                  className="w-full h-2 bg-[#e8ecf3] rounded-full appearance-none cursor-pointer accent-[#2563eb]"
                />
                <div className="flex justify-between text-xs text-[#9ca3af] mt-1">
                  <span>0時間</span>
                  <span>500時間</span>
                </div>
              </div>

              {/* Hourly Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm text-[#1a1a2e]">人件費単価（時給）</label>
                  <span className="text-sm font-semibold text-[#2563eb]">{formatYen(hourlyRate)}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={10000}
                  step={500}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-[#e8ecf3] rounded-full appearance-none cursor-pointer accent-[#2563eb]"
                />
                <div className="flex justify-between text-xs text-[#9ca3af] mt-1">
                  <span>¥1,000</span>
                  <span>¥10,000</span>
                </div>
              </div>

              <button
                onClick={() => setShowResult(true)}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-3 rounded-lg transition-all text-sm"
              >
                ROIを計算する
              </button>
            </div>
          </div>

          {/* Result Section */}
          {showResult && (
            <div className="space-y-4">
              {/* ROI Card */}
              <div className="bg-[#2563eb] rounded-lg p-6 text-white text-center">
                <div className="text-sm opacity-80 mb-1">投資対効果（ROI）</div>
                <div className="text-4xl font-bold mb-2">
                  {results.roi > 0 ? "+" : ""}{results.roi}%
                </div>
                <div className={`inline-block px-3 py-1 rounded text-xs ${
                  results.roi >= 100 ? "bg-white/20" : results.roi >= 0 ? "bg-white/10" : "bg-red-400/30"
                }`}>
                  {results.roi >= 100 ? "素晴らしいROI" : results.roi >= 0 ? "プラスリターン" : "マイナスリターン"}
                </div>
              </div>

              {/* Detail Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-[#5c5c7a] mb-1">月間効果</div>
                  <div className="text-lg font-bold text-[#1a1a2e]">{formatYen(results.totalMonthlySavings)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-xs text-[#5c5c7a] mb-1">年間効果</div>
                  <div className="text-lg font-bold text-[#1a1a2e]">{formatYen(results.yearlyBenefit)}</div>
                </div>
              </div>

              {/* Payback Period */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-[#1a1a2e]">投資回収期間</span>
                  <span className="text-lg font-bold text-[#2563eb]">{results.paybackMonths}ヶ月</span>
                </div>
                <div className="h-1.5 bg-[#e8ecf3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563eb] rounded-full"
                    style={{ width: `${Math.min((12 / Math.max(results.paybackMonths, 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-[#1a1a2e] mb-3">内訳</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c5c7a]">コスト削減効果</span>
                    <span className="text-[#1a1a2e]">{formatYen(monthlySavings * 10000)}/月</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#5c5c7a]">時間削減効果</span>
                    <span className="text-[#1a1a2e]">{formatYen(results.timeSavingsValue)}/月</span>
                  </div>
                  <div className="border-t border-[#f0f0f5] pt-2 flex justify-between text-sm">
                    <span className="font-medium text-[#1a1a2e]">合計</span>
                    <span className="font-semibold text-[#2563eb]">{formatYen(results.totalMonthlySavings)}/月</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-3 rounded-lg transition-all text-sm">
                詳しい試算を相談する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
