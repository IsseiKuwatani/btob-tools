import Link from "next/link";
import { ReactNode } from "react";
import { Tool, categoryLabels } from "@/lib/tools";
import { toolIcons, IconLightning, IconChevronRight } from "@/components/icons";

interface ToolLayoutProps {
  tool: Tool;
  children: ReactNode;
}

export function ToolLayout({ tool, children }: ToolLayoutProps) {
  const IconComponent = toolIcons[tool.iconName];
  
  return (
    <div className="min-h-screen py-8 bg-background-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-foreground-muted mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            ホーム
          </Link>
          <IconChevronRight className="w-4 h-4" />
          <Link href="/tools" className="hover:text-foreground transition-colors">
            ツール一覧
          </Link>
          <IconChevronRight className="w-4 h-4" />
          <span className="text-foreground">{tool.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center">
              {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
            </div>
            <div>
              <p className="text-xs text-foreground-muted mb-1">{categoryLabels[tool.category]}</p>
              <h1 className="text-2xl font-bold text-foreground">{tool.name}</h1>
            </div>
          </div>
          <p className="text-foreground-muted">{tool.description}</p>
        </div>

        {/* Tool Content */}
        <div className="animate-fade-in">
          {children}
        </div>

        {/* Prompt Section */}
        <div className="mt-10 p-6 bg-white rounded-xl border border-border">
          <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <IconLightning className="w-5 h-5 text-primary" />
            このツールをCursorで作るには？
          </h3>
          <p className="text-sm text-foreground-muted mb-4">
            以下のようなプロンプトをCursorのComposer (Command + I) に入力するだけで、このようなツールが作れます。
          </p>
          <div className="bg-foreground text-white p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <code>
              {getPromptForTool(tool.slug)}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

function getPromptForTool(slug: string): string {
  const prompts: Record<string, string> = {
    "roi-simulator": `従業員数と平均時給を入力すると、当社のツールを導入した場合のコスト削減額（月間・年間）を算出するシミュレーションツールを作ってください。
デザインはB2B向けの信頼感のある青色ベースで、結果はグラフで可視化して、LPに埋め込めるHTML/CSS/JSの1つのファイルにしてください`,
    "dx-maturity": `DX成熟度を診断するツールを作ってください。
5つの質問（戦略・組織・技術・データ・文化）に5段階で回答すると、レーダーチャートで結果を表示します。
総合スコアと改善アドバイスも表示してください。`,
    "cost-comparison": `外注vs内製のコスト比較ツールを作ってください。
外注の場合は初期開発費と年間保守費、内製の場合はエンジニア人数・月給・開発期間・ツール費を入力します。
5年間のTCOを比較表示し、どちらがお得か、損益分岐点は何年目かを表示してください。`,
    "cpa-simulator": `リード獲得のCPA（顧客獲得単価）シミュレーターを作ってください。
月間広告予算、平均CPC、CVRを入力すると、月間リード数とCPAを算出します。
目標リード数を達成するために必要な予算も表示してください。`,
    "sales-kpi": `営業KPI逆算計算機を作ってください。
月間売上目標と平均単価を入力し、リード→MQL、MQL→SQL、SQL→商談、商談→受注の各転換率を設定すると、
目標達成に必要なリード数を逆算し、ファネル形式で表示します。ボトルネックも特定してください。`,
    "lp-improvement": `LP改善効果シミュレーターを作ってください。
月間訪問者数、現在のCVR、目標CVR、平均単価、受注率、LP改善費用を入力すると、
改善前後の比較表、年間売上インパクト、投資回収期間、ROIを表示してください。`,
  };
  
  return prompts[slug] || "このツールのプロンプトは準備中です...";
}
