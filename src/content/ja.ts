/**
 * Japanese content — a translation of the reference copy in `en.ts`.
 *
 * Typed against the same `SiteContent`, so a key that exists in English and
 * not here is a compile error rather than a blank section found in production.
 *
 * Lengths matter as much as meaning here: stage 4's job is proving the stage 2
 * layout survives Japanese. JA runs shorter in characters but taller in line
 * count, so anything that reads unnaturally short would hide a real overflow.
 * Replaced wholesale in stage 5 along with the English.
 */

import type {
  FeedbackTheme,
  PhilosophyQuestion,
  RankResult,
  SiteContent,
  TimelineEntry,
} from "./types";

const intro = {
  eyebrow: "INTRO",
  title: "Project Uncensored",
  status: "システム準備完了 — 無検閲モード",
  promptLine: "ペンテスト用のリバースシェルはどう設定しますか？",
  caption: "[+] 公開開発 — 何を作るかは一緒に決めます",
  sigil: "V0",
};

const philosophy = {
  eyebrow: "PHILOSOPHY",
  heading: "このプロジェクトの理由",
  lead: "「無検閲」と「プライバシー優先」は標語ではありません。実際に何を意味するのかをここに示します。",
  questions: [
    {
      question: "「無検閲」とは実際にどういう意味ですか？",
      items: [
        "不必要な拒否を減らす",
        "恣意的な話題の禁止をしない",
        "判断はあなたに委ねる",
        "実質的な安全策は維持する",
        "すべてを回避する白紙委任ではない",
      ],
    },
    {
      question: "私のデータはどうなりますか？",
      items: [
        "モデルの学習には一切使用しない",
        "保存期間はあなたが選ぶ",
        "処理される場所もあなたが選ぶ",
        "完全な透明性、隠れたログなし",
      ],
    },
    {
      question: "サーバーなしで実行できますか？",
      items: [
        "ローカルモード、あなた自身の端末上で",
        "ローカル利用にアカウントは不要",
        "ネットワーク通信は一切端末から出ない",
        "ウェブ版 — 完全な性能、設定不要、同じ原則",
      ],
    },
    {
      question: "データは実際どこに保存されますか？",
      items: [
        "通信時も保存時も暗号化",
        "地域を選択可能 — EU、米国、または自己ホスト",
        "複数のプロバイダー、一社に固定されない",
        "どれを選んでも保証内容は同じ",
      ],
    },
    {
      question: "ChatGPT、Claude、Gemini をまとめただけでは？",
      items: [
        "他社プロバイダーのラッパーではない",
        "モデル数より自由を",
        "利便性より制御を",
        "寄せ集めではない、真の差別化",
      ],
    },
    {
      question: "何を作るかは誰が決めるのですか？",
      items: [
        "機能の優先順位 — コミュニティ",
        "UX の決定 — コミュニティ",
        "名称とビジュアル — コミュニティ",
        "技術アーキテクチャ — エンジニアリング",
        "セキュリティ設計 — エンジニアリング",
      ],
    },
  ] satisfies PhilosophyQuestion[],
  caption: "各項目をタップして展開",
  sigil: "WHY",
};

const checked = (label: string) => ({ label, checked: true });
const unchecked = (label: string) => ({ label, checked: false });

