import { historicalDefects } from "./defect-data";
import type { Defect, Triage, TriageApiResponse } from "./triage-types";

const ownerByArea: Record<string, string> = {
  Payments: "Payments Platform",
  Identity: "Identity Services",
  Inventory: "Commerce Core",
  Orders: "Order Management",
  Search: "Experience Platform",
};

function words(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function similarity(a: Defect, b: Defect) {
  const aSet = new Set(words(`${a.title} ${a.description} ${a.logs} ${a.area}`));
  const bSet = new Set(words(`${b.title} ${b.description} ${b.logs} ${b.area}`));
  const overlap = [...aSet].filter((word) => bSet.has(word)).length;
  const union = new Set([...aSet, ...bSet]).size || 1;
  const areaBoost = a.area === b.area ? 0.18 : 0;
  return Math.min(0.98, overlap / union + areaBoost);
}

export function triageDefect(defect: Defect): Triage {
  const content = `${defect.title} ${defect.description} ${defect.logs} ${defect.environment}`.toLowerCase();
  const production = content.includes("production");
  const payment = content.includes("payment") || content.includes("refund") || content.includes("checkout");
  const outageTerms = ["fail", "fails", "500", "502", "timeout", "blank", "not created", "customer-impact"];
  const riskHits = outageTerms.filter((term) => content.includes(term)).length;
  const customerImpact = content.includes("customer") || content.includes("multiple users") || content.includes("support");
  const missingInfo = [
    defect.description.length < 90 ? "Detailed reproduction steps" : "",
    defect.logs.length < 35 ? "Error logs or trace id" : "",
    content.includes("screenshot") ? "" : "Screenshot or recording",
  ].filter(Boolean) as string[];

  let severity: Triage["severity"] = "Low";
  if (production && customerImpact && riskHits >= 2) severity = "Critical";
  else if ((production && riskHits >= 1) || riskHits >= 3) severity = "High";
  else if (riskHits >= 1) severity = "Medium";

  const priority =
    severity === "Critical" ? "P0" : severity === "High" ? "P1" : severity === "Medium" ? "P2" : "P3";
  const component = payment ? "Payments" : defect.area;
  const owner = ownerByArea[component] ?? "QE Triage Desk";

  const duplicates = historicalDefects
    .map((past) => ({
      id: past.id,
      title: past.title,
      score: similarity(defect, past),
      owner: past.owner,
      resolution: past.resolution,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const confidence = Math.round(
    Math.min(96, 62 + riskHits * 8 + (production ? 8 : 0) + (duplicates[0]?.score ?? 0) * 18 - missingInfo.length * 4),
  );

  return {
    severity,
    priority,
    component,
    owner,
    confidence,
    action:
      severity === "Critical"
        ? "Create incident bridge, assign owner, and block release until triage is approved."
        : severity === "High"
          ? "Route to owning squad and request fix plan within the current sprint."
          : "Add to triage backlog with suggested owner and reproduction checklist.",
    summary: `TriagePilot classified ${defect.id} as ${severity}/${priority} for ${component} because the report contains ${production ? "production impact" : "non-production evidence"}, ${riskHits} failure signal${riskHits === 1 ? "" : "s"}, and ${duplicates[0] ? `a ${Math.round(duplicates[0].score * 100)}% similar historical defect` : "no close duplicate"}.`,
    reasons: [
      production ? "Production environment increases business risk." : "Issue is outside production, reducing immediate blast radius.",
      customerImpact ? "Customer or support impact is explicitly mentioned." : "No direct customer impact stated yet.",
      `${riskHits} defect signal${riskHits === 1 ? "" : "s"} found in title, description, and logs.`,
      duplicates[0] && duplicates[0].score > 0.28
        ? `Most similar known defect: ${duplicates[0].id}.`
        : "No strong duplicate candidate found.",
    ],
    missingInfo,
    duplicates,
  };
}

export function buildTriageWorkflow(defect: Defect, source: TriageApiResponse["workflow"]["source"]): TriageApiResponse {
  const triage = triageDefect(defect);
  const nextSystem = defect.area === "Payments" ? "Jira" : "Azure DevOps";

  return {
    defect,
    triage,
    workflow: {
      source,
      nextSystem,
      actionId: `TP-${defect.id}-${triage.priority}`,
      payload: {
        labels: ["ai-triaged", triage.priority.toLowerCase(), triage.component.toLowerCase().replace(/\s+/g, "-")],
        assignmentGroup: triage.owner,
        comment: `${triage.summary} Recommended action: ${triage.action}`,
      },
    },
  };
}

export function severityClass(severity: Triage["severity"]) {
  if (severity === "Critical") return "red";
  if (severity === "High") return "amber";
  if (severity === "Medium") return "cyan";
  return "green";
}
