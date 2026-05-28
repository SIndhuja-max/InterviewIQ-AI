export const dynamic =
  "force-dynamic";


import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

import { db }
from "@/utils/db";

import {
  MockInterview,
  UserAnswer,
} from "@/utils/schema";

import { eq }
from "drizzle-orm";

export async function DELETE(
  req,
  { params }
) {

  try {

    // =========================
    // AUTH
    // =========================

    const { userId } =
      await auth();

    if (!userId) {

      return Response.json(
        {

          success: false,

          message:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // CURRENT USER
    // =========================

    const user =
      await currentUser();

    const userEmail =
      user?.emailAddresses?.[0]
        ?.emailAddress
        ?.trim()
        ?.toLowerCase();

    if (!userEmail) {

      return Response.json(
        {

          success: false,

          message:
            "User email not found",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // INTERVIEW ID
    // =========================

    const interviewId =
      Number(params.id);

    if (!interviewId) {

      return Response.json(
        {

          success: false,

          message:
            "Invalid interview ID",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // FIND INTERVIEW
    // =========================

    const interview =
      await db
        .select()
        .from(MockInterview)
        .where(
          eq(
            MockInterview.id,
            interviewId
          )
        );

    if (
      !interview.length
    ) {

      return Response.json(
        {

          success: false,

          message:
            "Interview not found",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // VERIFY OWNER
    // =========================

    if (

      interview[0]
        ?.createdBy
        ?.trim()
        ?.toLowerCase()

      !==

      userEmail
    ) {

      return Response.json(
        {

          success: false,

          message:
            "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    // =========================
    // DELETE USER ANSWERS
    // =========================

    await db
      .delete(UserAnswer)
      .where(
        eq(
          UserAnswer.mockIdRef,
          String(interviewId)
        )
      );

    // =========================
    // DELETE INTERVIEW
    // =========================

    await db
      .delete(MockInterview)
      .where(
        eq(
          MockInterview.id,
          interviewId
        )
      );

    console.log(
      "INTERVIEW DELETED:",
      interviewId
    );

    return Response.json(
      {

        success: true,

        message:
          "Interview deleted successfully",
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "DELETE API ERROR:",
      error
    );

    return Response.json(
      {

        success: false,

        message:
          "Failed to delete interview",
      },
      {
        status: 500,
      }
    );
  }
}