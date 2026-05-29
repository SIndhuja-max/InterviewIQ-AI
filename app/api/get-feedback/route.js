export const dynamic =
  "force-dynamic";

  export const revalidate =
  0;

import { NextResponse }
from "next/server";

import { db }
from "@/utils/db";

import { UserAnswer }
from "@/utils/schema";

import {
  eq,
  asc,
} from "drizzle-orm";

export async function GET(req) {

  try {

    const { searchParams } =
      new URL(req.url);

    const mockIdRef =
      searchParams.get(
        "mockIdRef"
      );

    // =========================
    // VALIDATION
    // =========================

    if (!mockIdRef) {

      return NextResponse.json(
        {

          success: false,

          message:
            "mockIdRef is required",

          feedback: [],
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // FETCH FEEDBACK
    // =========================

    const result =
      await db
        .select()
        .from(UserAnswer)
        .where(
          eq(
            UserAnswer.mockIdRef,
            String(mockIdRef)
          )
        )
        .orderBy(
          asc(UserAnswer.id)
        );

    // =========================
    // RESPONSE
    // =========================

    console.log(
  "GET FEEDBACK mockIdRef:",
  mockIdRef
);

console.log(
  "GET FEEDBACK COUNT:",
  result.length
);

console.log(
  "GET FEEDBACK IDS:",
  result.map(item => item.id)
);

    return NextResponse.json(
      {

        success: true,

        feedback: result,
      },
      {
        headers: {
      "Cache-Control":
        "no-store, no-cache, must-revalidate",
      },
    }
    );

  } catch (error) {

    console.log(
      "GET FEEDBACK ERROR:",
      error
    );

    return NextResponse.json(
      {

        success: false,

        message:
          "Failed to fetch feedback",

        feedback: [],
      },
      {
        status: 500,
      }
    );
  }
}