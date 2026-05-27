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
      searchParams.get("id");

    const email =
      searchParams.get("email");

    const result =
      await db
        .select()
        .from(MockInterview)
        .where(
          eq(
            MockInterview.id,
            Number(id)
          )
        );

    const interview =
      result.find(
        (item) =>
          item.createdBy ===
          email
      );

    if (!interview) {

      return NextResponse.json({

        success: false,
      });
    }

    return NextResponse.json({

      success: true,

      interview,
    });

  } catch (error) {

    console.log(
      "INTERVIEW DETAILS ERROR:",
      error
    );

    return NextResponse.json({

      success: false,
    });
  }
}