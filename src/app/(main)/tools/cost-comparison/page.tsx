"use client";

import { useState, useMemo } from "react";
import { getToolBySlug } from "@/lib/tools";
import { ToolLayout } from "@/components/tools/ToolLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ResultCard } from "@/components/ui/ResultCard";
import { IconScale, IconDocument, IconTrendingUp } from "@/components/icons";

export default function CostComparisonPage() {
  const tool = getToolBySlug("cost-comparison")!;
  
  // 外注の場合
  const [outsourceCost, setOutsourceCost] = useState(5000000); // 初期開発費
  const [outsourceMaintenance, setOutsourceMaintenance] = useState(500000); // 年間保守費
  
  // 内製の場合
  const [engineerCount, setEngineerCount] = useState(2); // エンジニア数
  const [engineerSalary, setEngineerSalary] = useState(600000); // 月給
  const [developmentMonths, setDevelopmentMonths] = useState(6); // 開発期間
  const [toolCost, setToolCost] = useState(50000); // 月額ツール費
  
  const [showResult, setShowResult] = useState(false);

  const results = useMemo(() => {
    // 外注の5年間TCO
    const outsource5Year = outsourceCost + (outsourceMaintenance * 5);
    
    // 内製の初期開発費（人件費 × 開発期間）
    const internalDevCost = engineerCount * engineerSalary * developmentMonths;
    // 内製の年間運用費（人件費の20% + ツール費）
    const internalAnnualCost = (engineerCount * engineerSalary * 12 * 0.2) + (toolCost * 12);
    // 内製の5年間TCO
    const internal5Year = internalDevCost + (internalAnnualCost * 5);
    
    // 差額
    const difference = outsource5Year - internal5Year;
    const cheaperOption = difference > 0 ? "internal" : "outsource";
    
    // 損益分岐点（年）
    const yearlyDiff = outsourceMaintenance - internalAnnualCost;
    const initialDiff = outsourceCost - internalDevCost;
    let breakEvenYear = 0;
    if (yearlyDiff !== 0) {
      breakEvenYear = Math.abs(initialDiff / yearlyDiff);
    }
    
    return {
      outsource: {
        initial: outsourceCost,
        annual: outsourceMaintenance,
        total5Year: outsource5Year,
      },
      internal: {
        initial: internalDevCost,
        annual: internalAnnualCost,
        total5Year: internal5Year,
      },
      difference: Math.abs(difference),
      cheaperOption,
      breakEvenYear: breakEvenYear > 0 && breakEvenYear <= 10 ? breakEvenYear.toFixed(1) : null,
    };
  }, [outsourceCost, outsourceMaintenance, engineerCount, engineerSalary, developmentMonths, toolCost]);

  const formatCurrency = (value: number) => `¥${value.toLocaleString()}`;

  return (
    <ToolLayout tool={tool}>
      <div className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 外注 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconDocument className="w-5 h-5 text-primary" />
                外注の場合
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="初期開発費"
                type="number"
                value={outsourceCost}
                onChange={(e) => setOutsourceCost(Number(e.target.value))}
                prefix="¥"
                helper="見積もり金額を入力"
              />
              <Input
                label="年間保守費"
                type="number"
                value={outsourceMaintenance}
                onChange={(e) => setOutsourceMaintenance(Number(e.target.value))}
                prefix="¥"
                helper="年間の運用・保守費用"
              />
            </CardContent>
          </Card>

          {/* 内製 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconDocument className="w-5 h-5 text-primary" />
                内製の場合
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="エンジニア数"
                  type="number"
                  value={engineerCount}
                  onChange={(e) => setEngineerCount(Number(e.target.value))}
                  suffix="人"
                />
                <Input
                  label="平均月給"
                  type="number"
                  value={engineerSalary}
                  onChange={(e) => setEngineerSalary(Number(e.target.value))}
                  prefix="¥"
                />
              </div>
              <Input
                label="開発期間"
                type="number"
                value={developmentMonths}
                onChange={(e) => setDevelopmentMonths(Number(e.target.value))}
                suffix="ヶ月"
              />
              <Input
                label="月額ツール費"
                type="number"
                value={toolCost}
                onChange={(e) => setToolCost(Number(e.target.value))}
                prefix="¥"
                helper="開発ツール・インフラ費用"
              />
            </CardContent>
          </Card>
        </div>

        <Button onClick={() => setShowResult(true)} className="w-full" size="lg">
          コストを比較する
        </Button>

        {/* Result Section */}
        {showResult && (
          <div className="space-y-6 animate-slide-up">
            {/* 結論 */}
            <Card className="bg-primary text-white border-0">
              <CardContent className="py-6 text-center">
                <p className="text-sm text-blue-100 mb-2">5年間のTCOで比較すると</p>
                <p className="text-2xl font-bold mb-2">
                  {results.cheaperOption === "internal" ? "内製" : "外注"}の方が
                  <span className="text-3xl mx-2">{formatCurrency(results.difference)}</span>
                  お得
                </p>
                {results.breakEvenYear && (
                  <p className="text-sm text-blue-100">
                    損益分岐点：約{results.breakEvenYear}年
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 比較表 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconScale className="w-5 h-5 text-primary" />
                  コスト比較
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 text-foreground-muted font-medium">項目</th>
                        <th className="text-right py-3 text-foreground-muted font-medium">外注</th>
                        <th className="text-right py-3 text-foreground-muted font-medium">内製</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="py-3">初期費用</td>
                        <td className="text-right py-3">{formatCurrency(results.outsource.initial)}</td>
                        <td className="text-right py-3">{formatCurrency(results.internal.initial)}</td>
                      </tr>
                      <tr className="border-b border-border">
                        <td className="py-3">年間運用費</td>
                        <td className="text-right py-3">{formatCurrency(results.outsource.annual)}</td>
                        <td className="text-right py-3">{formatCurrency(Math.round(results.internal.annual))}</td>
                      </tr>
                      <tr className="bg-primary-light">
                        <td className="py-3 font-bold">5年間TCO</td>
                        <td className={`text-right py-3 font-bold ${results.cheaperOption === "outsource" ? "text-primary" : ""}`}>
                          {formatCurrency(results.outsource.total5Year)}
                        </td>
                        <td className={`text-right py-3 font-bold ${results.cheaperOption === "internal" ? "text-primary" : ""}`}>
                          {formatCurrency(Math.round(results.internal.total5Year))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* グラフ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconTrendingUp className="w-5 h-5 text-primary" />
                  累計コスト推移
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[0, 1, 2, 3, 4, 5].map((year) => {
                    const outsourceTotal = results.outsource.initial + (results.outsource.annual * year);
                    const internalTotal = results.internal.initial + (results.internal.annual * year);
                    const maxValue = Math.max(results.outsource.total5Year, results.internal.total5Year);
                    
                    return (
                      <div key={year}>
                        <div className="flex justify-between text-xs text-foreground-muted mb-1">
                          <span>{year}年目</span>
                          <div className="flex gap-4">
                            <span>外注: {formatCurrency(outsourceTotal)}</span>
                            <span>内製: {formatCurrency(Math.round(internalTotal))}</span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <div className="h-3 bg-primary/30 rounded-full" style={{ width: `${(outsourceTotal / maxValue) * 100}%` }} />
                        </div>
                        <div className="flex gap-1 mt-1">
                          <div className="h-3 bg-primary rounded-full" style={{ width: `${(internalTotal / maxValue) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary/30 rounded" />
                    <span>外注</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded" />
                    <span>内製</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}

