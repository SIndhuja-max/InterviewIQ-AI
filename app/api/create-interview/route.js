import { NextResponse } from "next/server";

import { db } from "@/utils/db";

import { MockInterview } from "@/utils/schema";

export async function POST(req) {

  try {

    const body =
      await req.json();

    const {
      jsonMockResp,
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy,
    } = body;

    // VALIDATIONS

    if (
      !jsonMockResp ||
      !jobPosition ||
      !jobDesc ||
      !jobExperience ||
      !createdBy
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields",
        },
        {
          status: 400,
        }
      );
    }

    // Validate JSON format

    try {

      JSON.parse(
        jsonMockResp
      );

    } catch {

      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid interview JSON format",
        },
        {
          status: 400,
        }
      );
    }

    // INSERT

    const result =
      await db
        .insert(MockInterview)
        .values({
          jsonMockResp,
          jobPosition,
          jobDesc,
          jobExperience,
          createdBy,
        })
        .returning({
          id:
            MockInterview.id,
        });

    return NextResponse.json(
      {
        success: true,

        interviewId:
          result[0]?.id,
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.log(
      "CREATE INTERVIEW ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}