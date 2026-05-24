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

    const interviewId =
      Number(params.id);

    console.log(
      "DELETE ID:",
      interviewId
    );

    // DELETE USER ANSWERS FIRST
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