"use client";

import { useState } from "react";

type Requirement = {
  id: string;
  label: string;
};

type Service = {
  id: string;
  name: string;
  tagline: string;
  features: string[];
  scores: Record<string, number>;
};

const requirements: Requirement[] = [
  { id: "budget", label: "予算の柔軟性" },
  { id: "speed", label: "スピード重視" },
  { id: "quality", label: "品質重視" },
  { id: "support", label: "サポートの手厚さ" },
  { id: "scalability", label: "拡張性" },
  { id: "customization", label: "カスタマイズ性" },
];

const services: Service[] = [
  {
    id: "basic",
    name: "ベーシックプラン",
    tagline: "まずは始めたい方に",
    features: ["基本機能", "メールサポート", "月1回レポート"],
    scores: { budget: 5, speed: 4, quality: 3, support: 2, scalability: 2, customization: 2 },
  },
  {
    id: "standard",
    name: "スタンダードプラン",
    tagline: "バランス重視の方に",
    features: ["全機能", "チャットサポート", "週次レポート", "担当者付き"],
    scores: { budget: 3, speed: 4, quality: 4, support: 4, scalability: 4, customization: 3 },
  },
  {
    id: "premium",
    name: "プレミアムプラン",
    tagline: "本格的に取り組む方に",
    features: ["全機能+α", "優先サポート", "日次レポート", "専任担当", "カスタム開発"],
    scores: { budget: 1, speed: 3, quality: 5, support: 5, scalability: 5, customization: 5 },
  },
  {
    id: "enterprise",
    name: "エンタープライズ",
    tagline: "大規模導入に",
    features: ["無制限", "24/7サポート", "専任チーム", "オンプレ対応", "SLA保証"],
    scores: { budget: 1, speed: 2, quality: 5, support: 5, scalability: 5, customization: 5 },
  },
];

export default function ServiceFitEmbed() {
  const [priorities, setPriorities] = useState<Record<string, number>>(
    Object.fromEntries(requirements.map((r) => [r.id, 3]))
  );
  const [showResult, setShowResult] = useState(false);

  const calculateFit = () => {
    return services.map((service) => {
      let score = 0;
      let maxScore = 0;

      Object.entries(priorities).forEach(([reqId, priority]) => {
        const serviceScore = service.scores[reqId] || 0;
        score += serviceScore * priority;
        maxScore += 5 * priority;
      });

      const fitPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

      return {
        ...service,
        fitScore: score,
        fitPercentage,
      };
    }).sort((a, b) => b.fitScore - a.fitScore);
  };

  const results = showResult ? calculateFit() : [];
  const topResult = results[0];

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">サービス適合度チェッカー</h1>
          <p className="text-[#5c5c7a] text-sm">あなたに最適なプランを診断</p>
        </div>

        {!showResult ? (
          <div className="space-y-5">
            {/* Priority Selection */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="font-semibold text-[#1a1a2e] mb-2 text-sm">重視するポイントを選択</h2>
              <p className="text-xs text-[#5c5c7a] mb-5">各項目の重要度を5段階で評価してください</p>

              <div className="space-y-5">
                {requirements.map((req) => (
                  <div key={req.id}>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm text-[#1a1a2e]">{req.label}</label>
                      <span className="text-xs text-[#5c5c7a]">
                        {["不要", "低", "中", "高", "最重要"][priorities[req.id] - 1]}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setPriorities((prev) => ({ ...prev, [req.id]: value }))}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                            priorities[req.id] === value
                              ? "bg-[#2563eb] text-white"
                              : "bg-[#f5f7fa] text-[#5c5c7a] hover:bg-[#e8ecf3]"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Check Button */}
            <button
              onClick={() => setShowResult(true)}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-3 rounded-lg transition-all text-sm"
            >
              適合度をチェック
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Top Result */}
            {topResult && (
              <div className="bg-[#2563eb] rounded-lg p-6 text-white relative">
                <div className="absolute top-4 right-4 px-2 py-1 bg-white/20 rounded text-xs">
                  最適プラン
                </div>
                <div className="mb-4">
                  <div className="text-xs opacity-80 mb-1">{topResult.tagline}</div>
                  <h2 className="text-xl font-bold">{topResult.name}</h2>
                </div>
                <div className="text-4xl font-bold mb-1">{topResult.fitPercentage}%</div>
                <div className="text-sm opacity-80 mb-4">適合度</div>
                <div className="flex flex-wrap gap-2">
                  {topResult.features.map((feature, i) => (
                    <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Other Results */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-semibold text-[#1a1a2e] mb-4 text-sm">全プラン比較</h3>
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div key={result.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#5c5c7a]">{index + 1}</span>
                        <span className={`text-sm font-medium ${index === 0 ? "text-[#2563eb]" : "text-[#1a1a2e]"}`}>
                          {result.name}
                        </span>
                      </div>
                      <span className={`text-lg font-bold ${index === 0 ? "text-[#2563eb]" : "text-[#5c5c7a]"}`}>
                        {result.fitPercentage}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#e8ecf3] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${index === 0 ? "bg-[#2563eb]" : "bg-[#c4c4d4]"}`}
                        style={{ width: `${result.fitPercentage}%` }}
                      />
                    </div>
                  </div>
                ))}
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
                詳しく相談する
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
