
import { NextResponse }
from "next/server";

import { db }
from "@/utils/db";

import { MockInterview }
from "@/utils/schema";

import { eq }
from "drizzle-orm";

export async function GET(req) {

  try {

    const { searchParams } =
      new URL(req.url);

    const id =
      Number(
        searchParams.get("id")
      );

    const email =
      searchParams
        .get("email")
        ?.trim()
        ?.toLowerCase();

    const result =
      await db
        .select()
        .from(MockInterview)
        .where(
          eq(
            MockInterview.id,
            id
          )
        );

    const interview =
      result.find(
        (item) =>
          item?.createdBy
            ?.trim()
            ?.toLowerCase() ===
          email
      );

    if (!interview) {

      console.log(
        "AUTH FAILED",
        {
          requestedEmail:
            email,
          dbEmail:
            result?.[0]
              ?.createdBy,
        }
      );

      return NextResponse.json(
        {
          success: false,
        },
        {
          status: 403,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        interview,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "INTERVIEW DETAILS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

