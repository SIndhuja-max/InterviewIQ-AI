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
      auth();

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
    // GET CURRENT USER
    // =========================

    const user =
      await currentUser();

    const userEmail =
      user?.emailAddresses?.[0]
        ?.emailAddress
        ?.trim()
        ?.toLowerCase();

    console.log(
      "DELETE USER EMAIL:",
      userEmail
    );

    const interviewId =
      Number(params.id);

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

    console.log(
      "INTERVIEW OWNER:",
      interview[0].createdBy
    );

    // =========================
    // VERIFY OWNER
    // =========================

     console.log(
  "OWNER:",
  JSON.stringify(
    interview[0]?.createdBy
  )
);

console.log(
  "USER:",
  JSON.stringify(
    userEmail
  )
);

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
    // DELETE ANSWERS
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

    return Response.json(
      {

        success: true,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "DELETE ERROR:",
      error
    );

    return Response.json(
      {

        success: false,

        message:
          "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}