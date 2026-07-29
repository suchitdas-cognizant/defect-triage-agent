import { NextResponse } from "next/server";
import { bulkTriage } from "../../lib/bulk-triage";
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
  const defects = Array.isArray(body) ? body : (body as { defects?: unknown })?.defects;

  if (!Array.isArray(defects) || !defects.every(isDefect)) {
    return NextResponse.json(
      {
        error:
          "An array of defects is required. Each defect needs id, title, description, environment, area, reporter, and logs.",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(bulkTriage(defects));
}
