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

export default function LPImprovementPage() {
  const tool = getToolBySlug("lp-improvement")!;
  
  const [monthlyVisitors, setMonthlyVisitors] = useState(10000); // 月間訪問者数
  const [currentCvr, setCurrentCvr] = useState(1.5); // 現在のCVR
  const [targetCvr, setTargetCvr] = useState(3); // 目標CVR
  const [avgDealSize, setAvgDealSize] = useState(100000); // 平均単価
  const [closeRate, setCloseRate] = useState(20); // 受注率
  const [improvementCost, setImprovementCost] = useState(500000); // LP改善費用
  
  const [showResult, setShowResult] = useState(false);

  const results = useMemo(() => {
    // 現在の数値
    const currentLeads = Math.floor(monthlyVisitors * (currentCvr / 100));
    const currentDeals = Math.floor(currentLeads * (closeRate / 100));
    const currentRevenue = currentDeals * avgDealSize;
    
    // 改善後の数値
    const improvedLeads = Math.floor(monthlyVisitors * (targetCvr / 100));
    const improvedDeals = Math.floor(improvedLeads * (closeRate / 100));
    const improvedRevenue = improvedDeals * avgDealSize;
    
    // 差分
    const leadsDiff = improvedLeads - currentLeads;
    const dealsDiff = improvedDeals - currentDeals;
    const revenueDiff = improvedRevenue - currentRevenue;
    
    // 年間インパクト
    const annualImpact = revenueDiff * 12;
    
    // 投資回収期間（月）
    const paybackPeriod = revenueDiff > 0 ? improvementCost / revenueDiff : 0;
    
    // ROI
    const roi = improvementCost > 0 ? ((annualImpact - improvementCost) / improvementCost) * 100 : 0;
    
    return {
      current: {
        leads: currentLeads,
        deals: currentDeals,
        revenue: currentRevenue,
      },
      improved: {
        leads: improvedLeads,
        deals: improvedDeals,
        revenue: improvedRevenue,
      },
      diff: {
        leads: leadsDiff,
        deals: dealsDiff,
        revenue: revenueDiff,
      },
      annualImpact,
      paybackPeriod,
      roi,
      cvrImprovement: ((targetCvr - currentCvr) / currentCvr) * 100,
    };
  }, [monthlyVisitors, currentCvr, targetCvr, avgDealSize, closeRate, improvementCost]);

  const formatCurrency = (value: number) => `¥${value.toLocaleString()}`;

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDocument className="w-5 h-5 text-primary" />
              現状の数値
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              label="月間LP訪問者数"
              type="number"
              value={monthlyVisitors}
              onChange={(e) => setMonthlyVisitors(Number(e.target.value))}
              suffix="人"
            />
            
            <Slider
              label="現在のCVR"
              value={currentCvr}
              onChange={(e) => setCurrentCvr(Number(e.target.value))}
              min={0.1}
              max={10}
              step={0.1}
              valueFormatter={(v) => `${v}%`}
            />
            
            <Slider
              label="目標CVR"
              value={targetCvr}
              onChange={(e) => setTargetCvr(Number(e.target.value))}
              min={0.1}
              max={10}
              step={0.1}
              valueFormatter={(v) => `${v}%`}
            />
            
            <div className="pt-4 border-t border-border">
              <Input
                label="平均受注単価"
                type="number"
                value={avgDealSize}
                onChange={(e) => setAvgDealSize(Number(e.target.value))}
                prefix="¥"
              />
              
              <div className="mt-4">
                <Slider
                  label="リード→受注率"
                  value={closeRate}
                  onChange={(e) => setCloseRate(Number(e.target.value))}
                  min={5}
                  max={50}
                  step={5}
                  valueFormatter={(v) => `${v}%`}
                />
              </div>
              
              <div className="mt-4">
                <Input
                  label="LP改善費用"
                  type="number"
                  value={improvementCost}
                  onChange={(e) => setImprovementCost(Number(e.target.value))}
                  prefix="¥"
                  helper="デザイン・開発費用など"
                />
              </div>
            </div>

            <Button onClick={() => setShowResult(true)} className="w-full" size="lg">
              効果をシミュレーション
            </Button>
          </CardContent>
        </Card>

        {/* Result Section */}
        <div className="space-y-5">
          {showResult ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <ResultCard
                  title="年間売上インパクト"
                  value={formatCurrency(results.annualImpact)}
                  highlight
                  icon={<IconCurrency className="w-6 h-6" />}
                />
                <ResultCard
                  title="投資対効果（ROI）"
                  value={`${Math.round(results.roi)}%`}
                  highlight
                  icon={<IconTrendingUp className="w-6 h-6" />}
                />
              </div>

              {/* 比較表 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconTarget className="w-5 h-5 text-primary" />
                    改善前後の比較（月間）
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 text-foreground-muted font-medium">指標</th>
                          <th className="text-right py-3 text-foreground-muted font-medium">現在</th>
                          <th className="text-right py-3 text-foreground-muted font-medium">改善後</th>
                          <th className="text-right py-3 text-foreground-muted font-medium">増加</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3">CVR</td>
                          <td className="text-right py-3">{currentCvr}%</td>
                          <td className="text-right py-3">{targetCvr}%</td>
                          <td className="text-right py-3 text-primary font-medium">
                            +{results.cvrImprovement.toFixed(0)}%
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3">リード数</td>
                          <td className="text-right py-3">{results.current.leads}件</td>
                          <td className="text-right py-3">{results.improved.leads}件</td>
                          <td className="text-right py-3 text-primary font-medium">
                            +{results.diff.leads}件
                          </td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3">受注数</td>
                          <td className="text-right py-3">{results.current.deals}件</td>
                          <td className="text-right py-3">{results.improved.deals}件</td>
                          <td className="text-right py-3 text-primary font-medium">
                            +{results.diff.deals}件
                          </td>
                        </tr>
                        <tr className="bg-primary-light">
                          <td className="py-3 font-bold">売上</td>
                          <td className="text-right py-3 font-bold">{formatCurrency(results.current.revenue)}</td>
                          <td className="text-right py-3 font-bold">{formatCurrency(results.improved.revenue)}</td>
                          <td className="text-right py-3 text-primary font-bold">
                            +{formatCurrency(results.diff.revenue)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* 投資回収 */}
              <Card className="border-l-4 border-l-primary">
                <CardContent className="py-5">
                  <h3 className="font-medium text-foreground mb-3 text-sm">
                    投資回収シミュレーション
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-background-secondary rounded-lg">
                      <p className="text-foreground-muted text-xs">LP改善費用</p>
                      <p className="text-lg font-bold">{formatCurrency(improvementCost)}</p>
                    </div>
                    <div className="p-3 bg-background-secondary rounded-lg">
                      <p className="text-foreground-muted text-xs">投資回収期間</p>
                      <p className="text-lg font-bold">
                        {results.paybackPeriod > 0 ? `${results.paybackPeriod.toFixed(1)}ヶ月` : "-"}
                      </p>
                    </div>
                  </div>
                  {results.paybackPeriod > 0 && results.paybackPeriod <= 12 && (
                    <p className="mt-3 text-sm text-foreground">
                      <span className="text-primary font-medium">{Math.ceil(results.paybackPeriod)}ヶ月</span>で投資回収でき、
                      年間<span className="text-primary font-medium">{formatCurrency(results.annualImpact - improvementCost)}</span>の利益増加が見込めます。
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-primary text-white border-0">
                <CardContent className="text-center py-6">
                  <h3 className="text-lg font-bold mb-2">
                    LP改善のご相談はこちら
                  </h3>
                  <p className="text-blue-100 mb-4 text-sm">
                    CVR改善の実績豊富なプロがサポートします
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white text-primary border-white hover:bg-blue-50"
                  >
                    無料相談する
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center text-foreground-muted">
                <IconDocument className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-sm">左の項目を入力して<br />「シミュレーション」をクリックしてください</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

