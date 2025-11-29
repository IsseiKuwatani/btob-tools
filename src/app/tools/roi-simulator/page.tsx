"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/lib/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { ResultCard } from "@/components/ui/ResultCard";
import { IconCurrency, IconTrendingUp, IconDocument } from "@/components/icons";

export default function ROISimulatorPage() {
  const tool = getToolBySlug("roi-simulator")!;
  
  const [employees, setEmployees] = useState(50);
  const [hourlyRate, setHourlyRate] = useState(3000);
  const [hoursPerWeek, setHoursPerWeek] = useState(5);
  const [efficiencyGain, setEfficiencyGain] = useState(30);
  const [showResult, setShowResult] = useState(false);

  const results = useMemo(() => {
    const weeklySavingsHours = (hoursPerWeek * efficiencyGain) / 100;
    const monthlySavingsHours = weeklySavingsHours * 4 * employees;
    const yearlySavingsHours = monthlySavingsHours * 12;
    
    const monthlySavings = monthlySavingsHours * hourlyRate;
    const yearlySavings = yearlySavingsHours * hourlyRate;
    
    return {
      weeklySavingsHours,
      monthlySavingsHours: Math.round(monthlySavingsHours),
      yearlySavingsHours: Math.round(yearlySavingsHours),
      monthlySavings: Math.round(monthlySavings),
      yearlySavings: Math.round(yearlySavings),
    };
  }, [employees, hourlyRate, hoursPerWeek, efficiencyGain]);

  const handleCalculate = () => {
    setShowResult(true);
  };

  const formatCurrency = (value: number) => {
    return `¥${value.toLocaleString()}`;
  };

  const formatHours = (value: number) => {
    return `${value.toLocaleString()}時間`;
  };

  return (
    <ToolLayout tool={tool}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconDocument className="w-5 h-5 text-primary" />
              入力項目
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              label="従業員数"
              type="number"
              value={employees}
              onChange={(e) => setEmployees(Number(e.target.value))}
              suffix="人"
              min={1}
              max={10000}
            />
            
            <Input
              label="平均時給（人件費込み）"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              prefix="¥"
              helper="福利厚生・社会保険込みの場合、月給÷160×1.5程度"
            />
            
            <Slider
              label="対象業務の週間作業時間"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              min={1}
              max={40}
              step={1}
              valueFormatter={(v) => `${v}時間/週`}
            />
            
            <Slider
              label="効率化率（削減できる時間の割合）"
              value={efficiencyGain}
              onChange={(e) => setEfficiencyGain(Number(e.target.value))}
              min={10}
              max={80}
              step={5}
              valueFormatter={(v) => `${v}%`}
            />

            <Button onClick={handleCalculate} className="w-full" size="lg">
              コスト削減額を計算する
            </Button>
          </CardContent>
        </Card>

        {/* Result Section */}
        <div className="space-y-5">
          {showResult ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ResultCard
                  title="月間削減額"
                  value={formatCurrency(results.monthlySavings)}
                  description={`${formatHours(results.monthlySavingsHours)}の削減`}
                  highlight
                  icon={<IconCurrency className="w-6 h-6" />}
                />
                <ResultCard
                  title="年間削減額"
                  value={formatCurrency(results.yearlySavings)}
                  description={`${formatHours(results.yearlySavingsHours)}の削減`}
                  highlight
                  icon={<IconTrendingUp className="w-6 h-6" />}
                />
              </div>

              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconTrendingUp className="w-5 h-5 text-primary" />
                    5年間の削減効果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((year) => {
                      const yearlyTotal = results.yearlySavings * year;
                      const maxValue = results.yearlySavings * 5;
                      const percentage = (yearlyTotal / maxValue) * 100;
                      
                      return (
                        <div key={year}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground-muted">{year}年目</span>
                            <span className="font-medium text-foreground">
                              {formatCurrency(yearlyTotal)}
                            </span>
                          </div>
                          <div className="h-3 bg-background-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-5 p-4 bg-primary-light rounded-lg">
                    <p className="text-sm text-foreground">
                      <span className="font-medium">5年間の累計削減額：</span>
                      <span className="text-xl font-bold text-primary ml-2">
                        {formatCurrency(results.yearlySavings * 5)}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-primary text-white border-0">
                <CardContent className="text-center py-6">
                  <h3 className="text-lg font-bold mb-2">
                    この削減効果を実現しませんか？
                  </h3>
                  <p className="text-blue-100 mb-4 text-sm">
                    無料トライアルで効果を実感してください
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white text-primary border-white hover:bg-blue-50"
                  >
                    無料で相談する
                  </Button>
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
