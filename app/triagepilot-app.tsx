"use client";

import { useMemo, useState } from "react";
import { historicalDefects, incomingDefects, sampleNewDefect } from "./lib/defect-data";
import { severityClass, triageDefect } from "./lib/triage-engine";
import type { ApprovalApiResponse, BulkTriageApiResponse, Defect, TriageApiResponse } from "./lib/triage-types";

const componentOptions = ["All", ...Array.from(new Set(historicalDefects.map((defect) => defect.area))).sort()];
const bulkCsvSample = `id,title,description,environment,area,reporter,logs
PAY-2201,Card payment timeout after OTP,Production users complete OTP but payment authorization times out and order is not created,Production,Payments,Bulk Demo,POST /payment/authorize 502 timeout provider_ref missing customer-impact high
AUTH-883,SSO users redirected back to login,SSO callback succeeds but users return to login because session cookie is rejected,Production,Identity,Bulk Demo,Set-Cookie rejected session invalid callback Secure missing
SRCH-410,Search filter resets on page two,Brand filter works on first page but cursor pagination returns unfiltered results,UAT,Search,Bulk Demo,query_state dropped filter after cursor pagination incorrect counts`;

type AuditEvent = {
  id: string;
  time: string;
  actor: string;
  event: "Agent Run" | "Bulk Run" | "Approval";
  source: string;
  defectId: string;
  decision: string;
  detail: string;
};

const architectureLayers = [
  {
    title: "Defect Sources",
    detail: "Jira, Azure DevOps, CSV imports, and manual QA intake feed raw defects into TriagePilot.",
    items: ["Jira", "Azure DevOps", "CSV", "Manual Form"],
  },
  {
    title: "Triage Agent API",
    detail: "Structured endpoints normalize input, run scoring, and return explainable JSON decisions.",
    items: ["/api/triage", "/api/bulk-triage", "/api/approve-routing"],
  },
  {
    title: "Reasoning Engine",
    detail: "Severity, priority, component, owner, confidence, missing info, and duplicate matching.",
    items: ["Impact rules", "SME policies", "Similarity match", "Confidence"],
  },
  {
    title: "Knowledge Base",
    detail: "Historical defects act as reusable SME memory for known fixes and routing patterns.",
    items: ["Known fixes", "Tags", "Signals", "Owners"],
  },
  {
    title: "Workflow Action",
    detail: "Human-approved outputs create mock Jira or Azure DevOps payloads with an audit trail.",
    items: ["Assign owner", "Add comment", "Link duplicate", "Audit"],
  },
];

const demoScenes = [
  {
    time: "00:00-00:20",
    title: "Problem Setup",
    show: "Open with the hero metrics and incoming defect queue.",
    say: "Manual defect triage depends on SME memory, slows down releases, and produces inconsistent routing.",
  },
  {
    time: "00:20-00:55",
    title: "Agent Recommendation",
    show: "Select PAY-1842 and point to priority, owner, confidence, reasons, and duplicate matches.",
    say: "TriagePilot converts an unstructured defect into a structured, explainable recommendation.",
  },
  {
    time: "00:55-01:25",
    title: "Knowledge Memory",
    show: "Scroll to Knowledge Base and search for payment or refund.",
    say: "The agent uses historical defects as SME memory for similar incidents, signals, and known fix patterns.",
  },
  {
    time: "01:25-02:00",
    title: "Workflow Automation",
    show: "Run the new defect agent, review the API payload, and approve routing.",
    say: "After human approval, TriagePilot prepares the Jira or Azure DevOps update with owner, labels, and comments.",
  },
  {
    time: "02:00-02:30",
    title: "Bulk Triage",
    show: "Use Bulk Defect Import and click Triage batch.",
    say: "Teams can triage many defects at once and separate auto-route candidates from items that need review.",
  },
  {
    time: "02:30-03:00",
    title: "Governance Close",
    show: "End on Audit Trail and architecture.",
    say: "Every AI decision and approval is traceable, making the automation practical for enterprise quality engineering.",
  },
];

