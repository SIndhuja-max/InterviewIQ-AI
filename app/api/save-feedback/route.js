import { NextResponse } from "next/server";

import { db }
from "@/utils/db";

import { UserAnswer }
from "@/utils/schema";

export async function POST(req) {

  try {

    const body =
      await req.json();

    console.log(
      "SAVE FEEDBACK BODY:",
      body
    );

    const {

      mockIdRef,

      question,

      correctAns,

      userAns,

      feedback,

      rating,

      userEmail,

    } = body;

    // =========================
    // VALIDATION
    // =========================

    if (

      !mockIdRef ||

      !question ||

      !userAns ||

      !userEmail
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

    // =========================
    // NORMALIZE RATING
    // =========================

    const normalizedRating =
      parseFloat(
        String(rating || 0)
          .replace("/10", "")
          .trim()
      ) || 0;

    // =========================
    // NORMALIZE EMAIL
    // =========================

    const normalizedEmail =
      userEmail
        ?.trim()
        ?.toLowerCase();

    // =========================
    // INSERT DATABASE
    // =========================

    await db
      .insert(UserAnswer)
      .values({

        mockIdRef:
          String(mockIdRef),

        question:
          question.trim(),

        correctAns:
          correctAns || "",

        userAns:
          userAns.trim(),

        feedback:
          feedback || "",

        rating:
          String(
            normalizedRating
          ),

        userEmail:
          normalizedEmail,
      });

    console.log(
      "DATABASE INSERT SUCCESS"
    );

    return NextResponse.json(
      {
        success: true,

        message:
          "Feedback saved successfully",
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.log(
      "SAVE FEEDBACK ERROR:",
      error
    );

    return NextResponse.json(
      {

        success: false,

        message:
          "Failed to save feedback",

        error:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}