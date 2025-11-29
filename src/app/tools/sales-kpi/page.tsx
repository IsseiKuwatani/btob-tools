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

export default function SalesKPIPage() {
  const tool = getToolBySlug("sales-kpi")!;
  
  const [targetRevenue, setTargetRevenue] = useState(10000000); // 月間売上目標
  const [avgDealSize, setAvgDealSize] = useState(500000); // 平均単価
  const [leadToMql, setLeadToMql] = useState(30); // リード→MQL転換率
  const [mqlToSql, setMqlToSql] = useState(40); // MQL→SQL転換率
  const [sqlToOpp, setSqlToOpp] = useState(50); // SQL→商談転換率
  const [closeRate, setCloseRate] = useState(25); // 受注率
  
  const [showResult, setShowResult] = useState(false);

  const results = useMemo(() => {
    // 必要な受注数
    const requiredDeals = Math.ceil(targetRevenue / avgDealSize);
    // 必要な商談数
    const requiredOpportunities = Math.ceil(requiredDeals / (closeRate / 100));
    // 必要なSQL数
    const requiredSqls = Math.ceil(requiredOpportunities / (sqlToOpp / 100));
    // 必要なMQL数
    const requiredMqls = Math.ceil(requiredSqls / (mqlToSql / 100));
    // 必要なリード数
    const requiredLeads = Math.ceil(requiredMqls / (leadToMql / 100));
    
    // 全体の転換率
    const overallConversion = (leadToMql / 100) * (mqlToSql / 100) * (sqlToOpp / 100) * (closeRate / 100) * 100;
    
    // ボトルネック特定（最も低い転換率）
    const rates = [
      { name: "リード→MQL", rate: leadToMql },
      { name: "MQL→SQL", rate: mqlToSql },
      { name: "SQL→商談", rate: sqlToOpp },
      { name: "商談→受注", rate: closeRate },
    ];
    const bottleneck = rates.reduce((min, curr) => curr.rate < min.rate ? curr : min);
    
    // 改善シミュレーション（ボトルネックを1.5倍に改善した場合）
    const improvedOverall = overallConversion * 1.5;
    const improvedLeads = Math.ceil(requiredLeads / 1.5);
    
    return {
      requiredDeals,
      requiredOpportunities,
      requiredSqls,
      requiredMqls,
      requiredLeads,
      overallConversion,
      bottleneck,
      improvedLeads,
      funnel: [
        { name: "リード", value: requiredLeads, rate: null },
        { name: "MQL", value: requiredMqls, rate: leadToMql },
        { name: "SQL", value: requiredSqls, rate: mqlToSql },
        { name: "商談", value: requiredOpportunities, rate: sqlToOpp },
        { name: "受注", value: requiredDeals, rate: closeRate },
      ],
    };
  }, [targetRevenue, avgDealSize, leadToMql, mqlToSql, sqlToOpp, closeRate]);

  const formatCurrency = (value: number) => `¥${value.toLocaleString()}`;

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDocument className="w-5 h-5 text-primary" />
              目標設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              label="月間売上目標"
              type="number"
              value={targetRevenue}
              onChange={(e) => setTargetRevenue(Number(e.target.value))}
              prefix="¥"
            />
            
            <Input
              label="平均受注単価"
              type="number"
              value={avgDealSize}
              onChange={(e) => setAvgDealSize(Number(e.target.value))}
              prefix="¥"
            />
            
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-4">転換率設定</p>
              
              <Slider
                label="リード→MQL転換率"
                value={leadToMql}
                onChange={(e) => setLeadToMql(Number(e.target.value))}
                min={5}
                max={80}
                step={5}
                valueFormatter={(v) => `${v}%`}
              />
              
              <Slider
                label="MQL→SQL転換率"
                value={mqlToSql}
                onChange={(e) => setMqlToSql(Number(e.target.value))}
                min={5}
                max={80}
                step={5}
                valueFormatter={(v) => `${v}%`}
              />
              
              <Slider
                label="SQL→商談転換率"
                value={sqlToOpp}
                onChange={(e) => setSqlToOpp(Number(e.target.value))}
                min={5}
                max={80}
                step={5}
                valueFormatter={(v) => `${v}%`}
              />
              
              <Slider
                label="商談→受注率"
                value={closeRate}
                onChange={(e) => setCloseRate(Number(e.target.value))}
                min={5}
                max={60}
                step={5}
                valueFormatter={(v) => `${v}%`}
              />
            </div>

            <Button onClick={() => setShowResult(true)} className="w-full" size="lg">
              必要数を逆算する
            </Button>
          </CardContent>
        </Card>

        {/* Result Section */}
        <div className="space-y-5">
          {showResult ? (
            <>
              <ResultCard
                title="必要なリード数（月間）"
                value={`${results.requiredLeads.toLocaleString()}件`}
                description={`目標達成には月間${results.requiredLeads}件のリードが必要です`}
                highlight
                size="lg"
                icon={<IconTarget className="w-6 h-6" />}
              />

              {/* ファネル */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconTrendingUp className="w-5 h-5 text-primary" />
                    セールスファネル
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.funnel.map((stage, index) => {
                      const maxValue = results.funnel[0].value;
                      const percentage = (stage.value / maxValue) * 100;
                      
                      return (
                        <div key={stage.name}>
                          <div className="flex justify-between items-center text-sm mb-1">
                            <span className="flex items-center gap-2">
                              <span className="font-medium">{stage.name}</span>
                              {stage.rate && (
                                <span className="text-xs text-foreground-muted">
                                  ← {stage.rate}%
                                </span>
                              )}
                            </span>
                            <span className="font-bold">{stage.value.toLocaleString()}件</span>
                          </div>
                          <div className="h-6 bg-background-secondary rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-lg transition-all duration-500 flex items-center justify-end pr-2"
                              style={{ width: `${Math.max(percentage, 10)}%` }}
                            >
                              {percentage > 20 && (
                                <span className="text-xs text-white font-medium">
                                  {stage.value.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-background-secondary rounded-lg">
                    <p className="text-sm">
                      <span className="text-foreground-muted">全体転換率：</span>
                      <span className="font-bold text-primary ml-1">
                        {results.overallConversion.toFixed(2)}%
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* ボトルネック */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="py-5">
                  <h3 className="font-medium text-foreground mb-2 text-sm">
                    ボトルネック分析
                  </h3>
                  <p className="text-foreground-muted text-sm mb-3">
                    <strong className="text-primary">{results.bottleneck.name}</strong>（{results.bottleneck.rate}%）
                    が最も低い転換率です。
                  </p>
                  <div className="p-3 bg-primary-light rounded-lg">
                    <p className="text-sm">
                      この転換率を<strong>1.5倍</strong>に改善すると、
                      必要リード数が<strong className="text-primary">{results.requiredLeads.toLocaleString()}件</strong>から
                      <strong className="text-primary">{results.improvedLeads.toLocaleString()}件</strong>に削減できます。
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center text-foreground-muted">
                <IconDocument className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">左の項目を入力して<br />「逆算する」をクリックしてください</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

