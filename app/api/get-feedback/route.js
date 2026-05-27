export const dynamic =
  "force-dynamic";

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

    return NextResponse.json(
      {

        success: true,

        feedback: result,
      },
      {
        status: 200,
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