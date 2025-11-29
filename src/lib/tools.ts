export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ToolCategory;
  iconName: string;
  features: string[];
  isNew?: boolean;
  comingSoon?: boolean;
}

export type ToolCategory = 
  | "simulator"  // シミュレーター
  | "diagnostic" // 診断ツール
  | "calculator" // 計算ツール
  | "comparison" // 比較ツール
  | "checklist"; // チェックリスト

export const categoryLabels: Record<ToolCategory, string> = {
  simulator: "シミュレーター",
  diagnostic: "診断ツール",
  calculator: "計算ツール",
  comparison: "比較ツール",
  checklist: "チェックリスト",
};

export const tools: Tool[] = [
  {
    id: "1",
    slug: "roi-simulator",
    name: "SaaS導入ROI計算機",
    description: "従業員数と平均時給を入力すると、SaaS導入による年間コスト削減額を算出します。",
    category: "simulator",
    iconName: "roi-simulator",
    features: ["月間・年間の削減額算出", "グラフ可視化", "5年間の累計効果"],
    isNew: true,
  },
  {
    id: "2",
    slug: "dx-maturity",
    name: "DX成熟度診断",
    description: "5つの質問に答えるだけで、自社のDX成熟度をレーダーチャートで可視化します。",
    category: "diagnostic",
    iconName: "dx-maturity",
    features: ["5段階評価", "レーダーチャート", "改善提案付き"],
    isNew: true,
  },
  {
    id: "3",
    slug: "cost-comparison",
    name: "外注vs内製コスト比較",
    description: "プロジェクトを内製する場合と外注する場合の5年間TCOを比較します。",
    category: "comparison",
    iconName: "cost-calculator",
    features: ["詳細な費用項目", "5年間のTCO計算", "損益分岐点表示"],
    isNew: true,
  },
  {
    id: "4",
    slug: "cpa-simulator",
    name: "リード獲得CPAシミュレーター",
    description: "広告費とCV率から、リード獲得単価と必要予算を算出します。",
    category: "calculator",
    iconName: "roi-simulator",
    features: ["CPA自動計算", "目標達成に必要な予算", "チャネル別比較"],
    isNew: true,
  },
  {
    id: "5",
    slug: "sales-kpi",
    name: "営業KPI逆算計算機",
    description: "売上目標から必要なリード数・商談数を逆算します。",
    category: "calculator",
    iconName: "dx-maturity",
    features: ["ファネル別の必要数算出", "改善インパクト表示", "ボトルネック特定"],
    isNew: true,
  },
  {
    id: "6",
    slug: "lp-improvement",
    name: "LP改善効果シミュレーター",
    description: "CVR改善による売上インパクトをシミュレーションします。",
    category: "simulator",
    iconName: "plan-selector",
    features: ["改善前後の比較", "年間売上インパクト", "投資対効果の算出"],
    isNew: true,
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category);
}
