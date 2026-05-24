import { auth } from "@clerk/nextjs/server";

import { db }
from "@/utils/db";

import {
  MockInterview,
  UserAnswer,
} from "@/utils/schema";

import {
  eq,
  and,
} from "drizzle-orm";

export async function DELETE(
  req,
  { params }
) {

  try {

    const { userId } = auth();

    if (!userId) {

      return Response.json({

        success: false,

        message: "Unauthorized",

      }, { status: 401 });
    }

    const interviewId =
      Number(params.id);

    // FIND INTERVIEW
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

      return Response.json({

        success: false,

        message:
          "Interview not found",

      }, { status: 404 });
    }

    // VERIFY OWNER
    if (
      interview[0].createdBy !==
      userId
    ) {

      return Response.json({

        success: false,

        message:
          "Forbidden",

      }, { status: 403 });
    }

    // DELETE ANSWERS
    await db
      .delete(UserAnswer)
      .where(
        eq(
          UserAnswer.mockIdRef,
          String(interviewId)
        )
      );

    // DELETE INTERVIEW
    await db
      .delete(MockInterview)
      .where(
        eq(
          MockInterview.id,
          interviewId
        )
      );

    return Response.json({

      success: true,

      message:
        "Interview deleted successfully",
    });

  } catch (error) {

    console.log(
      "DELETE API ERROR:",
      error
    );

    return Response.json({

      success: false,

      message:
        "Failed to delete interview",
    });
  }
}