export function TriagePilotApp() {
  const [selectedId, setSelectedId] = useState(incomingDefects[0].id);
  const [draft, setDraft] = useState(sampleNewDefect);
  const [submitted, setSubmitted] = useState<Defect | null>(null);
  const [approved, setApproved] = useState<Record<string, string>>({});
  const [apiResult, setApiResult] = useState<TriageApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isRunningAgent, setIsRunningAgent] = useState(false);
  const [approvalResult, setApprovalResult] = useState<ApprovalApiResponse | null>(null);
  const [approvalError, setApprovalError] = useState<string | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [knowledgeQuery, setKnowledgeQuery] = useState("");
  const [knowledgeArea, setKnowledgeArea] = useState("All");
  const [bulkCsv, setBulkCsv] = useState(bulkCsvSample);
  const [bulkResult, setBulkResult] = useState<BulkTriageApiResponse | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [isBulkRunning, setIsBulkRunning] = useState(false);
  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>([
    {
      id: "seed-1",
      time: "10:15",
      actor: "TriagePilot Agent",
      event: "Agent Run",
      source: "queue",
      defectId: "PAY-1842",
      decision: "P0 routed to Payments Platform",
      detail: "Matched PAY-1668 and flagged production checkout impact.",
    },
    {
      id: "seed-2",
      time: "10:17",
      actor: "QE Lead",
      event: "Approval",
      source: "human-review",
      defectId: "PAY-1842",
      decision: "JIRA-512 approved",
      detail: "AI triage comment and duplicate links would be added to Jira.",
    },
  ]);

  const queue = submitted ? [submitted, ...incomingDefects] : incomingDefects;
  const selected = queue.find((defect) => defect.id === selectedId) ?? queue[0];
  const triage = useMemo(() => triageDefect(selected), [selected]);
  const submittedTriage = useMemo(() => triageDefect(draft), [draft]);
  const approvedCount = Object.keys(approved).length;
  const filteredKnowledge = useMemo(() => {
    const query = knowledgeQuery.trim().toLowerCase();

    return historicalDefects.filter((defect) => {
      const areaMatch = knowledgeArea === "All" || defect.area === knowledgeArea;
      const searchText = [
        defect.id,
        defect.title,
        defect.description,
        defect.owner,
        defect.resolution,
        defect.fixPattern,
        defect.tags.join(" "),
        defect.detectedSignals.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return areaMatch && (!query || searchText.includes(query));
    });
  }, [knowledgeArea, knowledgeQuery]);

  const knowledgeStats = useMemo(() => {
    const p0p1Count = historicalDefects.filter((defect) => defect.priority === "P0" || defect.priority === "P1").length;
    const ownerCount = new Set(historicalDefects.map((defect) => defect.owner)).size;
    const tagCount = new Set(historicalDefects.flatMap((defect) => defect.tags)).size;

    return { p0p1Count, ownerCount, tagCount };
  }, []);

  function addAuditEvent(event: Omit<AuditEvent, "id" | "time">) {
    const now = new Date();
    setAuditTrail((current) => [
      {
        ...event,
        id: `audit-${now.getTime()}-${current.length}`,
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...current,
    ]);
  }

  async function submitDefect() {
    const next = { ...draft, id: `NEW-${String(Date.now()).slice(-4)}` };
    setIsRunningAgent(true);
    setApiError(null);

    try {
      const response = await fetch("/api/triage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(next),
      });

      if (!response.ok) {
        throw new Error(`Triage API returned ${response.status}`);
      }

      const result = (await response.json()) as TriageApiResponse;
      setApiResult(result);
      setSubmitted(result.defect);
      setSelectedId(result.defect.id);
      addAuditEvent({
        actor: "TriagePilot Agent",
        event: "Agent Run",
        source: "manual-intake",
        defectId: result.defect.id,
        decision: `${result.triage.priority} recommended for ${result.triage.owner}`,
        detail: `Confidence ${result.triage.confidence}%; ${result.workflow.nextSystem} payload generated.`,
      });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "Triage API failed");
    } finally {
      setIsRunningAgent(false);
    }
  }

  function updateDraft(key: keyof Defect, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function approveSelectedRouting() {
    setIsApproving(true);
    setApprovalError(null);

    try {
      const response = await fetch("/api/approve-routing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(selected),
      });

      if (!response.ok) {
        throw new Error(`Approval API returned ${response.status}`);
      }

      const result = (await response.json()) as ApprovalApiResponse;
      setApprovalResult(result);
      setApproved((current) => ({
        ...current,
        [selected.id]: `${result.triage.priority} routed to ${result.triage.owner}`,
      }));
      addAuditEvent({
        actor: "QE Lead",
        event: "Approval",
        source: result.workflow.nextSystem,
        defectId: result.defect.id,
        decision: `${result.approval.externalTicketKey} approved`,
        detail: result.approval.auditMessage,
      });
    } catch (error) {
      setApprovalError(error instanceof Error ? error.message : "Approval API failed");
    } finally {
      setIsApproving(false);
    }
  }

  function parseBulkCsv(csv: string): Defect[] {
    const lines = csv
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const [, ...rows] = lines;

    return rows.map((line) => {
      const [id, title, description, environment, area, reporter, ...logParts] = line.split(",");
      return {
        id: id?.trim() ?? "",
        title: title?.trim() ?? "",
        description: description?.trim() ?? "",
        environment: environment?.trim() ?? "",
        area: area?.trim() ?? "",
        reporter: reporter?.trim() ?? "",
        logs: logParts.join(",").trim(),
      };
    });
  }

  async function runBulkTriage() {
    setIsBulkRunning(true);
    setBulkError(null);

    try {
      const defects = parseBulkCsv(bulkCsv);
      if (defects.length === 0 || defects.some((defect) => !defect.id || !defect.title || !defect.logs)) {
        throw new Error("CSV rows need id, title, description, environment, area, reporter, and logs.");
      }

      const response = await fetch("/api/bulk-triage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ defects }),
      });

      if (!response.ok) {
        throw new Error(`Bulk triage API returned ${response.status}`);
      }

      const result = (await response.json()) as BulkTriageApiResponse;
      setBulkResult(result);
      addAuditEvent({
        actor: "TriagePilot Agent",
        event: "Bulk Run",
        source: "csv-import",
        defectId: `${result.count} defects`,
        decision: `${result.autoRouteCount} auto-route / ${result.reviewCount} review`,
        detail: "Batch triage completed with owner, priority, and workflow payloads for each row.",
      });
    } catch (error) {
      setBulkError(error instanceof Error ? error.message : "Bulk triage failed");
    } finally {
      setIsBulkRunning(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">TP</div>
          <div>
            <h1>DefectTriageBot</h1>
            <p>AI defect triaging automation for quality engineering</p>
          </div>
        </div>
        <div className="top-actions">
          <button className="button ghost" type="button">
            Export JSON
          </button>
          <button className="button primary" type="button" onClick={submitDefect} disabled={isRunningAgent}>
            {isRunningAgent ? "Running agent..." : "Run agent"}
          </button>
        </div>
      </header>

      <section className="hero" aria-label="DefectTriageBot overview">
        <div className="hero-main">
          <p className="eyebrow">Agent-first defect triage</p>
          <h2>From raw defect report to routed engineering action.</h2>
          <p className="hero-copy">
            DefectTriageBot reads defect context, compares it with historical issues, scores impact,
            recommends severity and priority, assigns the owning squad, and explains every decision
            before a human approves it.
          </p>
          <div className="metric-row">
            <div className="metric">
              <strong>83%</strong>
              <span>estimated triage effort reduced in demo queue</span>
            </div>
            <div className="metric">
              <strong>4.2m</strong>
              <span>average agent decision time target</span>
            </div>
            <div className="metric">
              <strong>{approvedCount}</strong>
              <span>AI recommendations approved in this session</span>
            </div>
          </div>
        </div>
        <aside className="agent-panel panel" aria-label="Automation flow">
          {[
            ["1", "Ingest", "Jira, Azure DevOps, CSV, or manual QA report"],
            ["2", "Reason", "Severity, component, duplicate, and missing-info checks"],
            ["3", "Route", "Owner assignment with confidence and explanation"],
            ["4", "Act", "Human approval creates the next workflow action"],
          ].map(([index, title, detail]) => (
            <div className="agent-step" key={title}>
              <div className="step-index">{index}</div>
              <div>
                <strong>{title}</strong>
                <span>{detail}</span>
              </div>
              <span className="status-pill">Ready</span>
            </div>
          ))}
        </aside>
      </section>

      <section className="architecture-shell" aria-label="Architecture blueprint">
        <div className="panel-header">
          <div>
            <h3>Architecture Blueprint</h3>
            <p>How the automation agent turns defect signals into routed engineering work.</p>
          </div>
          <span className="tag">Agent + platform</span>
        </div>

        <div className="architecture-flow">
          {architectureLayers.map((layer, index) => (
            <article className="architecture-card" key={layer.title}>
              <div className="architecture-index">{index + 1}</div>
              <h4>{layer.title}</h4>
              <p>{layer.detail}</p>
              <div className="tag-row">
                {layer.items.map((item) => (
                  <span className="tag" key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="architecture-contracts">
          <div className="contract-card">
            <span>Input Contract</span>
            <strong>Defect JSON</strong>
            <p>id, title, description, environment, area, reporter, logs</p>
          </div>
          <div className="contract-card">
            <span>Agent Output</span>
            <strong>Triage JSON</strong>
            <p>severity, priority, owner, confidence, duplicate matches, missing info</p>
          </div>
          <div className="contract-card">
            <span>Workflow Payload</span>
            <strong>Action JSON</strong>
            <p>assignment group, labels, triage comment, external ticket key</p>
          </div>
        </div>
      </section>

      <section className="workspace" aria-label="Triage workspace">
        <aside className="panel">
          <div className="panel-header">
            <div>
              <h3>Incoming Defects</h3>
              <p>Select one to see the agent decision.</p>
            </div>
            <span className="tag">{queue.length} open</span>
          </div>
          <div className="queue">
            {queue.map((defect) => {
              const itemTriage = triageDefect(defect);
              return (
                <button
                  className={`queue-item ${defect.id === selected.id ? "active" : ""}`}
                  key={defect.id}
                  type="button"
                  onClick={() => setSelectedId(defect.id)}
                >
                  <div className="queue-top">
                    <span className="tag">{defect.id}</span>
                    <span className={`risk-pill ${severityClass(itemTriage.severity)}`}>
                      {itemTriage.priority}
                    </span>
                  </div>
                  <div className="queue-title">{defect.title}</div>
                  <div className="queue-meta">
                    {defect.environment} / {defect.area} / {defect.reporter}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="result-panel">
          <section className="panel">
            <div className="panel-header">
              <div>
                <h3>Agent Recommendation</h3>
                <p>{selected.id}: {selected.title}</p>
              </div>
              <span className={`risk-pill ${severityClass(triage.severity)}`}>{triage.severity}</span>
            </div>

            <div className="decision-grid">
              <div className="decision">
                <span>Priority</span>
                <strong>{triage.priority}</strong>
                <small>workflow urgency</small>
              </div>
              <div className="decision">
                <span>Component</span>
                <strong>{triage.component}</strong>
                <small>predicted module</small>
              </div>
              <div className="decision">
                <span>Owner</span>
                <strong>{triage.owner}</strong>
                <small>suggested squad</small>
              </div>
              <div className="decision">
                <span>Confidence</span>
                <strong>{triage.confidence}%</strong>
                <small>explainable score</small>
              </div>
            </div>

            <div className="summary-box">
              <h4>Decision Summary</h4>
              <p>{triage.summary}</p>
            </div>

            <div className="confidence" aria-label={`Confidence ${triage.confidence}%`}>
              <span style={{ width: `${triage.confidence}%` }} />
            </div>

            <div className="summary-box">
              <h4>Why the Agent Chose This</h4>
              <ul>
                {triage.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>

            <div className="summary-box">
              <h4>Recommended Action</h4>
              <p>{triage.action}</p>
            </div>

            <div className="review-actions">
              <button className="button" type="button">
                Send back for info
              </button>
              <button
                className="button primary"
                type="button"
                onClick={approveSelectedRouting}
                disabled={isApproving}
              >
                {isApproving ? "Approving..." : "Approve routing"}
              </button>
            </div>

            <div className="api-panel" aria-live="polite">
              <div className="panel-header compact">
                <div>
                  <h3>Workflow Approval</h3>
                  <p>Mock Jira/Azure DevOps update created after human approval.</p>
                </div>
                <span className="tag">{approvalResult?.approval.externalTicketKey ?? "Pending"}</span>
              </div>
              {approvalError ? <p className="error-text">{approvalError}</p> : null}
              {approvalResult ? (
                <p className="success-text">{approvalResult.approval.auditMessage}</p>
              ) : (
                <p className="muted">Approve routing to generate an auditable workflow handoff.</p>
              )}
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <h3>Duplicate and Knowledge Match</h3>
                <p>Historical defects used as SME memory.</p>
              </div>
            </div>
            <div className="duplicate-list">
              {triage.duplicates.map((match) => (
                <div className="duplicate" key={match.id}>
                  <div>
                    <strong>{match.id}: {match.title}</strong>
                    <span>{match.resolution}</span>
                  </div>
                  <span className="tag">{Math.round(match.score * 100)}% match</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="knowledge-shell" aria-label="Knowledge base">
        <div className="panel-header">
          <div>
            <h3>Knowledge Base</h3>
            <p>Historical defects used as SME memory for duplicate detection, ownership, and fix guidance.</p>
          </div>
          <span className="tag">{filteredKnowledge.length} visible records</span>
        </div>

        <div className="knowledge-metrics">
          <div className="knowledge-stat">
            <strong>{historicalDefects.length}</strong>
            <span>historical defects indexed</span>
          </div>
          <div className="knowledge-stat">
            <strong>{knowledgeStats.p0p1Count}</strong>
            <span>P0/P1 incidents available for learning</span>
          </div>
          <div className="knowledge-stat">
            <strong>{knowledgeStats.ownerCount}</strong>
            <span>owning squads represented</span>
          </div>
          <div className="knowledge-stat">
            <strong>{knowledgeStats.tagCount}</strong>
            <span>searchable signal tags</span>
          </div>
        </div>

        <div className="knowledge-controls">
          <div className="field">
            <label htmlFor="knowledge-search">Search SME memory</label>
            <input
              id="knowledge-search"
              placeholder="Try refund, Safari, timeout, stock..."
              value={knowledgeQuery}
              onChange={(event) => setKnowledgeQuery(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="knowledge-area">Component</label>
            <select
              id="knowledge-area"
              value={knowledgeArea}
              onChange={(event) => setKnowledgeArea(event.target.value)}
            >
              {componentOptions.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="knowledge-grid">
          {filteredKnowledge.map((defect) => (
            <article className="knowledge-card" key={defect.id}>
              <div className="knowledge-card-top">
                <div>
                  <span className="tag">{defect.id}</span>
                  <h4>{defect.title}</h4>
                </div>
                <span className={`risk-pill ${severityClass(defect.severity)}`}>{defect.priority}</span>
              </div>
              <p>{defect.description}</p>
              <div className="knowledge-meta">
                <span>{defect.area}</span>
                <span>{defect.owner}</span>
                <span>Last seen {defect.lastSeen}</span>
              </div>
              <div className="summary-box compact-box">
                <h4>Known Fix Pattern</h4>
                <p>{defect.fixPattern}</p>
              </div>
              <div className="signal-row">
                {defect.detectedSignals.map((signal) => (
                  <span className="signal-chip" key={signal}>{signal}</span>
                ))}
              </div>
              <div className="tag-row">
                {defect.tags.map((tag) => (
                  <span className="tag" key={tag}>{tag}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bulk-shell" aria-label="Bulk defect import">
        <div className="panel-header">
          <div>
            <h3>Bulk Defect Import</h3>
            <p>Paste CSV defects and let the agent triage the batch for routing or manual review.</p>
          </div>
          <button className="button primary" type="button" onClick={runBulkTriage} disabled={isBulkRunning}>
            {isBulkRunning ? "Triaging..." : "Triage batch"}
          </button>
        </div>

        <div className="bulk-layout">
          <div className="field">
            <label htmlFor="bulk-csv">CSV input</label>
            <textarea
              className="bulk-textarea"
              id="bulk-csv"
              value={bulkCsv}
              onChange={(event) => setBulkCsv(event.target.value)}
            />
          </div>

          <div className="bulk-results">
            <div className="knowledge-metrics compact-metrics">
              <div className="knowledge-stat">
                <strong>{bulkResult?.count ?? 0}</strong>
                <span>defects processed</span>
              </div>
              <div className="knowledge-stat">
                <strong>{bulkResult?.autoRouteCount ?? 0}</strong>
                <span>ready for auto-route</span>
              </div>
              <div className="knowledge-stat">
                <strong>{bulkResult?.reviewCount ?? 0}</strong>
                <span>needs human review</span>
              </div>
            </div>

            {bulkError ? <p className="error-text">{bulkError}</p> : null}

            <div className="bulk-table" role="table" aria-label="Bulk triage results">
              <div className="bulk-row bulk-row-head" role="row">
                <span>Defect</span>
                <span>Priority</span>
                <span>Owner</span>
                <span>Decision</span>
              </div>
              {(bulkResult?.results ?? []).map((result) => {
                const ready =
                  result.triage.confidence >= 78 && result.triage.missingInfo.length === 0;
                return (
                  <div className="bulk-row" role="row" key={result.defect.id}>
                    <span>
                      <strong>{result.defect.id}</strong>
                      <small>{result.defect.title}</small>
                    </span>
                    <span className={`risk-pill ${severityClass(result.triage.severity)}`}>
                      {result.triage.priority}
                    </span>
                    <span>{result.triage.owner}</span>
                    <span className={ready ? "success-text" : "review-text"}>
                      {ready ? "Auto-route" : "Review"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="audit-shell" aria-label="Audit trail">
        <div className="panel-header">
          <div>
            <h3>Audit Trail</h3>
            <p>Traceable governance log for agent decisions, approvals, and batch triage runs.</p>
          </div>
          <span className="tag">{auditTrail.length} events</span>
        </div>

        <div className="audit-list">
          {auditTrail.map((event) => (
            <article className="audit-item" key={event.id}>
              <div className="audit-time">
                <strong>{event.time}</strong>
                <span>{event.event}</span>
              </div>
              <div className="audit-body">
                <div className="audit-title">
                  <strong>{event.defectId}</strong>
                  <span>{event.decision}</span>
                </div>
                <p>{event.detail}</p>
                <div className="tag-row">
                  <span className="tag">{event.actor}</span>
                  <span className="tag">{event.source}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="demo-shell" aria-label="Demo video guide">
        <div className="panel-header">
          <div>
            <h3>Demo Video Guide</h3>
            <p>A 3-minute recording plan for the hackathon submission.</p>
          </div>
          <span className="tag">6 scenes</span>
        </div>

        <div className="demo-list">
          {demoScenes.map((scene) => (
            <article className="demo-scene" key={scene.title}>
              <div className="demo-time">{scene.time}</div>
              <div>
                <h4>{scene.title}</h4>
                <p><strong>Show:</strong> {scene.show}</p>
                <p><strong>Say:</strong> {scene.say}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="workspace" aria-label="New defect intake">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>New Defect Intake</h3>
              <p>Change the report and run the agent.</p>
            </div>
          </div>
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="title">Title</label>
              <input id="title" value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="environment">Environment</label>
              <select
                id="environment"
                value={draft.environment}
                onChange={(event) => updateDraft("environment", event.target.value)}
              >
                <option>Production</option>
                <option>UAT</option>
                <option>Staging</option>
                <option>Development</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="area">Area</label>
              <select id="area" value={draft.area} onChange={(event) => updateDraft("area", event.target.value)}>
                <option>Payments</option>
                <option>Identity</option>
                <option>Inventory</option>
                <option>Orders</option>
                <option>Search</option>
              </select>
            </div>
            <div className="field full">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={draft.description}
                onChange={(event) => updateDraft("description", event.target.value)}
              />
            </div>
            <div className="field full">
              <label htmlFor="logs">Logs or signal</label>
              <textarea id="logs" value={draft.logs} onChange={(event) => updateDraft("logs", event.target.value)} />
            </div>
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Live Agent Preview</h3>
              <p>Updates as the report changes.</p>
            </div>
            <span className={`risk-pill ${severityClass(submittedTriage.severity)}`}>
              {submittedTriage.severity}
            </span>
          </div>
          <div className="decision-grid">
            <div className="decision">
              <span>Priority</span>
              <strong>{submittedTriage.priority}</strong>
            </div>
            <div className="decision">
              <span>Owner</span>
              <strong>{submittedTriage.owner}</strong>
            </div>
            <div className="decision">
              <span>Confidence</span>
              <strong>{submittedTriage.confidence}%</strong>
            </div>
            <div className="decision">
              <span>Missing</span>
              <strong>{submittedTriage.missingInfo.length}</strong>
            </div>
          </div>
          <div className="summary-box">
            <h4>Agent Notes</h4>
            <p>{submittedTriage.summary}</p>
          </div>
          <div className="tag-row">
            {submittedTriage.missingInfo.length ? (
              submittedTriage.missingInfo.map((item) => <span className="tag" key={item}>{item}</span>)
            ) : (
              <span className="tag">Ready for routing</span>
            )}
          </div>

          <div className="api-panel" aria-live="polite">
            <div className="panel-header compact">
              <div>
                <h3>Automation API Result</h3>
                <p>Returned by POST /api/triage.</p>
              </div>
              <span className="tag">{apiResult ? apiResult.workflow.nextSystem : "Idle"}</span>
            </div>
            {apiError ? <p className="error-text">{apiError}</p> : null}
            {apiResult ? (
              <pre className="json-preview">
{JSON.stringify(
  {
    actionId: apiResult.workflow.actionId,
    assignmentGroup: apiResult.workflow.payload.assignmentGroup,
    labels: apiResult.workflow.payload.labels,
    comment: apiResult.workflow.payload.comment,
  },
  null,
  2,
)}
              </pre>
            ) : (
              <p className="muted">Run the agent to generate a mock Jira or Azure DevOps update payload.</p>
            )}
          </div>
        </section>
      </section>

      <section className="analytics" aria-label="Hackathon proof points">
        <div className="card">
          <h4>Consistency</h4>
          <p>Same policy, same outcome, with reasons attached to every recommendation.</p>
        </div>
        <div className="card">
          <h4>SME Memory</h4>
          <p>Historical defects act as reusable knowledge for duplicate detection and owner routing.</p>
        </div>
        <div className="card">
          <h4>Governance</h4>
          <p>Humans approve the final routing, making automation auditable instead of mysterious.</p>
        </div>
        <div className="card">
          <h4>Coverage</h4>
          <div className="bar-row">
            <div className="bar">
              <span>P0/P1</span>
              <div className="bar-track"><span style={{ width: "72%" }} /></div>
              <span>72%</span>
            </div>
            <div className="bar">
              <span>Dupes</span>
              <div className="bar-track"><span style={{ width: "64%" }} /></div>
              <span>64%</span>
            </div>
            <div className="bar">
              <span>Owner</span>
              <div className="bar-track"><span style={{ width: "91%" }} /></div>
              <span>91%</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
