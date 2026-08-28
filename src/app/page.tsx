import {
  FeedbackSection,
  HistorySection,
  IntroSection,
  PhilosophySection,
  ResultsSection,
  StatusSection,
} from "@/components/sections";

/**
 * Stage 2: the reference cloned one-to-one, geometry first. Content swaps to
 * the portfolio's own copy in stage 5 — see docs/DESIGN-SPEC.md §6.
 */
export default function Home() {
  return (
    <>
      <IntroSection />
      <PhilosophySection />
      <StatusSection />
      <ResultsSection />
      <FeedbackSection />
      <HistorySection />
    </>
  );
}
