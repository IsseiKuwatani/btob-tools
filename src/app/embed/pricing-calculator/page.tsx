"use client";

import { useState, useMemo } from "react";

type Plan = "starter" | "pro" | "enterprise";

const plans: Record<Plan, { name: string; basePrice: number; perUser: number; features: string[] }> = {
  starter: {
    name: "スターター",
    basePrice: 9800,
    perUser: 500,
    features: ["基本機能", "メールサポート", "月5GBストレージ"],
  },
  pro: {
    name: "プロ",
    basePrice: 29800,
    perUser: 800,
    features: ["全機能", "優先サポート", "月50GBストレージ", "API連携"],
  },
  enterprise: {
    name: "エンタープライズ",
    basePrice: 98000,
    perUser: 1200,
    features: ["全機能+カスタマイズ", "専任サポート", "無制限ストレージ", "SSO/SAML", "SLA保証"],
  },
};

export default function PricingCalculatorEmbed() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("pro");
  const [userCount, setUserCount] = useState(10);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const price = useMemo(() => {
    const plan = plans[selectedPlan];
    const baseMonthly = plan.basePrice + plan.perUser * userCount;
    if (billingCycle === "yearly") {
      return {
        monthly: Math.round(baseMonthly * 0.8),
        yearly: Math.round(baseMonthly * 0.8 * 12),
        savings: Math.round(baseMonthly * 12 * 0.2),
      };
    }
    return {
      monthly: baseMonthly,
      yearly: baseMonthly * 12,
      savings: 0,
    };
  }, [selectedPlan, userCount, billingCycle]);

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">料金シミュレーター</h1>
          <p className="text-[#5c5c7a] text-sm">プランと利用人数を選んで料金を確認</p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#2563eb] text-white"
                  : "text-[#5c5c7a] hover:text-[#1a1a2e]"
              }`}
            >
              月払い
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-[#2563eb] text-white"
                  : "text-[#5c5c7a] hover:text-[#1a1a2e]"
              }`}
            >
              年払い
              <span className={`text-xs px-2 py-0.5 rounded ${billingCycle === "yearly" ? "bg-white/20" : "bg-[#eff6ff] text-[#2563eb]"}`}>
                20%OFF
              </span>
            </button>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {(Object.entries(plans) as [Plan, typeof plans[Plan]][]).map(([key, plan]) => (
            <button
              key={key}
              onClick={() => setSelectedPlan(key)}
              className={`relative p-4 rounded-lg transition-all ${
                selectedPlan === key
                  ? "bg-[#eff6ff] ring-1 ring-[#2563eb]"
                  : "bg-white shadow-sm hover:bg-[#f5f7fa]"
              }`}
            >
              {key === "pro" && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <span className="bg-[#2563eb] text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    人気
                  </span>
                </div>
              )}
              <div className="text-xs text-[#5c5c7a] mb-1">{plan.name}</div>
              <div className={`text-lg font-bold ${selectedPlan === key ? "text-[#2563eb]" : "text-[#1a1a2e]"}`}>
                ¥{plan.basePrice.toLocaleString()}
              </div>
              <div className="text-[10px] text-[#9ca3af]">基本料金/月</div>
            </button>
          ))}
        </div>

        {/* User Count Slider */}
        <div className="bg-white rounded-lg p-5 shadow-sm mb-5">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-[#1a1a2e]">利用人数</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserCount(Math.max(1, userCount - 1))}
                className="w-8 h-8 rounded-lg bg-[#f5f7fa] text-[#5c5c7a] font-bold hover:bg-[#e8ecf3] transition-colors"
              >
                −
              </button>
              <span className="w-16 text-center font-bold text-lg text-[#2563eb]">{userCount}人</span>
              <button
                onClick={() => setUserCount(Math.min(100, userCount + 1))}
                className="w-8 h-8 rounded-lg bg-[#f5f7fa] text-[#5c5c7a] font-bold hover:bg-[#e8ecf3] transition-colors"
              >
                +
              </button>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={userCount}
            onChange={(e) => setUserCount(Number(e.target.value))}
            className="w-full h-2 bg-[#e8ecf3] rounded-full appearance-none cursor-pointer accent-[#2563eb]"
          />
          <div className="flex justify-between text-xs text-[#9ca3af] mt-1">
            <span>1人</span>
            <span>100人</span>
          </div>
        </div>

        {/* Result */}
        <div className="bg-[#2563eb] rounded-lg p-6 text-white mb-5">
          <div className="text-center">
            <div className="text-sm opacity-80 mb-1">
              {plans[selectedPlan].name}プラン・{userCount}人の場合
            </div>
            <div className="text-4xl font-bold mb-1">
              ¥{price.monthly.toLocaleString()}
              <span className="text-lg font-normal opacity-80">/月</span>
            </div>
            {billingCycle === "yearly" && (
              <div className="text-sm opacity-80">
                年額 ¥{price.yearly.toLocaleString()}（¥{price.savings.toLocaleString()}お得！）
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg p-5 shadow-sm mb-5">
          <div className="text-sm font-semibold text-[#1a1a2e] mb-3">
            {plans[selectedPlan].name}プランに含まれる機能
          </div>
          <ul className="space-y-2">
            {plans[selectedPlan].features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-[#5c5c7a]">
                <svg className="w-4 h-4 text-[#2563eb] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-3 rounded-lg transition-colors text-sm">
          無料トライアルを始める
        </button>
      </div>
    </div>
  );
}
