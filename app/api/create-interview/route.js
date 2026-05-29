export const dynamic =
  "force-dynamic";


import { NextResponse }
from "next/server";

import { db }
from "@/utils/db";

import { MockInterview }
from "@/utils/schema";

export async function POST(req) {

  try {

    const body =
      await req.json();

    // =========================
    // NORMALIZE EMAIL
    // =========================

    const normalizedBody = {

      ...body,

      createdBy:
        body?.createdBy
          ?.trim()
          ?.toLowerCase(),
    };

    console.log(
      "CREATE INTERVIEW BODY:",
      normalizedBody
    );

      console.log(
      "CREATE DB URL:",
      process.env.DRIZZLE_DB_URL
    );

    const result =
      await db
        .insert(MockInterview)
        .values(
          normalizedBody
        )
        .returning({
          id:
            MockInterview.id,
        });

    return NextResponse.json(
      {

        success: true,

        interviewId:
          result[0]?.id,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "CREATE INTERVIEW ERROR:",
      error
    );

    return NextResponse.json(
      {

        success: false,

        message:
          "Failed to create interview",
      },
      {
        status: 500,
      }
    );
  }
}