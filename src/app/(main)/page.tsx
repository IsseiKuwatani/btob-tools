import Link from "next/link";
import { tools, categoryLabels } from "@/lib/tools";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { toolIcons, IconChat, IconLightning, IconRocket, IconArrowRight, IconExternalLink, IconCheck } from "@/components/icons";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-primary font-medium text-sm mb-4">
              Cursor × B2Bマーケティング
            </p>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
              BtoB向けツールが
              <br />
              <span className="text-primary">3分で作れる</span>
            </h1>
            
            <p className="text-lg text-foreground-muted max-w-xl mx-auto mb-10">
              ROIシミュレーター、診断ツール、コスト計算機など。
              <br />
              エンジニアに依頼せず、マーケターが自分で作れる時代へ。
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
              >
                ツールを見る
                <IconArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://cursor.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground font-medium rounded-lg hover:bg-background-secondary transition-colors"
              >
                Cursorとは？
                <IconExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Preview */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              作成できるツール
            </h2>
            <p className="text-foreground-muted">
              BtoB向けのリード獲得に使えるツールを、Cursorで爆速で作成できます。
            </p>
          </div>

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
                      <span className="absolute top-4 right-4 bg-foreground-muted text-white text-xs font-medium px-2 py-1 rounded">
                        Coming Soon
                      </span>
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
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Cursorでツールを作る流れ
            </h2>
            <p className="text-foreground-muted">
              たった3ステップで、リード獲得ツールが完成します
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "要件を自然言語で伝える",
                description: "「従業員数を入力するとコスト削減額が出る計算機を作って」とComposerに入力",
                Icon: IconChat,
              },
              {
                step: "02",
                title: "Cursorが自動でコード生成",
                description: "AIがHTML/CSS/JSを自動生成。プレビューで確認しながら調整",
                Icon: IconLightning,
              },
              {
                step: "03",
                title: "LPに埋め込んで公開",
                description: "WordPressやSTUDIOのEmbed機能でペタッと貼るだけ",
                Icon: IconRocket,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-light rounded-xl mb-4">
                  <item.Icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-xs font-medium text-primary mb-2">STEP {item.step}</p>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground-muted text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            今すぐツールを試してみましょう
          </h2>
          <p className="text-foreground-muted mb-8">
            サンプルツールを触ってみて、Cursorで作れるイメージを掴んでください
          </p>
          <Link
            href="/tools/roi-simulator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
          >
            ROI計算機を試す
            <IconArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