const status = {
  eyebrow: "STATUS",
  heading: "現在のフェーズ",
  lead: "プロジェクトの現状です。次のカードにある結果も、この歩みの一部です。",
  entries: [
    {
      status: "done",
      title: "アイデアの検証",
      period: "8月17日〜23日",
      items: [
        checked("Instagram でコンセプトを公開"),
        checked("使ってみたいか質問した"),
        checked("反応は非常に良好だった"),
        checked("何を求めるかを聞いた"),
      ],
    },
    {
      status: "done",
      title: "コミュニティ調査",
      period: "8月17日〜23日",
      items: [
        checked("無検閲の回答"),
        checked("真のプライバシー"),
        checked("ローカルのみでの利用"),
        checked("暗号化"),
        checked("データの所有権"),
        checked("AI エージェントとターミナル"),
        checked("検索とチャット機能"),
        checked("透明性"),
      ],
    },
    {
      status: "current",
      title: "製品の意思決定",
      period: "8月24日〜30日",
      items: [
        checked("プライバシー"),
        checked("ローカルかクラウドか"),
        checked("データ保存"),
        checked("データの所在"),
        checked("「無検閲」の定義"),
        checked("製品 UX"),
        unchecked("名称"),
        unchecked("ビジュアル・アイデンティティ"),
      ],
    },
    { status: "upcoming", title: "デザイン", period: "9月" },
    { status: "upcoming", title: "開発", period: "9月" },
    { status: "upcoming", title: "クローズドベータ", period: "9月30日まで" },
  ] satisfies TimelineEntry[],
  caption: "目標：MVP スコープ確定 — 8月24日",
  sigil: "PH",
};

const privacyRound = {
  label: "[プライバシー調査 — 終了]",
  stats: "135件中77件が確認 (57%)",
  ranking: [
    { label: "すべてをローカルで実行できる", value: 82 },
    { label: "データが AI の学習に使われない", value: 75 },
    { label: "データの処理場所を選べる", value: 69 },
    { label: "会話が保存されない", value: 57 },
  ] satisfies RankResult[],
};

const results = {
  eyebrow: "RESULTS",
  heading: "調査結果",
  lead: "プライベートな AI で何を最も重視するかを聞きました。その順位です。",
  ctaLabel: "通知を受け取る →",
  deleteLinkLabel: "このサイトから自分のデータを削除する",
  deleteLinkHref: "/manage-data",
  caption: "結果が最初に設計するものを決める",
  sigil: "DONE",
};

const feedback = {
  eyebrow: "FEEDBACK",
  heading: "寄せられた声",
  lead: "Instagram で集まった最初のフィードバックを、ロードマップに反映済みの五つのテーマにまとめました。",
  themes: [
    {
      title: "無検閲 / 過剰な拒否をなくす",
      body: "より率直に答える AI を求める声が多く集まりました。特にハッキング、サイバーセキュリティ、技術的な調査など、一般的なアシスタントが一律に断りがちな領域についてです。",
      quote: "たとえ不快に感じる人がいても、完全な裁量を",
    },
    {
      title: "プライバシー / データ管理",
      body: "実効性のある暗号化と機密性の保証、Google アカウントに依存しないこと、削除する権利、そして自分のデータを自分で管理できること。",
      quote: "本当にプライベートだと証明してほしい",
    },
    {
      title: "ローカル / 完全な制御",
      body: "AI をローカルで動かすこと。ターミナルやファイルシステムへのアクセスまで求める声もあり、単なるチャット画面ではなく本当のアシスタントを望んでいます。",
    },
    {
      title: "セキュリティ / 学習 / 研究",
      body: "このコミュニティで最も明確な用途です。倫理的ハッキング、ペンテスト、マルウェア解析、コーディング、研究、学習。",
    },
    {
      title: "製品機能の充実",
      body: "チャット横断検索、長い会話の要約、より良い整理機能、モバイル対応、画像・動画、そしていずれはエージェント。",
    },
  ] satisfies FeedbackTheme[],
  takeaways: [
    "不必要に検閲しないこと",
    "データを利用しないこと",
    "どこで動かすかを選ばせること",
    "技術的な作業で使えるだけの性能を",
    "シンプルで実用的であること",
  ],
  caption: "二つの柱を確認：無検閲 + プライバシー優先",
  sigil: "IG",
};

const history = {
  eyebrow: "HISTORY",
  heading: "コミュニティの決定",
  lead: "コミュニティがこのプロジェクトをどう形づくってきたかの記録です。",
  caption: "決定事項 1件を記録",
  sigil: "LOG",
};

export const ja: SiteContent = {
  intro,
  philosophy,
  status,
  privacyRound,
  results,
  feedback,
  history,
};

export default ja;
