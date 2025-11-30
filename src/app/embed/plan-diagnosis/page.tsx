"use client";

import { useState } from "react";

type Question = {
  id: string;
  question: string;
  options: { value: string; label: string; points: { starter: number; pro: number; enterprise: number } }[];
};

const questions: Question[] = [
  {
    id: "team-size",
    question: "チームの規模は？",
    options: [
      { value: "small", label: "〜10名", points: { starter: 3, pro: 1, enterprise: 0 } },
      { value: "medium", label: "11〜50名", points: { starter: 1, pro: 3, enterprise: 1 } },
      { value: "large", label: "51名以上", points: { starter: 0, pro: 1, enterprise: 3 } },
    ],
  },
  {
    id: "priority",
    question: "最も重視することは？",
    options: [
      { value: "cost", label: "コストを抑えたい", points: { starter: 3, pro: 1, enterprise: 0 } },
      { value: "feature", label: "機能が充実していてほしい", points: { starter: 0, pro: 3, enterprise: 2 } },
      { value: "support", label: "手厚いサポートがほしい", points: { starter: 0, pro: 1, enterprise: 3 } },
    ],
  },
  {
    id: "integration",
    question: "外部ツールとの連携は必要？",
    options: [
      { value: "no", label: "不要", points: { starter: 3, pro: 1, enterprise: 0 } },
      { value: "some", label: "いくつか使いたい", points: { starter: 1, pro: 3, enterprise: 1 } },
      { value: "many", label: "たくさん連携したい", points: { starter: 0, pro: 2, enterprise: 3 } },
    ],
  },
];

type Plan = "starter" | "pro" | "enterprise";

const planDetails: Record<Plan, { name: string; price: string; tagline: string; features: string[] }> = {
  starter: {
    name: "スタータープラン",
    price: "¥9,800",
    tagline: "小規模チームに最適",
    features: ["基本機能すべて利用可能", "メールサポート", "月5GBストレージ", "最大10ユーザー"],
  },
  pro: {
    name: "プロプラン",
    price: "¥29,800",
    tagline: "成長中のチームに最適",
    features: ["全機能利用可能", "優先サポート", "月50GBストレージ", "API連携", "カスタムレポート"],
  },
  enterprise: {
    name: "エンタープライズプラン",
    price: "お問い合わせ",
    tagline: "大規模組織に最適",
    features: ["全機能+カスタマイズ", "専任カスタマーサクセス", "無制限ストレージ", "SSO/SAML対応", "SLA保証", "オンプレミス対応"],
  },
};

export default function PlanDiagnosisEmbed() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Plan | null>(null);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      const scores = { starter: 0, pro: 0, enterprise: 0 };
      questions.forEach((q) => {
        const answer = newAnswers[q.id];
        const option = q.options.find((o) => o.value === answer);
        if (option) {
          scores.starter += option.points.starter;
          scores.pro += option.points.pro;
          scores.enterprise += option.points.enterprise;
        }
      });

      const recommendedPlan = (Object.entries(scores) as [Plan, number][]).reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0];

      setTimeout(() => setResult(recommendedPlan), 300);
    }
  };

  const resetDiagnosis = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  // Result Screen
  if (result) {
    const plan = planDetails[result];
    return (
      <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <h2 className="text-lg text-[#5c5c7a] mb-2">あなたにおすすめのプラン</h2>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-[#2563eb] p-6 text-white text-center">
              <div className="text-xs opacity-80 mb-1">RECOMMENDED</div>
              <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm opacity-80 mb-3">{plan.tagline}</p>
              <div className="text-3xl font-bold">
                {plan.price}
                {result !== "enterprise" && <span className="text-sm font-normal opacity-80">/月〜</span>}
              </div>
            </div>

            <div className="p-5">
              <ul className="space-y-3 mb-5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#1a1a2e]">
                    <div className="w-5 h-5 rounded-full bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#2563eb]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium py-3 rounded-lg transition-colors text-sm">
                このプランで始める
              </button>
            </div>
          </div>

          <button
            onClick={resetDiagnosis}
            className="w-full mt-4 text-[#5c5c7a] hover:text-[#1a1a2e] text-sm py-2 transition-colors"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    );
  }

  // Question Screen
  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-[#5c5c7a] mb-2">
            <span>質問 {currentStep + 1} / {questions.length}</span>
            <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-1 bg-[#e8ecf3] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2563eb] transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-[#1a1a2e] mb-2">
            {currentQuestion.question}
          </h2>
          <p className="text-sm text-[#5c5c7a]">
            最も当てはまるものを選んでください
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(currentQuestion.id, option.value)}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                answers[currentQuestion.id] === option.value
                  ? "bg-[#eff6ff] ring-1 ring-[#2563eb]"
                  : "bg-white hover:bg-[#f5f7fa] shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
                  answers[currentQuestion.id] === option.value
                    ? "bg-[#2563eb] text-white"
                    : "bg-[#f5f7fa] text-[#5c5c7a]"
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span className={`font-medium ${answers[currentQuestion.id] === option.value ? "text-[#2563eb]" : "text-[#1a1a2e]"}`}>
                  {option.label}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Back Button */}
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="mt-5 text-[#5c5c7a] hover:text-[#1a1a2e] text-sm flex items-center gap-2 mx-auto transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            前の質問に戻る
          </button>
        )}
      </div>
    </div>
  );
}
