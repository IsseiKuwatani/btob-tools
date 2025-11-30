"use client";

import { useState, useMemo } from "react";

type ServiceOption = {
  id: string;
  name: string;
  basePrice: number;
  unit: string;
};

type SelectedService = {
  id: string;
  quantity: number;
};

const services: ServiceOption[] = [
  { id: "web", name: "Webサイト制作", basePrice: 500000, unit: "サイト" },
  { id: "lp", name: "LP制作", basePrice: 200000, unit: "ページ" },
  { id: "seo", name: "SEO対策", basePrice: 100000, unit: "月" },
  { id: "ads", name: "広告運用", basePrice: 150000, unit: "月" },
  { id: "content", name: "コンテンツ制作", basePrice: 50000, unit: "本" },
  { id: "ma", name: "MA導入支援", basePrice: 300000, unit: "件" },
  { id: "consulting", name: "コンサルティング", basePrice: 200000, unit: "月" },
  { id: "design", name: "デザイン制作", basePrice: 80000, unit: "点" },
];

export default function QuoteGeneratorEmbed() {
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [companySize, setCompanySize] = useState<"startup" | "smb" | "enterprise">("smb");
  const [urgency, setUrgency] = useState<"normal" | "urgent">("normal");
  const [showQuote, setShowQuote] = useState(false);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const exists = prev.find((s) => s.id === id);
      if (exists) {
        return prev.filter((s) => s.id !== id);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setSelectedServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, quantity: Math.max(1, quantity) } : s))
    );
  };

  const discountRate = useMemo(() => {
    if (companySize === "startup") return 0.15;
    if (companySize === "enterprise") return 0.1;
    return 0;
  }, [companySize]);

  const urgencyRate = urgency === "urgent" ? 1.2 : 1;

  const quote = useMemo(() => {
    const items = selectedServices.map((selected) => {
      const service = services.find((s) => s.id === selected.id)!;
      const subtotal = service.basePrice * selected.quantity;
      return {
        ...service,
        quantity: selected.quantity,
        subtotal,
      };
    });

    const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);
    const discountAmount = subtotal * discountRate;
    const afterDiscount = subtotal - discountAmount;
    const urgencyAmount = afterDiscount * (urgencyRate - 1);
    const total = afterDiscount + urgencyAmount;

    return {
      items,
      subtotal,
      discountRate,
      discountAmount,
      urgencyRate,
      urgencyAmount,
      total,
    };
  }, [selectedServices, discountRate, urgencyRate]);

  const formatYen = (value: number) => `¥${value.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">見積もりジェネレーター</h1>
          <p className="text-[#5c5c7a] text-sm">必要なサービスを選んで概算見積もりを作成</p>
        </div>

        {!showQuote ? (
          <div className="space-y-5">
            {/* Company Size */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="font-semibold text-[#1a1a2e] mb-4 text-sm">企業規模</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "startup", label: "スタートアップ", discount: "15%OFF" },
                  { value: "smb", label: "中小企業", discount: "" },
                  { value: "enterprise", label: "大企業", discount: "10%OFF" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCompanySize(option.value as typeof companySize)}
                    className={`p-3 rounded-lg text-sm transition-all ${
                      companySize === option.value
                        ? "bg-[#2563eb] text-white"
                        : "bg-[#f5f7fa] text-[#1a1a2e] hover:bg-[#e8ecf3]"
                    }`}
                  >
                    <div className="font-medium text-xs">{option.label}</div>
                    {option.discount && <div className="text-xs mt-0.5 opacity-80">{option.discount}</div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="font-semibold text-[#1a1a2e] mb-4 text-sm">サービスを選択</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map((service) => {
                  const selected = selectedServices.find((s) => s.id === service.id);
                  return (
                    <div
                      key={service.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selected ? "bg-[#eff6ff] ring-1 ring-[#2563eb]" : "bg-[#f5f7fa] hover:bg-[#e8ecf3]"
                      }`}
                      onClick={() => toggleService(service.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selected ? "bg-[#2563eb] border-[#2563eb]" : "border-[#c4c4d4]"
                          }`}>
                            {selected && (
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className={`text-sm ${selected ? "text-[#2563eb] font-medium" : "text-[#1a1a2e]"}`}>
                            {service.name}
                          </span>
                        </div>
                        <span className="text-xs text-[#5c5c7a]">{formatYen(service.basePrice)}/{service.unit}</span>
                      </div>
                      {selected && (
                        <div className="mt-2 flex items-center gap-2 pl-6" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-[#5c5c7a]">数量:</span>
                          <button
                            onClick={() => updateQuantity(service.id, selected.quantity - 1)}
                            className="w-6 h-6 rounded bg-white text-[#1a1a2e] text-sm shadow-sm hover:bg-[#f5f7fa]"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-medium text-[#1a1a2e]">{selected.quantity}</span>
                          <button
                            onClick={() => updateQuantity(service.id, selected.quantity + 1)}
                            className="w-6 h-6 rounded bg-white text-[#1a1a2e] text-sm shadow-sm hover:bg-[#f5f7fa]"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Urgency */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h2 className="font-semibold text-[#1a1a2e] mb-4 text-sm">納期</h2>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setUrgency("normal")}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    urgency === "normal"
                      ? "bg-[#2563eb] text-white"
                      : "bg-[#f5f7fa] text-[#1a1a2e] hover:bg-[#e8ecf3]"
                  }`}
                >
                  <div className="font-medium text-xs">通常納期</div>
                </button>
                <button
                  onClick={() => setUrgency("urgent")}
                  className={`p-3 rounded-lg text-sm transition-all ${
                    urgency === "urgent"
                      ? "bg-[#2563eb] text-white"
                      : "bg-[#f5f7fa] text-[#1a1a2e] hover:bg-[#e8ecf3]"
                  }`}
                >
                  <div className="font-medium text-xs">特急対応 (+20%)</div>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => setShowQuote(true)}
              disabled={selectedServices.length === 0}
              className={`w-full font-medium py-3 rounded-lg transition-all text-sm ${
                selectedServices.length > 0
                  ? "bg-[#2563eb] hover:bg-[#1d4ed8] text-white"
                  : "bg-[#e8ecf3] text-[#9ca3af] cursor-not-allowed"
              }`}
            >
              見積もりを作成
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Quote Header */}
            <div className="bg-[#2563eb] rounded-lg p-6 text-center text-white">
              <div className="text-sm opacity-80 mb-1">概算見積もり金額</div>
              <div className="text-3xl font-bold">{formatYen(quote.total)}</div>
              <div className="text-sm opacity-80 mt-1">{formatYen(Math.round(quote.total * 1.1))} (税込)</div>
              {quote.discountRate > 0 && (
                <div className="inline-block mt-3 px-3 py-1 bg-white/20 rounded text-xs">
                  {Math.round(quote.discountRate * 100)}% 割引適用
                </div>
              )}
            </div>

            {/* Quote Items */}
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-semibold text-[#1a1a2e] mb-4 text-sm">明細</h3>
              <div className="space-y-3">
                {quote.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-[#f0f0f5] last:border-0">
                    <div>
                      <div className="text-sm font-medium text-[#1a1a2e]">{item.name}</div>
                      <div className="text-xs text-[#5c5c7a]">{formatYen(item.basePrice)} × {item.quantity}</div>
                    </div>
                    <div className="text-sm font-medium text-[#1a1a2e]">{formatYen(item.subtotal)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#f0f0f5] space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5c5c7a]">小計</span>
                  <span className="text-[#1a1a2e]">{formatYen(quote.subtotal)}</span>
                </div>
                {quote.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-[#2563eb]">
                    <span>割引（{Math.round(quote.discountRate * 100)}%OFF）</span>
                    <span>-{formatYen(quote.discountAmount)}</span>
                  </div>
                )}
                {quote.urgencyAmount > 0 && (
                  <div className="flex justify-between text-sm text-[#f59e0b]">
                    <span>特急料金（+20%）</span>
                    <span>+{formatYen(quote.urgencyAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#f0f0f5]">
                  <span className="text-[#1a1a2e]">合計</span>
                  <span className="text-[#2563eb]">{formatYen(quote.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowQuote(false)}
                className="py-3 rounded-lg bg-white text-[#1a1a2e] font-medium text-sm shadow-sm hover:bg-[#f5f7fa] transition-all"
              >
                戻る
              </button>
              <button className="py-3 rounded-lg bg-[#2563eb] text-white font-medium text-sm hover:bg-[#1d4ed8] transition-all">
                正式見積もりを依頼
              </button>
            </div>

            <p className="text-center text-xs text-[#9ca3af]">
              ※ この見積もりは概算です
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
