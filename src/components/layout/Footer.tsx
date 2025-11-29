import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-lg text-foreground">BtoB Tools</span>
            </div>
            <p className="text-sm text-foreground-muted">
              Cursorで爆速で作れるBtoB向けマーケティングツール集。
              <br />
              リード獲得を加速させましょう。
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">リンク</h3>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-foreground transition-colors">
                  ツール一覧
                </Link>
              </li>
              <li>
                <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                  Cursor
                </a>
              </li>
            </ul>
          </div>

          {/* Author */}
          <div>
            <h3 className="font-semibold text-foreground mb-4 text-sm">制作</h3>
            <p className="text-sm text-foreground-muted">
              この記事は「B2Bマーケティングアドベントカレンダー」の参加記事です。
            </p>
            <p className="text-sm text-foreground-muted mt-4">
              © {new Date().getFullYear()} BtoB Tools Demo
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
