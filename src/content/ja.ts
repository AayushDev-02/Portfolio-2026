/**
 * Japanese content.
 *
 * Lifted and adapted from docs/source/shokumu-keirekisho-ja.pdf (gitignored) —
 * Aayush's own professional Japanese, written for Japanese recruiters. It is
 * NOT a translation of the English resume: translated copy reads foreign, and
 * this is the locale the job search actually depends on.
 *
 * Phrases carried over near-verbatim from that document include 「要件定義から
 * 設計・実装・テスト・運用保守まで一貫して」, 「技術領域を限定せず学習を重ねながら
 * 課題解決に取り組む」, 「日本語・英語での円滑な仕様調整」 and the 技術スキル
 * table's own category names. New Japanese was written only where the portfolio
 * has no equivalent section — the intro line, the availability copy, and the
 * contact section.
 *
 * Typed against the same SiteContent as en.ts, so a key present in English and
 * missing here is a compile error.
 */

import type {
  AccordionRowContent,
  ProjectEntry,
  SiteContent,
  SkillGroup,
  TimelineEntry,
} from "./types";

const intro = {
  eyebrow: "INTRO",
  // His own spelling, from the 職務経歴書. Note this renders in the gothic
  // fallback, not Silkscreen — the pixel face has no CJK glyphs — so the JA
  // wordmark reads visibly differently from the English one. Deliberate, per
  // the brief, but worth a look before launch.
  title: "ヤダフ アーユシュ",
  status: "ソフトウェアエンジニア — 東京",
  promptLine: "これまで何を作ってきたのか？",
  caption: "[+] 2026年12月より就業可能",
  sigil: "AY",
};

const about = {
  eyebrow: "ABOUT",
  heading: "自己紹介",
  lead: "建設・公共分野のDX案件を担当するソフトウェアエンジニア。生成AIを実務に落とし込み、要件定義から運用保守まで一貫して従事しています。",
  rows: [
    {
      question: "担当している領域",
      items: [
        "LangChainとLLMを用いたRAG基盤の設計・構築",
        "検索基盤の最適化（チャンク設計・ハイブリッド検索・リランキング）",
        "建設・入札関連ドキュメントからの情報抽出",
        "地理空間データを扱うアプリケーションと地図可視化",
        "Python・TypeScriptを中心とした開発",
      ],
    },
    {
      question: "働き方",
      items: [
        "要件定義から設計・構築・テスト・開発・保守・運用まで一貫して担当",
        "システム全体の構造を捉えた設計・実装",
        "技術領域を限定せず学習を重ねながら課題解決に取り組む",
        "クライアントとの打ち合わせ（日本語）",
        "4〜6名規模のアジャイルチーム",
      ],
    },
    {
      question: "語学と環境",
      items: [
        "英語 — ネイティブ",
        "ヒンディー語 — ネイティブ",
        "日本語 — ビジネスレベル（JLPT N3、2025年12月取得）",
        "日本語・英語での円滑な仕様調整",
        "多文化チームでのプロジェクト推進経験",
      ],
    },
    {
      question: "希望する働き方",
      items: [
        "東京での自社開発エンジニア職（正社員）",
        "フルスタック、応用AI、またはクラウド領域",
        "2026年12月より就業可能",
        "就労可能な在留資格を保有し、日本在住",
      ],
    },
  ] satisfies AccordionRowContent[],
  caption: "各項目をタップして展開",
  sigil: "WHO",
};

const checked = (label: string) => ({ label, checked: true });

