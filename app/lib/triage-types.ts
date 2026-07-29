export type Defect = {
  id: string;
  title: string;
  description: string;
  environment: string;
  area: string;
  reporter: string;
  logs: string;
};

export type HistoricalDefect = Defect & {
  resolution: string;
  owner: string;
  severity: Triage["severity"];
  priority: Triage["priority"];
  tags: string[];
  fixPattern: string;
  detectedSignals: string[];
  lastSeen: string;
};

export type Triage = {
  severity: "Critical" | "High" | "Medium" | "Low";
  priority: "P0" | "P1" | "P2" | "P3";
  component: string;
  owner: string;
  confidence: number;
  action: string;
  summary: string;
  reasons: string[];
  missingInfo: string[];
  duplicates: Array<{
    id: string;
    title: string;
    score: number;
    owner: string;
    resolution: string;
  }>;
};

export type TriageApiResponse = {
  defect: Defect;
  triage: Triage;
  workflow: {
    source: "manual-intake" | "queue";
    nextSystem: "Jira" | "Azure DevOps";
    actionId: string;
    payload: {
      labels: string[];
      assignmentGroup: string;
      comment: string;
    };
  };
};

export type ApprovalApiResponse = TriageApiResponse & {
  approval: {
    status: "approved";
    approvedAt: string;
    externalTicketKey: string;
    auditMessage: string;
  };
};

export type BulkTriageApiResponse = {
  count: number;
  autoRouteCount: number;
  reviewCount: number;
  results: TriageApiResponse[];
};
