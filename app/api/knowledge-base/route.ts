import { NextResponse } from "next/server";
import { historicalDefects } from "../../lib/defect-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const area = searchParams.get("area");

  const records =
    area && area !== "All"
      ? historicalDefects.filter((defect) => defect.area === area)
      : historicalDefects;

  return NextResponse.json({
    count: records.length,
    areas: [...new Set(historicalDefects.map((defect) => defect.area))].sort(),
    records,
  });
}
