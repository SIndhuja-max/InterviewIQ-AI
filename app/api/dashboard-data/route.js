export const dynamic =
  "force-dynamic";

import { NextResponse }
from "next/server";

import { db }
from "@/utils/db";

import { MockInterview }
from "@/utils/schema";

export async function GET() {

  try {

    const allRows =
      await db
        .select()
        .from(MockInterview);

    return NextResponse.json(
      {
        success: true,

        dbRows: allRows.map(
          (item) => ({
            id: item.id,
            createdBy:
              item.createdBy,
            jobPosition:
              item.jobPosition,
            createdAt:
              item.createdAt,
          })
        ),
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "DASHBOARD API ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        dbRows: [],
      },
      {
        status: 500,
      }
    );
  }
}

