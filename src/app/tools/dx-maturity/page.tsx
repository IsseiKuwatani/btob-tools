"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/lib/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ResultCard } from "@/components/ui/ResultCard";
import { IconTarget, IconChart, IconClipboardCheck, IconLightBulb } from "@/components/icons";

interface Category {
  id: string;
  name: string;
  question: string;
  Icon: React.ComponentType<{ className?: string }>;
}

const categories: Category[] = [
  {
    id: "strategy",
    name: "戦略",
    question: "DXに関する明確なビジョンや戦略が策定されていますか？",
    Icon: IconTarget,
  },
  {
    id: "organization",
    name: "組織",
    question: "DX推進のための専門チームや担当者が配置されていますか？",
    Icon: IconClipboardCheck,
  },
  {
    id: "technology",
    name: "技術",
    question: "クラウドやAIなど最新技術の導入・活用が進んでいますか？",
    Icon: IconChart,
  },
  {
    id: "data",
    name: "データ",
    question: "データの収集・分析・活用が組織全体で行われていますか？",
    Icon: IconChart,
  },
  {
    id: "culture",
    name: "文化",
    question: "変化を受け入れ、挑戦を奨励する組織文化がありますか？",
    Icon: IconLightBulb,
  },
];

const levelLabels = [
  "未着手",
  "検討段階",
  "部分的に実施",
  "組織全体で実施",
  "継続的に改善",
];

