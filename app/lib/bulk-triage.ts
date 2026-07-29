import { buildTriageWorkflow } from "./triage-engine";
import type { BulkTriageApiResponse, Defect } from "./triage-types";

export function bulkTriage(defects: Defect[]): BulkTriageApiResponse {
  const results = defects.map((defect) => buildTriageWorkflow(defect, "manual-intake"));
  const autoRouteCount = results.filter(
    (result) => result.triage.confidence >= 78 && result.triage.missingInfo.length === 0,
  ).length;

  return {
    count: results.length,
    autoRouteCount,
    reviewCount: results.length - autoRouteCount,
    results,
  };
}
