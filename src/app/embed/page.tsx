"use client";

import Link from "next/link";

const embedTools = [
  {
    name: "料金シミュレーター",
    slug: "pricing-calculator",
    description: "プラン選択と利用規模に応じた月額料金を自動計算",
  },
  {
    name: "お問い合わせフォーム",
    slug: "contact-form",
    description: "リード獲得用のスタイリッシュなフォーム",
  },
  {
    name: "プラン診断ツール",
    slug: "plan-diagnosis",
    description: "3つの質問で最適なプランをおすすめ",
  },
  {
    name: "ROI計算機",
    slug: "roi-calculator",
    description: "投資対効果を可視化するシンプルな計算機",
  },
  {
    name: "見積もりジェネレーター",
    slug: "quote-generator",
    description: "サービスを選んでカスタム見積もりを即座に作成",
  },
  {
    name: "マーケティング課題診断",
    slug: "problem-diagnosis",
    description: "5つの質問であなたのマーケティング課題を診断",
  },
  {
    name: "コスト削減シミュレーター",
    slug: "cost-simulator",
    description: "現在のコストから削減可能額をシミュレーション",
  },
  {
    name: "サービス適合度チェッカー",
    slug: "service-fit",
    description: "あなたに最適なプランを適合度で診断",
  },
];

export default function EmbedIndexPage() {
  return (
    <div className="min-h-screen bg-[#f5f7fa] py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-3">
            Embed Tools
          </h1>
          <p className="text-[#5c5c7a]">
            STUDIO・Wix・WordPressなど、iframeで埋め込み可能なツール
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {embedTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/embed/${tool.slug}`}
              className="group block"
            >
              <div className="bg-white p-5 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                <h3 className="text-base font-semibold text-[#1a1a2e] mb-1 group-hover:text-[#2563eb] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-[#5c5c7a]">
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-white p-5 rounded-lg shadow-sm">
          <h2 className="text-sm font-semibold text-[#1a1a2e] mb-3">
            埋め込み方法
          </h2>
          <p className="text-sm text-[#5c5c7a] mb-3">
            以下のコードをSTUDIOやWix、WordPressに貼り付けてください：
          </p>
          <code className="block bg-[#f5f7fa] text-[#1a1a2e] text-sm p-4 rounded-lg overflow-x-auto font-mono">
            {`<iframe src="https://your-domain.com/embed/pricing-calculator" width="100%" height="600" frameborder="0"></iframe>`}
          </code>
        </div>
      </div>
    </div>
  );
}
