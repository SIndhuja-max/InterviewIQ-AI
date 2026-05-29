
export const dynamic =
  "force-dynamic";

export const revalidate = 0;

import { NextResponse }
from "next/server";

import { db }
from "@/utils/db";

import { MockInterview }
from "@/utils/schema";


export async function GET(req) {

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
    headers: {
      "Cache-Control":
        "no-store, no-cache, must-revalidate",
    },
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

