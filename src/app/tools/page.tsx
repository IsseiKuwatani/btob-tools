import Link from "next/link";
import { tools, categoryLabels, ToolCategory } from "@/lib/tools";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { toolIcons, IconCheck, IconExternalLink } from "@/components/icons";

export const metadata = {
  title: "ツール一覧 | BtoB Marketing Tools",
  description: "Cursorで爆速で作れるBtoB向けマーケティングツール一覧。ROIシミュレーター、診断ツール、コスト計算機など。",
};

export default function ToolsPage() {
  const categories: ToolCategory[] = ["simulator", "diagnostic", "calculator", "comparison", "checklist"];
  
  return (
    <div className="min-h-screen py-12 bg-background-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-foreground mb-3">
            ツール一覧
          </h1>
          <p className="text-foreground-muted">
            BtoB向けのリード獲得に使えるツールを紹介します。
            これらはすべてCursorで数分で作成できます。
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
            すべて
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className="px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium text-foreground-muted hover:border-primary hover:text-primary transition-colors"
            >
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const IconComponent = toolIcons[tool.iconName];
            return (
              <Link
                key={tool.id}
                href={tool.comingSoon ? "#" : `/tools/${tool.slug}`}
                className={tool.comingSoon ? "cursor-not-allowed" : ""}
              >
                <Card hover={!tool.comingSoon} className="h-full relative">
                  {tool.isNew && (
                    <span className="absolute top-4 right-4 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                      NEW
                    </span>
                  )}
                  {tool.comingSoon && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl">
                      <span className="bg-foreground-muted text-white text-sm font-medium px-3 py-1.5 rounded">
                        Coming Soon
                      </span>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center mb-3">
                      {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
                    </div>
                    <p className="text-xs text-foreground-muted mb-1">{categoryLabels[tool.category]}</p>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <ul className="space-y-1">
                      {tool.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-foreground-muted">
                          <IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Add New Tool CTA */}
        <div className="mt-12 p-8 bg-white rounded-xl border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                新しいツールをリクエスト
              </h3>
              <p className="text-foreground-muted text-sm">
                こんなツールがあったらいいな、をお聞かせください。Cursorで作成してみます！
              </p>
            </div>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap text-sm"
            >
              リクエストする
              <IconExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
