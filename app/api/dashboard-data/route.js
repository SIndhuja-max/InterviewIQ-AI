
export const dynamic =
  "force-dynamic";

import { NextResponse }
from "next/server";

import { db }
from "@/utils/db";

import { MockInterview }
from "@/utils/schema";

export async function GET(req) {

   throw new Error("TEST_123");

  try {

    const { searchParams } =
      new URL(req.url);

    const email =
      searchParams
        .get("email")
        ?.trim()
        ?.toLowerCase();

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

    const allRows =
      await db
        .select()
        .from(MockInterview);

    const interviews =
      allRows.filter(
        item =>
          item?.createdBy
            ?.trim()
            ?.toLowerCase() ===
          email
      );

    return NextResponse.json(
      {
        success: true,
        interviews,
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

