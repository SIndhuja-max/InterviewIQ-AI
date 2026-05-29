import { NextResponse }
from "next/server";

import { db }
from "@/utils/db";

import { UserAnswer }
from "@/utils/schema";

import {
  eq,
  desc,
} from "drizzle-orm";

export const dynamic =
  "force-dynamic";

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
      "ALL FEEDBACK EMAIL:",
      email
    );

    const result =
      await db
        .select()
        .from(UserAnswer)
        .where(
          eq(
            UserAnswer.userEmail,
            email
          )
        )
        .orderBy(
          desc(UserAnswer.id)
        );

    console.log(
      "ALL FEEDBACK COUNT:",
      result.length
    );

    return NextResponse.json(
      result,
      {
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );

  } catch (error) {

    console.log(
      "ALL FEEDBACK ERROR:",
      error
    );

    return NextResponse.json(
      []
    );
  }
}