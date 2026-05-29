
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
  buildCheck: "VERSION_1000",
  dbUrlEnd:
    process.env.DRIZZLE_DB_URL?.slice(-80),
});
}
