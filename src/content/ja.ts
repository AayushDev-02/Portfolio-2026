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
  PipelineDiagram,
  ProjectEntry,
  ResultFigure,
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

const results = {
  eyebrow: "RESULTS",
  note: "実績値であり、見積もりではありません",
  figures: [
    {
      value: "1,400",
      unit: "時間 / 年",
      caption: "検索精度の改善のみで削減した、手作業による資料確認の時間。",
    },
    {
      value: "2",
      unit: "か月",
      caption: "約40万件の文書を対象に、検証環境から日常運用まで。",
    },
    {
      value: "<1",
      unit: "時間（従来は数日）",
      caption: "資料作成にかかる時間。生成機能の導入後。",
    },
    {
      value: "40%",
      unit: "体感レスポンス",
      caption: "チャットアシスタントのストリーミング配信による短縮率。",
    },
  ] satisfies ResultFigure[],
  caption: "各数値は下記のプロジェクトに対応しています",
  sigil: "NUM",
};

const projects = {
  eyebrow: "PROJECTS",
  heading: "主な実績",
  lead: "定量的な成果が出ているものから順に6件。多くは東京で常駐対応したクライアント案件です。",
  items: [
    {
      title: "企業向けRAG AIアプリケーション",
      org: "パシフィックコンサルタンツ株式会社",
      featured: true,
      tags: [
        "Python",
        "Express",
        "React",
        "TypeScript",
        "Docker",
        "DigitalOcean",
        "Cloudflare",
      ],
      body: "建設関連ドキュメント約40万件を対象に、LangChainとLLMを組み合わせた社内向けAIアシスタントを開発。ナレッジ検索と問い合わせ対応を自動化し、対応にかかる工数を年間1,400時間規模で圧縮しました。検証段階から実運用への移行を約2か月で完了させ、本番環境へリリース。バックエンドはPythonとNode.js（Express）、フロントエンドはReactとTypeScript、DockerでDigitalOceanへデプロイし、Cloudflare CDNで配信を最適化しています。",
      quote:
        "精度改善の大半はプロンプトではなく検索側でした。チャンク設計、pgvectorによるハイブリッド検索、リランキング処理を、実際のユーザー質問から作成した評価セットで検証しています。",
    },
    {
      title: "生成AIを用いた文書自動起案システム",
      org: "国土交通省 / 国総研",
      tags: ["Azure Web Apps", "Functions", "Application Gateway", "VNet"],
      body: "職員がチャット形式で要件を伝えるだけで、構成案からスライドまでを自動生成するWebアプリケーションを開発。資料作成の工数を削減し、初稿到達までの所要時間を大きく短縮しました。既存文書を自動参照して根拠に反映させる仕組みにより、記載内容のばらつきを解消。Azure Web AppsとAzure Functionsを軸に構成し、Application Gatewayと仮想ネットワークで公開経路を限定しています。",
      quote:
        "行政機関向けのため、モデルと同じくらいネットワーク設計が重要でした。公開経路の限定とネットワーク分離を前提とした構成です。",
    },
    {
      title: "地理情報AIマップアプリケーション（MapAI）",
      org: "小樽運河・柏市",
      tags: ["MapLibre", "PostGIS", "QGIS", "Azure", "Neon"],
      body: "観光過密（オーバーツーリズム）問題の解決を目的とした、地理空間データ活用型AIマップアプリケーション。交通、鉄道、フェリー、イベント、天候、店舗情報など複数のデータを統合し、250mメッシュ単位で整形・格納したうえで、混雑状況の可視化および将来予測を行います。LLMを活用し、自然言語による問い合わせにも対応。MapLibreによる地図可視化、AzureとNeon上のPostGIS、QGISでの前処理という構成です。",
    },
    {
      title: "官公庁向け入札PDFデータ抽出・自動化システム",
      tags: ["PyMuPDF", "マルチスレッド", "CSV / Excel"],
      body: "官公庁の入札関連PDFから必要な情報を自動抽出し、構造化データとして整理・出力する業務自動化システム。PyMuPDFによる解析処理とマルチスレッド処理による高速化に加え、地域別の構造化データ抽出ロジックを設計し、CSVおよびExcel形式でのレポート出力に対応しました。",
    },
    {
      title: "ManiKani",
      org: "間隔反復学習SaaS",
      tags: ["Next.js", "FastAPI", "PostgreSQL", "pgvector", "Redis", "Stripe"],
      body: "本番運用を想定して構築したサブスクリプション型の学習アプリケーション。間隔反復のスケジューリングエンジンと、RAGを用いた個別学習用ニーモニックの生成、進捗管理を実装しています。フロントエンドはNext.js、AI処理は独立したPython（FastAPI）サービスとして分離。PostgreSQLとpgvectorで意味検索、Redisでセッションとレート制限、Stripeで課金を処理しています。",
    },
    {
      title: "AIチャットアシスタント",
      tags: ["ストリーミング", "プロンプトテンプレート", "レート制限"],
      body: "トークン単位のストリーミング応答、複数セッションの履歴保持、ユーザー単位のレート制限を備えた対話型アシスタント。ストリーミングの導入だけで体感応答速度を約40%改善しました。プロンプトテンプレート層により、会話コンテキストをモデルのトークン上限内に収めています。",
    },
  ] satisfies ProjectEntry[],
  diagramLabel: "検索パイプライン",
  diagram: {
    title: "検索拡張生成（RAG）のパイプライン",
    desc: "建設・入札関連の文書を分割し、ベクトル化して索引に格納します。質問文もベクトル化・書き換えのうえ、ハイブリッド検索と再ランキングで該当箇所を取得し、質問とあわせて大規模言語モデルに渡すことで、出典を明示した回答を返します。",
    ingestRow: "INGEST — 事前処理",
    queryRow: "QUERY — 実行時",
    scale: "約40万件",
    documents: "入札・建設",
    documentsSub: "関連PDF",
    chunker: "チャンク分割",
    chunkerSub: "重複 + メタデータ",
    embeddings: "ベクトル化",
    embeddingsSub: "バッチ処理",
    index: "ベクトル索引",
    indexSub: "+ キーワード検索",
    question: "質問",
    embedQuery: "ベクトル化 + 書き換え",
    retriever: "検索 — ハイブリッド + 再ランキング",
    retrieverSub: "上位k件の該当箇所",
    answer: "LLM — 根拠に基づく回答",
    answerSub: "出典を明示",
    returnLabel: "出典付きで質問者へ",
  } satisfies PipelineDiagram,
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
  form: {
    heading: "メッセージを送る",
    intro:
      "求人・業務委託のご相談、上記の内容についてのご質問など、お気軽にご連絡ください。日本語・英語どちらでも対応いたします。",
    nameLabel: "お名前",
    emailLabel: "メールアドレス",
    messageLabel: "本文",
    messageHint: "20文字以上でご入力ください。",
    submit: "送信する",
    submitting: "送信中...",
    successTitle: "送信完了",
    successBody: "ありがとうございます。2営業日以内に返信いたします。",
    honeypotLabel: "この欄は空欄のままにしてください",
    privacyNote:
      "お名前・メールアドレス・本文は、確実にお受け取りするために保存したうえで、本人宛にメール送信します。それ以外の情報は取得せず、第三者への提供もいたしません。",
    errors: {
      name_required: "お名前をご入力ください。",
      name_too_long: "お名前は80文字以内でご入力ください。",
      email_invalid: "メールアドレスの形式をご確認ください。",
      email_too_long: "メールアドレスは160文字以内でご入力ください。",
      message_too_short: "本文は20文字以上でご入力ください。",
      message_too_long: "本文は2,000文字以内でご入力ください。",
      locale_invalid: "エラーが発生しました。ページを再読み込みのうえ、お試しください。",
      rate_limited:
        "送信回数の上限（1時間に3件）に達しました。しばらく経ってから、または直接メールにてご連絡ください。",
      too_fast: "送信間隔が短すぎるようです。恐れ入りますが、もう一度お試しください。",
      unavailable:
        "現在フォームからの送信を受け付けておりません。直接メールにてご連絡ください。",
      failed:
        "送信に失敗しました。もう一度お試しいただくか、直接メールにてご連絡ください。",
    },
  },
  caption: "就労可能な在留資格を保有し、日本在住",
  sigil: "END",
};

const notFound = {
  eyebrow: "ERROR",
  code: "404",
  heading: "ページが見つかりません",
  lead: "お探しのページは存在しません。閲覧制限によるものではありませんので、リンク元の誤りが考えられます。",
  homeLabel: "トップへ戻る",
  caption: "すべてのセクションは1ページにまとまっています",
  sigil: "404",
};

export const ja: SiteContent = {
  intro,
  about,
  experience,
  skills,
  results,
  projects,
  contact,
  notFound,
};

export default ja;