const experience = {
  eyebrow: "EXPERIENCE",
  heading: "職務経歴",
  lead: "リモートでのインターンから、日本の公共・建設分野の案件を常駐で担当するまで、約3年の歩みです。",
  entries: [
    {
      status: "done",
      title: "ヘボニックAI株式会社 — ソフトウェア開発インターン",
      period: "2023年7月〜2024年1月",
      items: [
        checked("AIを活用した面接練習・履歴書生成Webアプリの新規開発"),
        checked("フロントエンド開発（担当比率 約70%）"),
        checked("OpenAI APIを用いた質問生成・フィードバック機能の開発"),
        checked("Next.js、MongoDB、Redis、AWS"),
      ],
    },
    {
      status: "done",
      title: "ヒューマンリソシア株式会社 — ソフトウェアエンジニアインターン",
      period: "2024年1月〜6月",
      items: [
        checked("Web帳票発行パッケージ（Xreport）の拡張機能開発"),
        checked("フロントエンド開発（担当比率 約60%）"),
        checked("バックエンド開発（担当比率 約40%）— 帳票生成テンプレート"),
        checked("React、Django、Node.js、SQL"),
      ],
    },
    {
      status: "done",
      title: "日本語研修 → 来日",
      period: "2024年1月〜2025年1月",
      items: [
        checked("インターン業務と並行、インドよりリモートで受講"),
        checked("就労可能な在留資格を取得し来日"),
        checked("日本語能力試験（JLPT）N3取得（2025年12月）"),
      ],
    },
    {
      status: "done",
      title: "株式会社サンテック — フロントエンドエンジニア",
      period: "2025年2月〜5月",
      items: [
        checked("ドライバーサービス管理システムの新規開発（名古屋・常駐）"),
        checked("フロントエンド開発（担当比率 100%）"),
        checked("Apache EChartsを用いたグラフ可視化機能の実装"),
        checked("AWS Amplify・S3を用いたファイル連携機能の実装"),
      ],
    },
    {
      status: "current",
      title: "パシフィックコンサルタンツ株式会社 — ソフトウェアエンジニア",
      period: "2025年6月〜現在",
      items: [
        checked("建設・公共分野のDX案件を担当（東京・常駐）"),
        checked("社内初となる本番運用のRAG AIアシスタントを構築"),
        checked("要件定義から設計・実装・テスト・運用保守まで一貫して従事"),
        checked("クライアントとの打ち合わせ（日本語）"),
      ],
    },
  ] satisfies TimelineEntry[],
  caption: "ヒューマンリソシアより常用型派遣として常駐",
  sigil: "EXP",
};

const skills = {
  eyebrow: "SKILLS",
  heading: "技術スキル",
  lead: "実務で使用した技術を用途別に整理しています。自己評価の割合は記載していません。根拠はプロジェクトにあります。",
  groups: [
    {
      name: "AI / 機械学習",
      items: [
        "RAG（検索拡張生成）",
        "大規模言語モデル（LLM）",
        "LangChain",
        "OpenAI API",
        "Hugging Face Transformers",
        "PyTorch",
        "プロンプト設計",
        "チャンク設計・リランキング",
        "検索精度の評価",
        "OCRパイプライン",
        "ローカルLLMの運用",
      ],
    },
    {
      name: "LLM & Search",
      items: [
        "pgvector",
        "Pinecone",
        "FAISS",
        "embeddings",
        "vector search",
        "semantic search",
        "検索基盤の最適化",
      ],
    },
    {
      name: "開発言語",
      items: ["Python", "TypeScript", "JavaScript", "SQL", "Bash", "C++", "Java"],
    },
    {
      name: "バックエンド",
      items: [
        "FastAPI",
        "Node.js",
        "Express.js",
        "Django",
        "Flask",
        "Spring Boot",
        "REST API",
        "非同期・マルチスレッド処理",
      ],
    },
    {
      name: "フロントエンド",
      items: ["React", "Next.js", "Vue.js", "Vite", "Tailwind CSS"],
    },
    {
      name: "データ分析・可視化",
      items: [
        "pandas",
        "NumPy",
        "Matplotlib",
        "Jupyter Notebook",
        "PyMuPDF",
        "PostGIS",
        "QGIS",
        "MapLibre",
        "Apache ECharts",
      ],
    },
    {
      name: "クラウド / DevOps",
      items: [
        "AWS",
        "Microsoft Azure",
        "Docker",
        "GitHub Actions",
        "CI/CD",
        "DigitalOcean",
        "Vercel",
        "Cloudflare",
      ],
    },
    {
      name: "データベース",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    },
    {
      name: "保有資格",
      items: [
        "AWS認定クラウドプラクティショナー（2023年3月）",
        "日本語能力試験（JLPT）N3（2025年12月）",
        "Ethnus MERNフルスタック認定（2023年7月）",
      ],
    },
  ] satisfies SkillGroup[],
  caption: "根拠は割合ではなくプロジェクトにあります",
  sigil: "SKL",
};

