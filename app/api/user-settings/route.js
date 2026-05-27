import { NextResponse }
from "next/server";

import { db }
from "@/utils/db";

import { UserSettings }
from "@/utils/schema";

import { eq }
from "drizzle-orm";

// =========================
// GET SETTINGS
// =========================

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

          message:
            "Email required",
        },
        {
          status: 400,
        }
      );
    }

    const settings =
      await db
        .select()
        .from(UserSettings)
        .where(
          eq(
            UserSettings.userEmail,
            email
          )
        );

    // DEFAULT SETTINGS

    if (
      settings.length === 0
    ) {

      return NextResponse.json(
        {

          success: true,

          settings: {

            difficulty:
              "Intermediate",

            notifications:
              "enabled",

            aiFeedback:
              "enabled",
          },
        },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      {

        success: true,

        settings:
          settings[0],
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "GET SETTINGS ERROR:",
      error
    );

    return NextResponse.json(
      {

        success: false,

        message:
          "Failed to fetch settings",
      },
      {
        status: 500,
      }
    );
  }
}

// =========================
// SAVE SETTINGS
// =========================

export async function POST(req) {

  try {

    const body =
      await req.json();

    const {

      email,

      difficulty,

      notifications,

      aiFeedback,

    } = body;

    const normalizedEmail =
      email
        ?.trim()
        ?.toLowerCase();

    if (!normalizedEmail) {

      return NextResponse.json(
        {

          success: false,

          message:
            "Email required",
        },
        {
          status: 400,
        }
      );
    }

    // CHECK EXISTING

    const existing =
      await db
        .select()
        .from(UserSettings)
        .where(
          eq(
            UserSettings.userEmail,
            normalizedEmail
          )
        );

    if (
      existing.length === 0
    ) {

      await db
        .insert(UserSettings)
        .values({

          userEmail:
            normalizedEmail,

          difficulty:
            difficulty ||

            "Intermediate",

          notifications:
            notifications ||

            "enabled",

          aiFeedback:
            aiFeedback ||

            "enabled",
        });

    } else {

      await db
        .update(UserSettings)
        .set({

          ...(difficulty && {
            difficulty,
          }),

          ...(notifications && {
            notifications,
          }),

          ...(aiFeedback && {
            aiFeedback,
          }),
        })
        .where(
          eq(
            UserSettings.userEmail,
            normalizedEmail
          )
        );
    }

    return NextResponse.json(
      {

        success: true,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "SAVE SETTINGS ERROR:",
      error
    );

    return NextResponse.json(
      {

        success: false,
      },
      {
        status: 500,
      }
    );
  }
}