export const dynamic =
  "force-dynamic";

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

    const email =
      searchParams
        .get("email")
        ?.trim()
        ?.toLowerCase();

    console.log(
      "FETCH EMAIL:",
      email
    );

    if (!email) {

      return NextResponse.json(
        {

          success: false,

          interviews: [],
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await db
        .select()
        .from(MockInterview)
        .where(
          eq(
            MockInterview.createdBy,
            email
          )
        );

        console.log(
  "INTERVIEW COUNT:",
  result.length
);

console.log(
  "INTERVIEW IDS:",
  result.map(
    item => item.id
  )
);

console.log(
  "FULL RESULT:",
  JSON.stringify(result)
);

    console.log(
      "FETCHED INTERVIEWS:",
      result
    );

    return NextResponse.json(
      {

        success: true,

        interviews: result,
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

        interviews: [],
      },
      {
        status: 500,
      }
    );
  }
}