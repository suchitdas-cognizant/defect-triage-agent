import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function callApi(body) {
  return callJsonRoute("/api/triage", body, "api-test");
}

async function callApprovalApi(body) {
  return callJsonRoute("/api/approve-routing", body, "approval-test");
}

async function callBulkApi(defects) {
  return callJsonRoute("/api/bulk-triage", { defects }, "bulk-test");
}

async function callKnowledgeApi(query = "") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("knowledge-test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost/api/knowledge-base${query}`, {
      headers: { accept: "application/json" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

async function callJsonRoute(path, body, marker) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(marker, `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

const paymentDefect = {
  id: "PAY-9999",
  title: "Checkout returns 500 after OTP",
  description:
    "Production customers cannot complete checkout after OTP. Orders are not created and support has multiple reports.",
  environment: "Production",
  area: "Payments",
  reporter: "API Test",
  logs: "POST /payment/authorize 500 gateway timeout provider_ref missing customer-impact high",
};

test("server-renders the DefectTriageBot product shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>DefectTriageBot<\/title>/i);
  assert.match(html, /Agent-first defect triage/);
  assert.match(html, /Agent Recommendation/);
  assert.match(html, /Duplicate and Knowledge Match/);
  assert.match(html, /Automation API Result/);
  assert.match(html, /Knowledge Base/);
  assert.match(html, /Known Fix Pattern/);
  assert.match(html, /Bulk Defect Import/);
  assert.match(html, /Triage batch/);
  assert.match(html, /Audit Trail/);
  assert.match(html, /Traceable governance log/);
  assert.match(html, /Architecture Blueprint/);
  assert.match(html, /Input Contract/);
  assert.match(html, /Demo Video Guide/);
  assert.match(html, /Problem Setup/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview|SkeletonPreview/);
});

test("triage API returns a workflow payload", async () => {
  const response = await callApi(paymentDefect);

  assert.equal(response.status, 200);
  const body = await response.json();

  assert.equal(body.triage.priority, "P0");
  assert.equal(body.triage.owner, "Payments Platform");
  assert.equal(body.workflow.nextSystem, "Jira");
  assert.match(body.workflow.actionId, /^TP-PAY-9999-P0$/);
  assert.ok(body.workflow.payload.labels.includes("ai-triaged"));
});

test("approval API returns a mock external workflow update", async () => {
  const response = await callApprovalApi(paymentDefect);

  assert.equal(response.status, 200);
  const body = await response.json();

  assert.equal(body.approval.status, "approved");
  assert.match(body.approval.externalTicketKey, /^JIRA-/);
  assert.match(body.approval.auditMessage, /approved for Payments Platform/);
  assert.equal(body.workflow.nextSystem, "Jira");
});

test("knowledge base API returns filterable SME memory records", async () => {
  const response = await callKnowledgeApi("?area=Payments");

  assert.equal(response.status, 200);
  const body = await response.json();

  assert.equal(body.count, 3);
  assert.ok(body.areas.includes("Payments"));
  assert.ok(body.records.every((record) => record.area === "Payments"));
  assert.ok(body.records[0].tags.length > 0);
  assert.ok(body.records[0].detectedSignals.length > 0);
});

test("bulk triage API returns batch routing counts", async () => {
  const response = await callBulkApi([
    paymentDefect,
    {
      id: "SRCH-9999",
      title: "Search filter resets after page two",
      description:
        "Brand filter works on page one but cursor pagination returns unfiltered results on page two.",
      environment: "UAT",
      area: "Search",
      reporter: "Bulk Test",
      logs: "query_state dropped filter after cursor pagination incorrect counts",
    },
  ]);

  assert.equal(response.status, 200);
  const body = await response.json();

  assert.equal(body.count, 2);
  assert.equal(body.results.length, 2);
  assert.ok(body.autoRouteCount + body.reviewCount === 2);
  assert.equal(body.results[0].workflow.payload.assignmentGroup, "Payments Platform");
});

test("removes disposable starter dependencies", async () => {
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");

  assert.match(packageJson, /"name": "triagepilot"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
