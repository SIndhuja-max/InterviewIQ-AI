
import { NextResponse } from "next/server";
import { db } from "@/utils/db";

export async function GET() {

  const result = await db.execute(
    `SELECT current_database(),
            current_schema(),
            now();`
  );

  return NextResponse.json(result);
}

