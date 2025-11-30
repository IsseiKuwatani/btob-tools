"use client";

import { useState } from "react";

type Question = {
  id: string;
  question: string;
  options: { value: string; label: string; score: number }[];
};

type DiagnosisResult = {
  type: string;
  title: string;
  description: string;
  recommendations: string[];
};

const questions: Question[] = [
  {
    id: "q1",
    question: "現在、最も課題を感じている領域は？",
    options: [
      { value: "lead", label: "リード獲得が少ない", score: 10 },
      { value: "conversion", label: "問い合わせ率が低い", score: 10 },
      { value: "nurturing", label: "商談化までに時間がかかる", score: 10 },
      { value: "retention", label: "既存顧客のリピートが少ない", score: 10 },
    ],
  },
  {
    id: "q2",
    question: "マーケティング施策の実施状況は？",
    options: [
      { value: "nothing", label: "ほとんど実施していない", score: 5 },
      { value: "basic", label: "基本的なSEO・広告のみ", score: 10 },
      { value: "multiple", label: "複数チャネルで実施", score: 15 },
      { value: "integrated", label: "統合的に運用している", score: 20 },
    ],
  },
  {
    id: "q3",
    question: "データ活用の現状は？",
    options: [
      { value: "none", label: "データをほとんど見ていない", score: 5 },
      { value: "basic", label: "Analyticsは見ているが活用できていない", score: 10 },
      { value: "active", label: "定期的にデータ分析している", score: 15 },
      { value: "advanced", label: "データドリブンで意思決定している", score: 20 },
    ],
  },
  {
    id: "q4",
    question: "コンテンツ制作の頻度は？",
    options: [
      { value: "rarely", label: "年に数回程度", score: 5 },
      { value: "monthly", label: "月1-2回程度", score: 10 },
      { value: "weekly", label: "週1回以上", score: 15 },
      { value: "daily", label: "ほぼ毎日", score: 20 },
    ],
  },
  {
    id: "q5",
    question: "営業とマーケティングの連携は？",
    options: [
      { value: "separate", label: "ほとんど連携していない", score: 5 },
      { value: "occasional", label: "たまに情報共有する程度", score: 10 },
      { value: "regular", label: "定期的にミーティングしている", score: 15 },
      { value: "integrated", label: "完全に連携している", score: 20 },
    ],
  },
];

const diagnosisResults: DiagnosisResult[] = [
  {
    type: "starter",
    title: "スタートアップフェーズ",
    description: "マーケティング施策の土台作りが必要な段階です。まずは基盤を整えることから始めましょう。",
    recommendations: [
      "ターゲット顧客の明確化・ペルソナ設定",
      "Webサイトの改善・LP制作",
      "基本的なSEO対策の実施",
      "リード獲得の仕組み構築",
    ],
  },
  {
    type: "growth",
    title: "成長フェーズ",
    description: "施策は実施されていますが、より効率化・最適化が必要な段階です。",
    recommendations: [
      "コンバージョン率の改善（CRO）",
      "マーケティングオートメーション導入",
      "コンテンツマーケティング強化",
      "広告運用の最適化",
    ],
  },
  {
    type: "scale",
    title: "スケールフェーズ",
    description: "一定の成果が出ている段階です。さらなる成長に向けた拡大施策を検討しましょう。",
    recommendations: [
      "データ分析基盤の強化",
      "ABM（アカウントベースドマーケティング）",
      "マルチチャネル戦略の高度化",
      "営業・マーケティング連携の最適化",
    ],
  },
  {
    type: "optimize",
    title: "最適化フェーズ",
    description: "高い成熟度に達しています。細部の最適化とイノベーションを追求しましょう。",
    recommendations: [
      "AIを活用した予測分析",
      "パーソナライゼーション強化",
      "カスタマーサクセス施策",
      "新規チャネル開拓",
    ],
  },
];

export default function ProblemDiagnosisEmbed() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateResult = (): DiagnosisResult => {
    let totalScore = 0;
    Object.entries(answers).forEach(([questionId, value]) => {
      const question = questions.find((q) => q.id === questionId);
      const option = question?.options.find((o) => o.value === value);
      if (option) {
        totalScore += option.score;
      }
    });

    const maxScore = questions.length * 20;
    const percentage = (totalScore / maxScore) * 100;

    if (percentage < 30) return diagnosisResults[0];
    if (percentage < 50) return diagnosisResults[1];
    if (percentage < 75) return diagnosisResults[2];
    return diagnosisResults[3];
  };

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const result = showResult ? calculateResult() : null;

  return (
    <div className="min-h-screen bg-[#f5f7fa] p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        {!showResult ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">マーケティング課題診断</h1>
              <p className="text-[#5c5c7a] text-sm">5つの質問で課題を診断</p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#5c5c7a]">
                  {currentStep + 1} / {questions.length}
                </span>
                <span className="text-sm text-[#5c5c7a]">{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-[#e8ecf3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2563eb] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-base font-semibold text-[#1a1a2e] mb-5">{currentQuestion.question}</h2>
              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      answers[currentQuestion.id] === option.value
                        ? "bg-[#eff6ff] ring-1 ring-[#2563eb]"
                        : "bg-[#f5f7fa] hover:bg-[#e8ecf3]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          answers[currentQuestion.id] === option.value
                            ? "bg-[#2563eb] border-[#2563eb]"
                            : "border-[#c4c4d4]"
                        }`}
                      >
                        {answers[currentQuestion.id] === option.value && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                      <span className={`text-sm ${answers[currentQuestion.id] === option.value ? "text-[#2563eb] font-medium" : "text-[#1a1a2e]"}`}>
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                  currentStep === 0
                    ? "bg-[#e8ecf3] text-[#9ca3af] cursor-not-allowed"
                    : "bg-white text-[#1a1a2e] shadow-sm hover:bg-[#f5f7fa]"
                }`}
              >
                戻る
              </button>
              <button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all ${
                  answers[currentQuestion.id]
                    ? "bg-[#2563eb] text-white hover:bg-[#1d4ed8]"
                    : "bg-[#e8ecf3] text-[#9ca3af] cursor-not-allowed"
                }`}
              >
                {currentStep < questions.length - 1 ? "次へ" : "結果を見る"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Result Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-[#1a1a2e] mb-1">診断結果</h1>
            </div>

            {/* Result Card */}
            <div className="bg-[#2563eb] rounded-lg p-6 text-white mb-5">
              <h2 className="text-xl font-bold mb-2">{result?.title}</h2>
              <p className="text-sm opacity-90 leading-relaxed">{result?.description}</p>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-lg p-5 shadow-sm mb-5">
              <h3 className="font-semibold text-[#1a1a2e] mb-4 text-sm">おすすめの施策</h3>
              <div className="space-y-3">
                {result?.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded bg-[#eff6ff] text-[#2563eb] flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm text-[#1a1a2e]">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowResult(false);
                  setCurrentStep(0);
                  setAnswers({});
                }}
                className="py-3 rounded-lg bg-white text-[#1a1a2e] font-medium text-sm shadow-sm hover:bg-[#f5f7fa] transition-all"
              >
                もう一度診断
              </button>
              <button className="py-3 rounded-lg bg-[#2563eb] text-white font-medium text-sm hover:bg-[#1d4ed8] transition-all">
                詳しく相談する
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
