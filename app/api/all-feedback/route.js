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

export async function GET(req) {

  try {

    const { searchParams } =
      new URL(req.url);

    const email =
      searchParams.get(
        "email"
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

    return NextResponse.json(
      result
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