
import { NextResponse } from "next/server";

export async function GET() {

  return NextResponse.json({
    drizzleDbUrl:
      process.env.DRIZZLE_DB_URL,
    nodeEnv:
      process.env.NODE_ENV,
    timestamp:
      new Date().toISOString(),
  });
}

