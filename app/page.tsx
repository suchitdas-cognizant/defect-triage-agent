import type { Metadata } from "next";
import { TriagePilotApp } from "./triagepilot-app";

export const metadata: Metadata = {
  title: "DefectTriageBot",
  description:
    "AI-powered defect triaging automation for quality engineering teams.",
};

export default function Home() {
  return <TriagePilotApp />;
}