const projects = {
  eyebrow: "PROJECTS",
  heading: "主な実績",
  lead: "定量的な成果が出ているものから順に6件。多くは東京で常駐対応したクライアント案件です。",
  items: [
    {
      title: "企業向けRAG AIアプリケーション — パシフィックコンサルタンツ",
      body: "建設関連ドキュメント約40万件を対象に、LangChainとLLMを組み合わせた社内向けAIアシスタントを開発。ナレッジ検索と問い合わせ対応を自動化し、対応にかかる工数を年間1,400時間規模で圧縮しました。検証段階から実運用への移行を約2か月で完了させ、本番環境へリリース。バックエンドはPythonとNode.js（Express）、フロントエンドはReactとTypeScript、DockerでDigitalOceanへデプロイし、Cloudflare CDNで配信を最適化しています。",
      quote:
        "精度改善の大半はプロンプトではなく検索側でした。チャンク設計、pgvectorによるハイブリッド検索、リランキング処理を、実際のユーザー質問から作成した評価セットで検証しています。",
    },
    {
      title: "生成AIを用いた文書自動起案システム — 国総研",
      body: "職員がチャット形式で要件を伝えるだけで、構成案からスライドまでを自動生成するWebアプリケーションを開発。資料作成の工数を削減し、初稿到達までの所要時間を大きく短縮しました。既存文書を自動参照して根拠に反映させる仕組みにより、記載内容のばらつきを解消。Azure Web AppsとAzure Functionsを軸に構成し、Application Gatewayと仮想ネットワークで公開経路を限定しています。",
      quote:
        "行政機関向けのため、モデルと同じくらいネットワーク設計が重要でした。公開経路の限定とネットワーク分離を前提とした構成です。",
    },
    {
      title: "地理情報AIマップアプリケーション（MapAI） — 小樽運河・柏市",
      body: "観光過密（オーバーツーリズム）問題の解決を目的とした、地理空間データ活用型AIマップアプリケーション。交通、鉄道、フェリー、イベント、天候、店舗情報など複数のデータを統合し、250mメッシュ単位で整形・格納したうえで、混雑状況の可視化および将来予測を行います。LLMを活用し、自然言語による問い合わせにも対応。MapLibreによる地図可視化、AzureとNeon上のPostGIS、QGISでの前処理という構成です。",
    },
    {
      title: "官公庁向け入札PDFデータ抽出・自動化システム",
      body: "官公庁の入札関連PDFから必要な情報を自動抽出し、構造化データとして整理・出力する業務自動化システム。PyMuPDFによる解析処理とマルチスレッド処理による高速化に加え、地域別の構造化データ抽出ロジックを設計し、CSVおよびExcel形式でのレポート出力に対応しました。",
    },
    {
      title: "ManiKani — 間隔反復学習SaaS",
      body: "本番運用を想定して構築したサブスクリプション型の学習アプリケーション。間隔反復のスケジューリングエンジンと、RAGを用いた個別学習用ニーモニックの生成、進捗管理を実装しています。フロントエンドはNext.js、AI処理は独立したPython（FastAPI）サービスとして分離。PostgreSQLとpgvectorで意味検索、Redisでセッションとレート制限、Stripeで課金を処理しています。",
    },
    {
      title: "AIチャットアシスタント",
      body: "トークン単位のストリーミング応答、複数セッションの履歴保持、ユーザー単位のレート制限を備えた対話型アシスタント。ストリーミングの導入だけで体感応答速度を約40%改善しました。プロンプトテンプレート層により、会話コンテキストをモデルのトークン上限内に収めています。",
    },
  ] satisfies ProjectEntry[],
  caption: "記載の数値は実際に納品した案件の実績です",
  sigil: "WRK",
};

const contact = {
  eyebrow: "CONTACT",
  heading: "お問い合わせ",
  lead: "2026年12月より、東京での自社開発エンジニア職（正社員）を希望しています。",
  email: "yadavaayush02jp@gmail.com",
  links: [
    {
      label: "GitHub",
      href: "https://github.com/AayushDev-02",
      display: "github.com/AayushDev-02",
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/aayush-yadav-50ab55239",
      display: "linkedin.com/in/aayush-yadav-50ab55239",
    },
  ],
  locationLabel: "所在地",
  location: "東京都",
  availabilityLabel: "就業可能時期",
  availability: "2026年12月より",
  documentsLabel: "提出書類",
  documents: [],
  documentsNote:
    "履歴書・職務経歴書は、ご請求いただければお送りいたします。英文レジュメもご用意しています。",
  caption: "就労可能な在留資格を保有し、日本在住",
  sigil: "END",
};

export const ja: SiteContent = {
  intro,
  about,
  experience,
  skills,
  projects,
  contact,
};

export default ja;
