"use client";

import { useState } from "react";

type FormData = {
  company: string;
  name: string;
  email: string;
  phone: string;
  inquiry: "general" | "demo" | "pricing" | "support";
  message: string;
};

const inquiryTypes = {
  general: "一般的なお問い合わせ",
  demo: "デモ・トライアル",
  pricing: "料金のご相談",
  support: "サポート",
};

export default function ContactFormEmbed() {
  const [formData, setFormData] = useState<FormData>({
    company: "",
    name: "",
    email: "",
    phone: "",
    inquiry: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#2563eb] rounded-full mx-auto mb-5 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">
            送信完了しました
          </h2>
          <p className="text-[#5c5c7a] text-sm mb-5">
            担当者より2営業日以内にご連絡いたします。
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                company: "",
                name: "",
                email: "",
                phone: "",
                inquiry: "general",
                message: "",
              });
            }}
            className="text-[#2563eb] hover:text-[#1d4ed8] font-medium text-sm"
          >
            ← フォームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">お問い合わせ</h1>
          <p className="text-[#5c5c7a] text-sm">ご質問・ご相談はこちらからお気軽にどうぞ</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Inquiry Type */}
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(inquiryTypes) as [FormData["inquiry"], string][]).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormData({ ...formData, inquiry: key })}
                className={`p-3 rounded-lg text-xs font-medium transition-all ${
                  formData.inquiry === key
                    ? "bg-[#2563eb] text-white"
                    : "bg-white text-[#5c5c7a] shadow-sm hover:bg-[#f5f7fa]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Company */}
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none shadow-sm focus:ring-1 focus:ring-[#2563eb] text-sm"
            placeholder="会社名 *"
          />

          {/* Name */}
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none shadow-sm focus:ring-1 focus:ring-[#2563eb] text-sm"
            placeholder="お名前 *"
          />

          {/* Email */}
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none shadow-sm focus:ring-1 focus:ring-[#2563eb] text-sm"
            placeholder="メールアドレス *"
          />

          {/* Phone */}
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none shadow-sm focus:ring-1 focus:ring-[#2563eb] text-sm"
            placeholder="電話番号（任意）"
          />

          {/* Message */}
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white text-[#1a1a2e] placeholder:text-[#9ca3af] outline-none shadow-sm focus:ring-1 focus:ring-[#2563eb] resize-none text-sm"
            placeholder="お問い合わせ内容 *"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-[#9ca3af] text-white font-medium py-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                送信中...
              </>
            ) : (
              "送信する"
            )}
          </button>

          <p className="text-center text-xs text-[#9ca3af]">
            送信いただいた情報はお問い合わせへの対応以外には使用しません。
          </p>
        </form>
      </div>
    </div>
  );
}