export default function DXMaturityPage() {
  const tool = getToolBySlug("dx-maturity")!;
  
  const [scores, setScores] = useState<Record<string, number>>({
    strategy: 0,
    organization: 0,
    technology: 0,
    data: 0,
    culture: 0,
  });
  const [showResult, setShowResult] = useState(false);

  const handleScoreChange = (categoryId: string, score: number) => {
    setScores((prev) => ({ ...prev, [categoryId]: score }));
  };

  const results = useMemo(() => {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const average = total / categories.length;
    const maxScore = categories.length * 5;
    const percentage = Math.round((total / maxScore) * 100);
    
    let level: string;
    let advice: string;
    
    if (percentage >= 80) {
      level = "先進企業";
      advice = "DXを先導する企業として、さらなる革新と他社への知見共有を検討しましょう。";
    } else if (percentage >= 60) {
      level = "発展途上";
      advice = "基盤は整っています。組織全体での展開と継続的な改善に注力しましょう。";
    } else if (percentage >= 40) {
      level = "初期段階";
      advice = "まずは優先度の高い領域から着手し、小さな成功体験を積み重ねましょう。";
    } else {
      level = "要改善";
      advice = "DX戦略の策定と推進体制の構築から始めることをおすすめします。";
    }
    
    return { total, average, percentage, level, advice };
  }, [scores]);

  const handleSubmit = () => {
    setShowResult(true);
  };

  const handleReset = () => {
    setScores({
      strategy: 0,
      organization: 0,
      technology: 0,
      data: 0,
      culture: 0,
    });
    setShowResult(false);
  };

  return (
    <ToolLayout tool={tool}>
      {!showResult ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconClipboardCheck className="w-5 h-5 text-primary" />
              5つの質問に回答してください
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.map((category, index) => (
              <div key={category.id} className="pb-5 border-b border-border last:border-0 last:pb-0">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                    <category.Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-primary">
                        Q{index + 1}
                      </span>
                      <span className="font-medium text-foreground text-sm">{category.name}</span>
                    </div>
                    <p className="text-foreground-muted text-sm">{category.question}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleScoreChange(category.id, score)}
                      className={`
                        p-2.5 rounded-lg border text-center transition-all duration-200
                        ${scores[category.id] === score
                          ? "border-primary bg-primary-light text-primary"
                          : "border-border hover:border-primary/50 text-foreground-muted hover:text-foreground"
                        }
                      `}
                    >
                      <div className="text-lg font-bold mb-0.5">{score}</div>
                      <div className="text-xs hidden sm:block">{levelLabels[score - 1]}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              disabled={Object.values(scores).some((score) => score === 0)}
            >
              診断結果を見る
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5 animate-slide-up">
          {/* Overall Score */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ResultCard
              title="総合スコア"
              value={`${results.total}/25`}
              highlight
              size="lg"
            />
            <ResultCard
              title="達成度"
              value={`${results.percentage}%`}
              highlight
              size="lg"
            />
            <ResultCard
              title="レベル"
              value={results.level}
              highlight
              size="lg"
            />
          </div>

          {/* Radar Chart (CSS Only) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconChart className="w-5 h-5 text-primary" />
                レーダーチャート
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-full max-w-sm mx-auto aspect-square">
                {/* Background circles */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                  {/* Pentagon grid */}
                  {[1, 2, 3, 4, 5].map((level) => {
                    const radius = (level / 5) * 80;
                    const points = categories.map((_, i) => {
                      const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
                      const x = 100 + radius * Math.cos(angle);
                      const y = 100 + radius * Math.sin(angle);
                      return `${x},${y}`;
                    }).join(" ");
                    return (
                      <polygon
                        key={level}
                        points={points}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    );
                  })}
                  
                  {/* Axes */}
                  {categories.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
                    const x2 = 100 + 80 * Math.cos(angle);
                    const y2 = 100 + 80 * Math.sin(angle);
                    return (
                      <line
                        key={i}
                        x1="100"
                        y1="100"
                        x2={x2}
                        y2={y2}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    );
                  })}
                  
                  {/* Data polygon */}
                  <polygon
                    points={categories.map((cat, i) => {
                      const score = scores[cat.id];
                      const radius = (score / 5) * 80;
                      const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
                      const x = 100 + radius * Math.cos(angle);
                      const y = 100 + radius * Math.sin(angle);
                      return `${x},${y}`;
                    }).join(" ")}
                    fill="rgba(37, 99, 235, 0.15)"
                    stroke="#2563eb"
                    strokeWidth="2"
                  />
                  
                  {/* Data points */}
                  {categories.map((cat, i) => {
                    const score = scores[cat.id];
                    const radius = (score / 5) * 80;
                    const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
                    const x = 100 + radius * Math.cos(angle);
                    const y = 100 + radius * Math.sin(angle);
                    return (
                      <circle
                        key={cat.id}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#2563eb"
                      />
                    );
                  })}
                </svg>
                
                {/* Labels */}
                {categories.map((cat, i) => {
                  const angle = (Math.PI * 2 * i) / categories.length - Math.PI / 2;
                  const x = 50 + 48 * Math.cos(angle);
                  const y = 50 + 48 * Math.sin(angle);
                  return (
                    <div
                      key={cat.id}
                      className="absolute text-center transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary-light flex items-center justify-center mx-auto mb-1">
                        <cat.Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="text-xs font-medium text-foreground">{cat.name}</div>
                      <div className="text-xs text-primary font-medium">{scores[cat.id]}/5</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Category Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconClipboardCheck className="w-5 h-5 text-primary" />
                カテゴリー別スコア
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((cat) => {
                const score = scores[cat.id];
                const percentage = (score / 5) * 100;
                return (
                  <div key={cat.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <cat.Icon className="w-4 h-4 text-primary" />
                        {cat.name}
                      </span>
                      <span className="text-sm font-medium text-primary">{score}/5</span>
                    </div>
                    <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Advice */}
          <Card className="border-l-4 border-l-primary">
            <CardContent className="py-5">
              <h3 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
                <IconLightBulb className="w-4 h-4 text-primary" />
                改善アドバイス
              </h3>
              <p className="text-foreground-muted text-sm">{results.advice}</p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              もう一度診断する
            </Button>
            <Button className="flex-1">
              詳細レポートをダウンロード
            </Button>
          </div>

          {/* CTA */}
          <Card className="bg-primary text-white border-0">
            <CardContent className="text-center py-6">
              <h3 className="text-lg font-bold mb-2">
                DX推進についてご相談ください
              </h3>
              <p className="text-blue-100 mb-4 text-sm">
                専門家があなたの組織に最適なDX戦略をご提案します
              </p>
              <Button
                variant="outline"
                className="bg-white text-primary border-white hover:bg-blue-50"
              >
                無料相談を予約する
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </ToolLayout>
  );
}
