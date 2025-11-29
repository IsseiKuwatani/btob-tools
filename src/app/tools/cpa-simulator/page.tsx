"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/lib/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { ResultCard } from "@/components/ui/ResultCard";
import { IconCurrency, IconTrendingUp, IconDocument, IconTarget } from "@/components/icons";

export default function CPASimulatorPage() {
  const tool = getToolBySlug("cpa-simulator")!;
  
  const [monthlyBudget, setMonthlyBudget] = useState(500000);
  const [cpc, setCpc] = useState(200); // クリック単価
  const [cvr, setCvr] = useState(2); // CV率（%）
  const [targetLeads, setTargetLeads] = useState(100); // 目標リード数
  
  const [showResult, setShowResult] = useState(false);

  const results = useMemo(() => {
    // 月間クリック数
    const monthlyClicks = Math.floor(monthlyBudget / cpc);
    // 月間リード数
    const monthlyLeads = Math.floor(monthlyClicks * (cvr / 100));
    // CPA（リード獲得単価）
    const cpa = monthlyLeads > 0 ? Math.round(monthlyBudget / monthlyLeads) : 0;
    // 目標達成に必要な予算
    const requiredBudget = targetLeads * cpa;
    // 目標達成に必要なクリック数
    const requiredClicks = Math.ceil(targetLeads / (cvr / 100));
    
    // CVR改善シミュレーション
    const cvrScenarios = [
      { cvr: cvr, leads: monthlyLeads, cpa: cpa },
      { cvr: cvr * 1.5, leads: Math.floor(monthlyClicks * (cvr * 1.5 / 100)), cpa: 0 },
      { cvr: cvr * 2, leads: Math.floor(monthlyClicks * (cvr * 2 / 100)), cpa: 0 },
    ];
    cvrScenarios[1].cpa = cvrScenarios[1].leads > 0 ? Math.round(monthlyBudget / cvrScenarios[1].leads) : 0;
    cvrScenarios[2].cpa = cvrScenarios[2].leads > 0 ? Math.round(monthlyBudget / cvrScenarios[2].leads) : 0;
    
    return {
      monthlyClicks,
      monthlyLeads,
      cpa,
      requiredBudget,
      requiredClicks,
      cvrScenarios,
    };
  }, [monthlyBudget, cpc, cvr, targetLeads]);

  const formatCurrency = (value: number) => `¥${value.toLocaleString()}`;

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDocument className="w-5 h-5 text-primary" />
              広告設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              label="月間広告予算"
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              prefix="¥"
            />
            
            <Input
              label="平均クリック単価（CPC）"
              type="number"
              value={cpc}
              onChange={(e) => setCpc(Number(e.target.value))}
              prefix="¥"
              helper="リスティング広告の平均CPC"
            />
            
            <Slider
              label="コンバージョン率（CVR）"
              value={cvr}
              onChange={(e) => setCvr(Number(e.target.value))}
              min={0.5}
              max={10}
              step={0.5}
              valueFormatter={(v) => `${v}%`}
            />
            
            <Input
              label="目標リード数（月間）"
              type="number"
              value={targetLeads}
              onChange={(e) => setTargetLeads(Number(e.target.value))}
              suffix="件"
            />

            <Button onClick={() => setShowResult(true)} className="w-full" size="lg">
              CPAを計算する
            </Button>
          </CardContent>
        </Card>

        {/* Result Section */}
        <div className="space-y-5">
          {showResult ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <ResultCard
                  title="リード獲得単価（CPA）"
                  value={formatCurrency(results.cpa)}
                  highlight
                  icon={<IconCurrency className="w-6 h-6" />}
                />
                <ResultCard
                  title="月間リード数"
                  value={`${results.monthlyLeads}件`}
                  highlight
                  icon={<IconTarget className="w-6 h-6" />}
                />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconTrendingUp className="w-5 h-5 text-primary" />
                    予測結果
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-background-secondary rounded-lg">
                      <p className="text-foreground-muted">月間クリック数</p>
                      <p className="text-lg font-bold">{results.monthlyClicks.toLocaleString()}回</p>
                    </div>
                    <div className="p-3 bg-background-secondary rounded-lg">
                      <p className="text-foreground-muted">目標達成に必要な予算</p>
                      <p className="text-lg font-bold">{formatCurrency(results.requiredBudget)}</p>
                    </div>
                  </div>
                  
                  {results.monthlyLeads < targetLeads && (
                    <div className="p-3 bg-primary-light rounded-lg border border-primary/20">
                      <p className="text-sm text-foreground">
                        現在の予算では目標の<strong>{targetLeads}件</strong>に対して
                        <strong className="text-primary">{results.monthlyLeads}件</strong>の見込みです。
                        目標達成には<strong className="text-primary">{formatCurrency(results.requiredBudget - monthlyBudget)}</strong>の追加予算が必要です。
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* CVR改善シミュレーション */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconTarget className="w-5 h-5 text-primary" />
                    CVR改善による効果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-muted mb-4">
                    同じ予算でもCVRを改善するとリード数が増加し、CPAが下がります。
                  </p>
                  <div className="space-y-3">
                    {results.cvrScenarios.map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                        <div>
                          <p className="font-medium">CVR {scenario.cvr.toFixed(1)}%</p>
                          <p className="text-xs text-foreground-muted">
                            {index === 0 ? "現状" : index === 1 ? "1.5倍に改善" : "2倍に改善"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{scenario.leads}件/月</p>
                          <p className="text-xs text-primary">CPA: {formatCurrency(scenario.cpa)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center text-foreground-muted">
                <IconDocument className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">左の項目を入力して<br />「計算する」をクリックしてください</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

