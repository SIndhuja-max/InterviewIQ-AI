
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";

export async function GET() {

  const allRows =
    await db
      .select()
      .from(MockInterview);

  return NextResponse.json({
    buildCheck: "VERSION_999",
    rowCount: allRows.length,
    rows: allRows.map(x => x.id),
    timestamp: new Date().toISOString()
  });
}
