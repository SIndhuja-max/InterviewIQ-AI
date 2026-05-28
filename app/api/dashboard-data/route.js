export const dynamic =
  "force-dynamic";

import { NextResponse } from "next/server";

import { db } from "@/utils/db";

import { MockInterview } from "@/utils/schema";

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

    // VALIDATION

    if (!email) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Email is required",
        },
        {
          status: 400,
        }
      );
    }

    // FETCH INTERVIEWS

    const result =
      await db
        .select()
        .from(MockInterview)
        .where(
          eq(
            MockInterview.createdBy,
            email
          )
        )
        .orderBy(
          desc(
            MockInterview.createdAt
          )
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
        message:
          "Failed to fetch dashboard data",
      },
      {
        status: 500,
      }
    );
  }
}