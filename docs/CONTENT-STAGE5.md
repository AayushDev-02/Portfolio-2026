# STAGE 5 — CONTENT BRIEF

Source material: `docs/source/resume-en.pdf`, `docs/source/shokumu-keirekisho-ja.pdf`,
`docs/source/rirekisho-ja.pdf`. Read all three before writing content.

**Japanese copy must be sourced from the 職務経歴書, not translated from the English.**
That document is Aayush's own professional Japanese, written for Japanese recruiters.
Translating the English resume instead produces copy that reads foreign. Lift and
adapt his phrasing; only write new Japanese where the section has no equivalent
in that document.

---

## 1. PRIVACY — read before touching `public/`

The three source PDFs are **not** equally publishable.

| Document | Contains | Publish? |
|---|---|---|
| `resume-en.pdf` | Name, phone, email, LinkedIn, GitHub | **Redacted version only** — strip the phone number |
| `shokumu-keirekisho-ja.pdf` | Name, email, work history | **Redacted version only** — rename off "Prodapt" |
| `rirekisho-ja.pdf` | **Home address, phone, date of birth, gender, nationality** | **NO. Never.** |

A 履歴書 is designed to be handed to one company. Putting one on a public URL
publishes Aayush's home address and phone number to every scraper on the
internet, permanently. It also does nothing for him — no recruiter finding him
through a portfolio needs a 履歴書 at first contact; they ask for it later.

**Rules:**
- `docs/source/` holds the originals and is **gitignored**. Nothing there is served.
- `public/documents/` holds only redacted, web-safe copies.
- The 履歴書 is offered "on request" through the contact form, never as a file.
- The filename `...Prodapt.pdf` names a company Aayush is currently interviewing
  with. It must not appear in a public URL.

---

## 2. Section mapping — reference shell, his content

| # | Reference | Becomes | Primitive reused |
|---|---|---|---|
| 00 | INTRO | **INTRO** | TerminalHero over the photo |
| 01 | PHILOSOPHY | **ABOUT** | AccordionRow + CheckList |
| 02 | STATUS | **EXPERIENCE** | TimelineCard grid |
| 03 | RESULTS | **SKILLS** | ⚠ see §4 — needs a design change |
| 04 | FEEDBACK | **PROJECTS** | AccordionRow + PullQuote |
| 05 | HISTORY | **CONTACT** | form (stage 6) + document downloads + links |

---

## 3. Content per section

### 00 — INTRO
- Wordmark: `AAYUSH YADAV` / `ヤダフ アーユシュ`
- Micro status line: `Software engineer — Tokyo, Japan` / `ソフトウェアエンジニア — 東京`
- Prompt line (the typewriter): a question the site answers, in the reference's
  voice. EN: something in the register of *"What have you actually shipped?"*
  JA: 「これまで何を作ってきたのか？」
- Footer caption: `[+] Available from December 2026` / `[+] 2026年12月より就業可能`
- Sigil: `AY`

### 01 — ABOUT (accordion rows)
Four rows, each expanding to a checklist. Draw from the 職務経歴書's
「活かせる経験・強み」 section, which already states these in his own words:

1. **What I work on** — RAG and LLM systems for Japanese public-sector and
   construction clients; retrieval pipelines, document extraction, and the
   production engineering around them.
2. **How I work** — requirements definition through design, build, test, release
   and maintenance; full-stack when the project needs it.
3. **Languages and context** — English and Hindi native, Japanese professional
   working proficiency (JLPT N3, Dec 2025); has run spec discussions in both
   English and Japanese on multicultural teams.
4. **What I'm looking for** — permanent in-house engineering role in Tokyo;
   full-stack, applied AI, or cloud. Available from December 2026.

### 02 — EXPERIENCE (timeline cards, `001`–`005`)
Five cards. The active one (`005`) takes the accent colour, matching the
reference's treatment of its in-progress card.

| # | Title | Period | Status |
|---|---|---|---|
| 001 | Hevonic.AI — Software Developer Intern (Remote, New York) | JUL 2023 – JAN 2024 | done |
| 002 | Human Resocia — Software Engineer Intern (Remote) | JAN – JUN 2024 | done |
| 003 | Japanese language training → relocation to Japan | JAN 2024 – JAN 2025 | done |
| 004 | Suntec — Frontend Engineer (Nagoya, via Human Resocia) | FEB – MAY 2025 | done |
| 005 | Pacific Consultants — Software Engineer (Tokyo, via Human Resocia) | JUN 2025 – PRESENT | **current** |

Each card's checklist: 3–4 items from the corresponding resume bullets.

### 03 — SKILLS
Categories, in this order. Content from the English resume's Technical Skills
block and the 職務経歴書's 技術スキル table — they agree.

AI & ML · Search & Retrieval · Languages · Backend · Frontend · Data ·
Cloud & DevOps · Databases · Certifications

Certifications: AWS Certified Cloud Practitioner (2023), JLPT N3 (2025),
Ethnus MERN Full Stack (2023).

### 04 — PROJECTS (accordion rows + pull quotes)
Six rows. Lead with the work that has numbers attached.

1. **Production RAG assistant** — Pacific Consultants. LangChain and LLMs over
   construction and tender documents. Sandbox to daily use in about two months;
   retrieval tuning took roughly **1,400 hours of manual document work off the
   year**. Pull quote: most of the accuracy work was retrieval, not prompting —
   chunking, hybrid search over pgvector, a reranking pass, measured against an
   eval set built from real user questions.
2. **AI presentation generator (MLIT)** — technical reports and scenario inputs
   into editable decks. Deck preparation went from days to under an hour.
3. **MapAI — Otaru & Kashiwa** — LLM-driven querying and visualisation of
   geospatial data. MapLibre/Mapbox, PostGIS on Azure and Neon, QGIS for prep.
   Built to address overtourism congestion.
4. **Tender PDF pipeline** — PyMuPDF and multithreading, region-aware structured
   output to CSV and Excel.
5. **ManiKani** — spaced-repetition learning SaaS. Next.js front, separate
   FastAPI service for the AI work, pgvector, Redis, Stripe, Docker, GH Actions.
6. **AI chat assistant** — token-level streaming, persistent multi-session
   history, per-user rate limiting. Streaming cut perceived response time ~40%.

### 05 — CONTACT
- Email: `yadavaayush02jp@gmail.com`
- GitHub: `github.com/AayushDev-02` · LinkedIn: `aayush-yadav-50ab55239`
- Location: Tokyo, Japan. Availability: from December 2026.
- **Documents** — bracket-button downloads:
  `[ RESUME — EN ↓ ]` and `[ 職務経歴書 — JA ↓ ]`
  Plus a line, not a button: 履歴書 available on request.
- Contact form itself is stage 6. Stage 5 leaves the markup slot for it.

---

## 4. The first real design divergence

**Section 03's rank bars do not survive the content swap.** The reference uses
them for poll results, where a percentage is a real measured number. Applied to
skills they become self-rated proficiency — "Python 88%" — which reads as
padding to any engineer reading the page, and is the single most common way a
junior portfolio undercuts itself.

Replace the `RankBar` list in SKILLS with a categorised hairline grid — reuse
`CheckList` in its two-column mode inside the `gap-px` grid the timeline already
uses. Keep `RankBar` in the codebase; it is likely useful later for real
measured numbers.

This is the first place the design stops matching the reference, and it is the
right call: the reference's shape was built for its content, not ours. More of
these will surface in later stages. Log each one in `DECISIONS.md`.
