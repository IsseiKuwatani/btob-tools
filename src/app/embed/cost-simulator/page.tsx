"use client";

import { useState, useMemo } from "react";

type CostItem = {
  id: string;
  name: string;
  currentCost: number;
  savingsRate: number;
};

const defaultCosts: CostItem[] = [
  { id: "labor", name: "人件費（業務時間）", currentCost: 500000, savingsRate: 0.3 },
  { id: "advertising", name: "広告費", currentCost: 300000, savingsRate: 0.25 },
  { id: "tools", name: "ツール・システム費", currentCost: 100000, savingsRate: 0.15 },
  { id: "outsource", name: "外注費", currentCost: 200000, savingsRate: 0.35 },
  { id: "printing", name: "印刷・資料費", currentCost: 50000, savingsRate: 0.5 },
  { id: "travel", name: "交通費・出張費", currentCost: 80000, savingsRate: 0.4 },
];

export default function CostSimulatorEmbed() {
  const [costs, setCosts] = useState<CostItem[]>(defaultCosts);
  const [showResult, setShowResult] = useState(false);

  const updateCost = (id: string, value: number) => {
    setCosts((prev) => prev.map((c) => (c.id === id ? { ...c, currentCost: value } : c)));
  };

  const updateSavingsRate = (id: string, value: number) => {
    setCosts((prev) => prev.map((c) => (c.id === id ? { ...c, savingsRate: value / 100 } : c)));
  };

  const results = useMemo(() => {
    const items = costs.map((cost) => ({
      ...cost,
      savings: Math.round(cost.currentCost * cost.savingsRate),
    }));

    const totalCurrent = items.reduce((acc, c) => acc + c.currentCost, 0);
    const totalSavings = items.reduce((acc, c) => acc + c.savings, 0);
    const yearlySavings = totalSavings * 12;
    const overallSavingsRate = totalCurrent > 0 ? (totalSavings / totalCurrent) * 100 : 0;

    return {
      items,
      totalCurrent,
      totalSavings,
      yearlySavings,
      overallSavingsRate,
    };
  }, [costs]);

  const formatYen = (value: number) => `¥${value.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">コスト削減シミュレーター</h1>
          <p className="text-[#5c5c7a] text-sm">現在のコストから削減可能額を算出</p>
        </div>

        {!showResult ? (
          <div className="space-y-4">
            {/* Cost Items */}
            {costs.map((cost) => (
              <div key={cost.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-[#1a1a2e] text-sm">{cost.name}</h3>
                  <span className="text-sm text-[#2563eb] font-medium">
                    -{formatYen(Math.round(cost.currentCost * cost.savingsRate))}/月
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#5c5c7a] mb-1 block">月額コスト</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c5c7a] text-sm">¥</span>
                      <input
                        type="number"
                        value={cost.currentCost}
                        onChange={(e) => updateCost(cost.id, Number(e.target.value))}
                        className="w-full pl-7 pr-3 py-2 rounded-lg bg-[#f5f7fa] border-none outline-none text-sm text-[#1a1a2e] focus:ring-1 focus:ring-[#2563eb]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#5c5c7a] mb-1 block">
                      削減率: {Math.round(cost.savingsRate * 100)}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={80}
                      step={5}
                      value={cost.savingsRate * 100}
                      onChange={(e) => updateSavingsRate(cost.id, Number(e.target.value))}
                      className="w-full h-2 bg-[#e8ecf3] rounded-full appearance-none cursor-pointer accent-[#2563eb] mt-2"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Calculate Button */}
            <button
              onClick={() => setShowResult(true)}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-3 rounded-lg transition-all text-sm"
            >
              削減効果を計算
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Main Result */}
            <div className="bg-[#2563eb] rounded-lg p-6 text-white">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-sm opacity-80 mb-1">月間削減額</div>
                  <div className="text-2xl font-bold">{formatYen(results.totalSavings)}</div>
                </div>
                <div>
                  <div className="text-sm opacity-80 mb-1">年間削減額</div>
                  <div className="text-2xl font-bold">{formatYen(results.yearlySavings)}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20 text-center">
                <span className="text-sm opacity-80">削減率: </span>
                <span className="text-lg font-bold">{Math.round(results.overallSavingsRate)}%</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-semibold text-[#1a1a2e] mb-4 text-sm">項目別削減額</h3>
              <div className="space-y-4">
                {results.items.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-[#1a1a2e]">{item.name}</span>
                      <span className="text-sm font-medium text-[#2563eb]">{formatYen(item.savings)}/月</span>
                    </div>
                    <div className="h-1.5 bg-[#e8ecf3] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563eb] rounded-full"
                        style={{ width: `${item.savingsRate * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-xs text-[#5c5c7a] mb-1">3年間の削減</div>
                <div className="text-sm font-bold text-[#1a1a2e]">{formatYen(results.yearlySavings * 3)}</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-xs text-[#5c5c7a] mb-1">削減前</div>
                <div className="text-sm font-bold text-[#1a1a2e]">{formatYen(results.totalCurrent)}/月</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-xs text-[#5c5c7a] mb-1">削減後</div>
                <div className="text-sm font-bold text-[#2563eb]">{formatYen(results.totalCurrent - results.totalSavings)}/月</div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowResult(false)}
                className="py-3 rounded-lg bg-white text-[#1a1a2e] font-medium text-sm shadow-sm hover:bg-[#f5f7fa] transition-all"
              >
                条件を変更
              </button>
              <button className="py-3 rounded-lg bg-[#2563eb] text-white font-medium text-sm hover:bg-[#1d4ed8] transition-all">
                詳細プランを相談
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
