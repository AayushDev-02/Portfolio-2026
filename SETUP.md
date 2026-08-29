# Stage 0 — remaining manual steps

Everything below needs your accounts or your machine. Fifteen minutes, once.

## 1. Install and verify (5 min)

```bash
cd "C:\Users\yadav\OneDrive\Desktop\Portfolio 2026"
pnpm install
pnpm dev
```

Open http://localhost:3000 and http://localhost:3000/dev/kitchen-sink

**What you're checking:** the kitchen sink page renders every primitive, the
pixel font shows on the headings, and the Japanese sample line in the
Typography bay uses a different face with looser leading than the English one.

## 2. Git + GitHub (5 min)

Make the repo **public** — a hiring manager reading your commit history is a
feature, not a risk.

```bash
git init
git add .
git commit -m "stage0: foundation — Next.js 15, Tailwind v4, design tokens, primitives"
git branch -M main
gh repo create portfolio-2026 --public --source=. --push
```

No `gh` CLI? Create the repo on github.com, then:

```bash
git remote add origin https://github.com/<you>/portfolio-2026.git
git push -u origin main
```

## 3. Vercel (5 min)

1. vercel.com → **Add New → Project** → import `portfolio-2026`
2. Framework preset: Next.js. Everything else: defaults. **Deploy.**
3. Copy the `.vercel.app` URL into `docs/PROGRESS.md`.

Leave environment variables empty for now — nothing needs them until stage 6.
`.env.example` lists what will be needed then, and `SETUP-STAGE6.md` walks
through creating the three accounts when you get there.

## 4. Tick it off

Open `docs/PROGRESS.md`, check the Stage 0 boxes, add a line to the session log.

---

## If something breaks

**`pnpm install` fails on a version** — the version ranges in `package.json` are
caret ranges, so they resolve forward. If Next 16 has landed and you want it,
`pnpm add next@latest react@latest react-dom@latest` and re-run `pnpm dev`.

**Biome schema error** — `pnpm dlx @biomejs/biome migrate --write`

**A Tailwind class does nothing** — check it's derived from a token in the
`@theme` block of `src/app/globals.css`. In v4 there is no `tailwind.config.js`;
the CSS file *is* the config.

**Silkscreen font doesn't load** — it's fetched from Google Fonts at build time,
so the first `pnpm dev` needs network. It self-hosts after that.
