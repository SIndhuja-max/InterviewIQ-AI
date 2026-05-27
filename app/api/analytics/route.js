export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

import { db } from "@/utils/db";

import {
  MockInterview,
  UserAnswer,
} from "@/utils/schema";

import {
  eq,
  desc,
} from "drizzle-orm";

export async function GET(req) {

  try {

    const { searchParams } =
      new URL(req.url);

    // =====================
    // EMAIL VALIDATION
    // =====================

    const email =
      searchParams
        .get("email")
        ?.trim()
        ?.toLowerCase();

    console.log(
      "ANALYTICS EMAIL:",
      email
    );

    if (!email) {

      return NextResponse.json(
        {
          success: false,

          message:
            "Email is required",

          stats: {
            totalInterviews: 0,
            totalQuestions: 0,
            averageRating: 0,
            confidence: 0,
          },

          performanceData: [],

          activityData: [],
        },
        {
          status: 400,
        }
      );
    }

    // =====================
    // FETCH INTERVIEWS
    // =====================

    const interviews =
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

    // =====================
    // FETCH ANSWERS
    // =====================

    const answers =
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
          desc(
            UserAnswer.createdAt
          )
        );

    console.log(
      "INTERVIEWS:",
      interviews.length
    );

    console.log(
      "USER ANSWERS:",
      answers.length
    );

    // =====================
    // TOTALS
    // =====================

    const totalInterviews =
      interviews.length;

    const totalQuestions =
      answers.length;

    // =====================
    // AVERAGE RATING
    // =====================

    let averageRating = 0;

    if (answers.length > 0) {

      const totalRating =
        answers.reduce(
          (sum, item) => {

            const parsedRating =
              parseFloat(
                String(
                  item.rating || 0
                )
                  .replace("/10", "")
                  .trim()
              ) || 0;

            return (
              sum + parsedRating
            );

          },
          0
        );

      averageRating =
        Number(
          (
            totalRating /
            answers.length
          ).toFixed(1)
        );
    }

    // =====================
    // CONFIDENCE SCORE
    // =====================

    const confidence =
      averageRating > 0
        ? Math.min(
            Math.round(
              (averageRating / 10) *
                100
            ),
            100
          )
        : 0;

    // =====================
    // PERFORMANCE GRAPH
    // =====================

    const performanceData =
      answers.map(
        (item, index) => ({

          name:
            `Q${index + 1}`,

          rating:
            parseFloat(
              String(
                item.rating || 0
              )
                .replace("/10", "")
                .trim()
            ) || 0,
        })
      );

    // =====================
    // ACTIVITY GRAPH
    // =====================

    const weeklyData = {
      "Week 1": 0,
      "Week 2": 0,
      "Week 3": 0,
      "Week 4": 0,
    };

    interviews.forEach(
      (item) => {

        if (!item.createdAt)
          return;

        const date =
          new Date(
            item.createdAt
          );

        const day =
          date.getDate();

        const week =
          Math.ceil(day / 7);

        if (week === 1)
          weeklyData["Week 1"]++;

        else if (week === 2)
          weeklyData["Week 2"]++;

        else if (week === 3)
          weeklyData["Week 3"]++;

        else
          weeklyData["Week 4"]++;
      }
    );

    const activityData = [

      {
        week: "Week 1",
        interviews:
          weeklyData["Week 1"],
      },

      {
        week: "Week 2",
        interviews:
          weeklyData["Week 2"],
      },

      {
        week: "Week 3",
        interviews:
          weeklyData["Week 3"],
      },

      {
        week: "Week 4",
        interviews:
          weeklyData["Week 4"],
      },
    ];

    // =====================
    // FINAL RESPONSE
    // =====================

    return NextResponse.json(
      {
        success: true,

        stats: {

          totalInterviews,

          totalQuestions,

          averageRating,

          confidence,
        },

        performanceData,

        activityData,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "ANALYTICS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to load analytics",

        stats: {
          totalInterviews: 0,
          totalQuestions: 0,
          averageRating: 0,
          confidence: 0,
        },

        performanceData: [],

        activityData: [],
      },
      {
        status: 500,
      }
    );
  }
}