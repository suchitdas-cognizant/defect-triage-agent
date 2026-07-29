import { buildTriageWorkflow } from "./triage-engine";
import type { ApprovalApiResponse, Defect } from "./triage-types";

export function approveRouting(defect: Defect): ApprovalApiResponse {
  const workflow = buildTriageWorkflow(defect, "queue");
  const prefix = workflow.workflow.nextSystem === "Jira" ? "JIRA" : "ADO";
  const ticketNumber = Math.abs(
    defect.id.split("").reduce((total, char) => total + char.charCodeAt(0), 0),
  );
  const externalTicketKey = `${prefix}-${ticketNumber}`;

  return {
    ...workflow,
    approval: {
      status: "approved",
      approvedAt: new Date().toISOString(),
      externalTicketKey,
      auditMessage: `${defect.id} approved for ${workflow.triage.owner}; ${externalTicketKey} would be updated with AI triage labels, assignment, duplicate links, and comment.`,
    },
  };
}
