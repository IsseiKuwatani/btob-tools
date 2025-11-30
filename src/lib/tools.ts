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
  isDemo?: boolean;
}

export type ToolCategory = 
  | "simulator"  // シミュレーター
  | "diagnostic" // 診断ツール
  | "calculator" // 計算ツール
  | "comparison" // 比較ツール
  | "conversion";// CVR向上施策

export const categoryLabels: Record<ToolCategory, string> = {
  simulator: "シミュレーター",
  diagnostic: "診断ツール",
  calculator: "計算ツール",
  comparison: "比較ツール",
  conversion: "CVR向上施策",
};

export const tools: Tool[] = [
  // CVR向上施策（デモ）
  {
    id: "7",
    slug: "gated-whitepaper",
    name: "ゲート付きホワイトペーパー",
    description: "途中まで無料で見せて、続きはメアド入力で解放。リード獲得率が劇的に向上します。",
    category: "conversion",
    iconName: "roi-simulator",
    features: ["途中でフォーム表示", "読了率トラッキング", "段階的な情報開示"],
    isNew: true,
    isDemo: true,
  },
  {
    id: "8",
    slug: "exit-popup",
    name: "離脱検知ポップアップ",
    description: "マウスが画面外に出た瞬間にポップアップ表示。離脱直前のユーザーをキャッチします。",
    category: "conversion",
    iconName: "plan-selector",
    features: ["離脱検知機能", "カスタマイズ可能", "コンバージョン率向上"],
    isNew: true,
    isDemo: true,
  },
  {
    id: "9",
    slug: "chat-form",
    name: "チャット形式フォーム",
    description: "対話形式で情報を収集。フォームっぽくないUIで入力完了率を大幅アップ。",
    category: "conversion",
    iconName: "security-check",
    features: ["会話形式UI", "ステップ入力", "離脱率低減"],
    isNew: true,
    isDemo: true,
  },
  // 表形式シミュレーション
  {
    id: "10",
    slug: "budget-simulator",
    name: "マーケティング予算配分シミュレーター",
    description: "チャネル別に予算を配分し、予想リード数・CPA・ROIを表形式で比較シミュレーションします。",
    category: "simulator",
    iconName: "dx-maturity",
    features: ["マルチチャネル対応", "表形式で一括比較", "最適配分の提案"],
    isNew: true,
  },
  {
    id: "11",
    slug: "annual-plan",
    name: "年間マーケティングプラン作成",
    description: "12ヶ月×5チャネルの表形式で年間計画を策定。目標達成率やギャップ分析まで一括管理します。",
    category: "simulator",
    iconName: "dx-maturity",
    features: ["月別・チャネル別入力", "四半期サマリー", "ギャップ分析"],
    isNew: true,
  },
  // 計算・シミュレーションツール
  {
    id: "1",
    slug: "roi-simulator",
    name: "SaaS導入ROI計算機",
    description: "従業員数と平均時給を入力すると、SaaS導入による年間コスト削減額を算出します。",
    category: "simulator",
    iconName: "roi-simulator",
    features: ["月間・年間の削減額算出", "グラフ可視化", "5年間の累計効果"],
  },
  {
    id: "2",
    slug: "dx-maturity",
    name: "DX成熟度診断",
    description: "5つの質問に答えるだけで、自社のDX成熟度をレーダーチャートで可視化します。",
    category: "diagnostic",
    iconName: "dx-maturity",
    features: ["5段階評価", "レーダーチャート", "改善提案付き"],
  },
  {
    id: "3",
    slug: "cost-comparison",
    name: "外注vs内製コスト比較",
    description: "プロジェクトを内製する場合と外注する場合の5年間TCOを比較します。",
    category: "comparison",
    iconName: "cost-calculator",
    features: ["詳細な費用項目", "5年間のTCO計算", "損益分岐点表示"],
  },
  {
    id: "4",
    slug: "cpa-simulator",
    name: "リード獲得CPAシミュレーター",
    description: "広告費とCV率から、リード獲得単価と必要予算を算出します。",
    category: "calculator",
    iconName: "roi-simulator",
    features: ["CPA自動計算", "目標達成に必要な予算", "CVR改善効果"],
  },
  {
    id: "5",
    slug: "sales-kpi",
    name: "営業KPI逆算計算機",
    description: "売上目標から必要なリード数・商談数を逆算します。",
    category: "calculator",
    iconName: "dx-maturity",
    features: ["ファネル別の必要数算出", "改善インパクト表示", "ボトルネック特定"],
  },
  {
    id: "6",
    slug: "lp-improvement",
    name: "LP改善効果シミュレーター",
    description: "CVR改善による売上インパクトをシミュレーションします。",
    category: "simulator",
    iconName: "plan-selector",
    features: ["改善前後の比較", "年間売上インパクト", "投資対効果の算出"],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter((tool) => tool.category === category);
}
