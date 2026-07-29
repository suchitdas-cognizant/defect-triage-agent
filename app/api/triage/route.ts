import { NextResponse } from "next/server";
import { buildTriageWorkflow } from "../../lib/triage-engine";
import type { Defect } from "../../lib/triage-types";

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isDefect(value: unknown): value is Defect {
  if (!value || typeof value !== "object") return false;
  const defect = value as Record<string, unknown>;
  return (
    isString(defect.id) &&
    isString(defect.title) &&
    isString(defect.description) &&
    isString(defect.environment) &&
    isString(defect.area) &&
    isString(defect.reporter) &&
    isString(defect.logs)
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  if (!isDefect(body)) {
    return NextResponse.json(
      {
        error:
          "A defect with id, title, description, environment, area, reporter, and logs is required.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(buildTriageWorkflow(body, "manual-intake"));
}
