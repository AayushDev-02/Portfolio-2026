/**
 * English content. Sourced from docs/source/resume-en.pdf (gitignored).
 *
 * Numbers here are the ones Aayush's own documents state — the 1,400 hours and
 * the two-month sandbox-to-production window appear in both the English resume
 * and the 職務経歴書. Nothing is inflated to fill a layout.
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
  title: "Aayush Yadav",
  status: "Software engineer — Tokyo, Japan",
  promptLine: "What have you actually shipped?",
  caption: "[+] Available from December 2026",
  sigil: "AY",
};

const about = {
  eyebrow: "ABOUT",
  heading: "About",
  lead: "AI-focused software engineer in Tokyo. Two years building RAG and LLM systems for Japanese public-sector and construction clients.",
  rows: [
    {
      question: "What I work on",
      items: [
        "RAG and LLM systems in production, not demos",
        "Retrieval pipelines — chunking, hybrid search, reranking",
        "Document extraction from construction and tender PDFs",
        "Geospatial data applications and map visualisation",
        "Mostly Python and TypeScript",
      ],
    },
    {
      question: "How I work",
      items: [
        "Requirements definition through design, build and test",
        "Release and maintenance — including whatever breaks after launch",
        "Full-stack when the project needs it",
        "Working directly with client stakeholders",
        "Agile teams of four to six",
      ],
    },
    {
      question: "Languages and context",
      items: [
        "English — native",
        "Hindi — native",
        "Japanese — professional working proficiency (JLPT N3, Dec 2025)",
        "Spec discussions run in both English and Japanese",
        "Multicultural teams, on-site with Japanese clients",
      ],
    },
    {
      question: "What I'm looking for",
      items: [
        "Permanent in-house engineering role in Tokyo",
        "Full-stack, applied AI, or cloud",
        "Available from December 2026",
        "Currently in Japan on a valid work visa",
      ],
    },
  ] satisfies AccordionRowContent[],
  caption: "TAP EACH ROW TO EXPAND",
  sigil: "WHO",
};

const checked = (label: string) => ({ label, checked: true });

const experience = {
  eyebrow: "EXPERIENCE",
  heading: "Experience",
  lead: "From a remote internship to on-site delivery for Japanese public-sector clients, in about three years.",
  entries: [
    {
      status: "done",
      title: "Hevonic.AI — Software Developer Intern",
      period: "JUL 2023 – JAN 2024",
      items: [
        checked("AI interview preparation platform, used at NYU"),
        checked("Built the cover letter and resume generator end to end"),
        checked("Caching, SEO and image work to cut page loads"),
        checked("Next.js, Redis, MongoDB, AWS"),
      ],
    },
    {
      status: "done",
      title: "Human Resocia — Software Engineer Intern",
      period: "JAN – JUN 2024",
      items: [
        checked("Xreport invoice and reporting package, feature extension"),
        checked("Frontend ~60%: plan management, dashboards, auth"),
        checked("Backend ~40%: Excel and PDF report generation"),
        checked("React, Django, Node.js, MySQL"),
      ],
    },
    {
      status: "done",
      title: "Japanese language training → relocation to Japan",
      period: "JAN 2024 – JAN 2025",
      items: [
        checked("Run in parallel with the internship, remote from India"),
        checked("Relocated to Japan on a work visa"),
        checked("JLPT N3 (Dec 2025)"),
      ],
    },
    {
      status: "done",
      title: "Suntec — Frontend Engineer",
      period: "FEB – MAY 2025",
      items: [
        checked("Fleet and vehicle data platform, on-site Nagoya"),
        checked("Driver and operator modules, auth flows, dashboards"),
        checked("Real-time vehicle views in Apache ECharts"),
        checked("Video playback and file transfer over AWS Amplify and S3"),
      ],
    },
    {
      status: "current",
      title: "Pacific Consultants — Software Engineer",
      period: "JUN 2025 – PRESENT",
      items: [
        checked("DX projects for construction and public infrastructure"),
        checked("Built the team's first production RAG assistant"),
        checked("Requirements definition through to maintenance"),
        checked("Client meetings conducted in Japanese"),
      ],
    },
  ] satisfies TimelineEntry[],
  caption: "VIA HUMAN RESOCIA — ON-SITE AT CLIENT PROJECTS",
  sigil: "EXP",
};

const skills = {
  eyebrow: "SKILLS",
  heading: "Skills",
  lead: "What I have shipped with, grouped by what it is for. No self-rated percentages — the projects are the evidence.",
  groups: [
    {
      name: "AI & Machine Learning",
      items: [
        "Retrieval-Augmented Generation",
        "Large language models",
        "LangChain",
        "OpenAI API",
        "Prompt engineering",
        "Function calling and tool use",
        "Embeddings",
        "Chunking and reranking",
        "Retrieval evaluation",
        "OCR pipelines",
        "Self-hosted and local models",
      ],
    },
    {
      name: "Search & Retrieval",
      items: [
        "pgvector",
        "Vector search",
        "Semantic and hybrid search",
        "Index tuning",
        "Retrieval pipeline optimisation",
      ],
    },
    {
      name: "Languages",
      items: ["Python", "TypeScript", "JavaScript", "SQL", "Bash", "C++", "Java"],
    },
    {
      name: "Backend",
      items: [
        "FastAPI",
        "Node.js",
        "Express.js",
        "Django",
        "Flask",
        "Spring Boot",
        "REST APIs",
        "Async and multithreaded processing",
      ],
    },
    {
      name: "Frontend",
      items: ["React", "Next.js", "Vue.js", "Vite", "Tailwind CSS"],
    },
    {
      name: "Data",
      items: [
        "pandas",
        "NumPy",
        "PyMuPDF",
        "PostGIS",
        "QGIS",
        "Mapbox",
        "MapLibre",
        "Apache ECharts",
      ],
    },
    {
      name: "Cloud & DevOps",
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
      name: "Databases",
      items: ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
    },
    {
      name: "Certifications",
      items: [
        "AWS Certified Cloud Practitioner (2023)",
        "JLPT N3 (2025)",
        "Ethnus MERN Full Stack (2023)",
      ],
    },
  ] satisfies SkillGroup[],
  caption: "EVIDENCE IS IN THE PROJECTS, NOT A PERCENTAGE",
  sigil: "SKL",
};

const results = {
  eyebrow: "RESULTS",
  note: "From delivered work, not estimates",
  figures: [
    {
      value: "1,400",
      unit: "hours / year",
      caption: "of manual document work removed by retrieval tuning alone.",
    },
    {
      value: "2",
      unit: "months",
      caption: "from sandbox to daily production use, over ~400,000 documents.",
    },
    {
      value: "<1",
      unit: "hour, was days",
      caption: "to prepare a deck, once the generator was in.",
    },
    {
      value: "40%",
      unit: "latency, perceived",
      caption: "cut by token-level streaming in the chat assistant.",
    },
  ] satisfies ResultFigure[],
  caption: "[+] EACH FIGURE IS TRACEABLE TO A PROJECT BELOW",
  sigil: "NUM",
};

const projects = {
  eyebrow: "PROJECTS",
  heading: "Projects",
  lead: "Six builds, led by the ones with numbers attached. Most are client work delivered on-site in Tokyo.",
  items: [
    {
      title: "Production RAG assistant",
      org: "Pacific Consultants 株式会社",
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
      body: "LangChain and LLMs over roughly 400,000 construction and tender documents, covering search, summarisation and Q&A. Out of the sandbox and into daily use in about two months; retrieval tuning alone took roughly 1,400 hours of manual document work off the year. Python and Express behind it, React and TypeScript in front, Docker out to DigitalOcean with Cloudflare ahead of it.",
      quote:
        "Most of the accuracy work turned out to be retrieval, not prompting — chunking strategy, hybrid search over pgvector, and a reranking pass, measured against an eval set built from real user questions.",
    },
    {
      title: "AI presentation generator",
      org: "MLIT / 国総研",
      tags: ["Azure Web Apps", "Functions", "Application Gateway", "VNet"],
      body: "Staff describe what they need in a chat, and the system assembles an outline, body text and slides. Deck preparation went from days to under an hour. Existing documents are referenced automatically so the substance stays consistent between authors. Azure Web Apps and Functions, with Application Gateway and a virtual network restricting the public route.",
      quote:
        "Delivered to a government body, so the network design mattered as much as the model — a limited public route and network isolation, not just an endpoint.",
    },
    {
      title: "MapAI",
      org: "Otaru Canal · Kashiwa City",
      tags: ["MapLibre", "PostGIS", "QGIS", "Azure", "Neon"],
      body: "LLM-driven querying and visualisation of geospatial data, built to address overtourism congestion. Transit, rail, ferry, event, weather and retail data merged and normalised into 250m mesh cells, with congestion forecasting on top. MapLibre for the map, PostGIS on Azure and Neon, QGIS for preparation.",
    },
    {
      title: "Tender PDF extraction pipeline",
      tags: ["PyMuPDF", "Multithreaded", "CSV / Excel"],
      body: "Automated extraction from government tender PDFs into structured CSV and Excel. PyMuPDF for parsing, multithreading for throughput, and region-aware rules for the long tail of format differences between prefectures.",
    },
    {
      title: "ManiKani",
      org: "Spaced-repetition learning SaaS",
      tags: ["Next.js", "FastAPI", "PostgreSQL", "pgvector", "Redis", "Stripe"],
      body: "A subscription learning app built to production standards: a scheduling engine, RAG-backed generation of personalised mnemonics, and progress tracking. Next.js on the front with a separate FastAPI service doing the AI work, PostgreSQL and pgvector for retrieval, Redis for sessions and rate limiting, Stripe for billing.",
    },
    {
      title: "AI chat assistant",
      tags: ["Streaming", "Prompt templates", "Rate limiting"],
      body: "Conversational assistant with token-level streaming, persistent multi-session history and per-user rate limiting. Streaming alone cut perceived response time by around 40 percent. A prompt-template layer keeps conversation context inside the model's token budget.",
    },
  ] satisfies ProjectEntry[],
  diagramLabel: "Retrieval pipeline",
  diagram: {
    title: "Retrieval-augmented generation pipeline",
    desc: "Construction and tender documents are chunked, embedded and stored in a vector index. A question is embedded and rewritten, matched against that index by hybrid search with a reranking pass, and the retrieved passages are passed with the question to a large language model, which returns an answer citing the source documents.",
    ingestRow: "INGEST — OFFLINE",
    queryRow: "QUERY — LIVE",
    scale: "~400k docs",
    documents: "Tender +",
    documentsSub: "construction PDFs",
    chunker: "Chunker",
    chunkerSub: "overlap + metadata",
    embeddings: "Embeddings",
    embeddingsSub: "batch",
    index: "Vector index",
    indexSub: "+ keyword field",
    question: "Question",
    embedQuery: "Embed + rewrite",
    retriever: "Retriever — hybrid + rerank",
    retrieverSub: "top-k passages",
    answer: "LLM — grounded answer",
    answerSub: "cites source documents",
    returnLabel: "back to the asker, with citations",
  } satisfies PipelineDiagram,
  caption: "NUMBERS ARE FROM DELIVERED WORK, NOT ESTIMATES",
  sigil: "WRK",
};

const contact = {
  eyebrow: "CONTACT",
  heading: "Contact",
  lead: "Open to permanent in-house engineering roles in Tokyo from December 2026.",
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
  locationLabel: "Location",
  location: "Tokyo, Japan",
  availabilityLabel: "Available",
  availability: "From December 2026",
  documentsLabel: "Documents",
  documents: [],
  documentsNote:
    "Resume and 職務経歴書 available on request, along with a 履歴書 if your process needs one.",
  form: {
    heading: "Send a message",
    intro:
      "For a role, a contract, or a question about anything above. I read every message and reply in English or Japanese.",
    nameLabel: "Name",
    emailLabel: "Email",
    messageLabel: "Message",
    messageHint: "At least 20 characters.",
    submit: "SEND MESSAGE",
    submitting: "SENDING...",
    successTitle: "MESSAGE RECEIVED",
    successBody:
      "Thank you — it is in my inbox. I usually reply within two working days.",
    honeypotLabel: "Leave this field empty",
    privacyNote:
      "Your name, address and message are stored so nothing gets lost, and sent to me by email. Nothing else is collected and nothing is shared.",
    errors: {
      name_required: "Please enter your name.",
      name_too_long: "That name is longer than 80 characters.",
      email_invalid: "That does not look like an email address.",
      email_too_long: "That address is longer than 160 characters.",
      message_too_short: "Please write at least 20 characters.",
      message_too_long: "That message is longer than 2,000 characters — please trim it.",
      locale_invalid: "Something went wrong. Please reload the page and try again.",
      rate_limited:
        "Three messages an hour is the limit. Please try again later, or email me directly.",
      too_fast: "That was submitted unusually fast. Please try once more.",
      unavailable:
        "The form is not accepting messages right now. Please email me directly.",
      failed: "TRANSMISSION FAILED — please retry, or email me directly.",
    },
  },
  caption: "CURRENTLY IN JAPAN ON A VALID WORK VISA",
  sigil: "END",
};

const notFound = {
  eyebrow: "ERROR",
  code: "404",
  heading: "No such page",
  lead: "That address does not exist. Nothing here is behind a login — if you followed a link to get here, it was wrong rather than restricted.",
  homeLabel: "BACK TO THE START",
  caption: "[+] EVERY SECTION IS ON ONE PAGE",
  sigil: "404",
};

export const en: SiteContent = {
  intro,
  about,
  experience,
  skills,
  results,
  projects,
  contact,
  notFound,
};

export default en;
