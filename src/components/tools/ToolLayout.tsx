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
    "cost-calculator": `内製vs外注のコスト比較ツールを作ってください。
プロジェクト規模、期間、人件費などを入力すると、5年間のTCOを比較表示します。
損益分岐点も計算してグラフで表示してください。`,
  };
  
  return prompts[slug] || "このツールのプロンプトは準備中です...";
}
