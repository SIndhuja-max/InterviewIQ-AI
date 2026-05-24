"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq, asc } from "drizzle-orm";
import { useRouter } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

const Feedback = ({ params }) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (params?.interviewId) {
      GetFeedback();
    }
  }, []);

  const GetFeedback = async () => {
    try {
      const result = await db
        .select()
        .from(UserAnswer)
        .where(
          eq(
            UserAnswer.mockIdRef,
            String(params.interviewId)
          )
        )
        .orderBy(asc(UserAnswer.id));

      console.log("Feedback Result:", result);

      setFeedbackList(result);

      if (result.length > 0) {
        const totalRating = result.reduce(
          (sum, item) =>
            sum + Number(item.rating || 0),
          0
        );

        const avgRating = (
          totalRating / result.length
        ).toFixed(1);

        setOverallRating(avgRating);
      }

    } catch (error) {
      console.log("Feedback Fetch Error:", error);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-10 text-white">
        Loading feedback...
      </div>
    );
  }

  return (
    <div className="p-10 text-white">

      <h2 className="text-4xl font-bold text-green-400">
        Congratulations 🎉
      </h2>

      <h2 className="font-bold text-2xl mt-3">
        Here is your interview feedback
      </h2>

      {feedbackList.length === 0 ? (
        <div className="mt-8">
          <h2 className="text-lg text-yellow-400">
            No interview feedback found
          </h2>
        </div>
      ) : (
        <>
          <div className="mt-6 bg-[#111827] border border-gray-800 rounded-2xl p-6">

            <h2 className="text-lg">
              Your Overall Interview Rating:
              <strong className="text-blue-400 ml-2">
                {overallRating}/10
              </strong>
            </h2>

            <p className="text-gray-400 mt-3">
              Below are your interview questions,
              your answers, ideal answers,
              and AI-generated feedback for improvement.
            </p>

          </div>

          <div className="mt-8">

            {feedbackList.map((item, index) => (
              <Collapsible
                key={index}
                className="mt-5"
              >
                <CollapsibleTrigger className="w-full p-4 flex justify-between items-center bg-[#111827] border border-gray-800 rounded-xl text-left">

                  <span>
                    {index + 1}. {item.question}
                  </span>

                  <ChevronsUpDown className="h-5 w-5" />

                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="flex flex-col gap-4 mt-4">

                    <div className="p-4 border border-red-400 rounded-xl bg-red-500/10">
                      <strong>Rating:</strong> {item.rating}/10
                    </div>

                    <div className="p-4 border border-yellow-400 rounded-xl bg-yellow-500/10">
                      <strong>Your Answer:</strong>
                      <p className="mt-2">
                        {item.userAns}
                      </p>
                    </div>

                    <div className="p-4 border border-green-400 rounded-xl bg-green-500/10">
                      <strong>Ideal Answer:</strong>
                      <p className="mt-2">
                        {item.correctAns || "Not Available"}
                      </p>
                    </div>

                    <div className="p-4 border border-blue-400 rounded-xl bg-blue-500/10">
                      <strong>AI Feedback:</strong>
                      <p className="mt-2">
                        {item.feedback}
                      </p>
                    </div>

                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}

          </div>
        </>
      )}

      <Button
        className="mt-10 bg-blue-600 hover:bg-blue-700"
        onClick={() => router.replace("/dashboard")}
      >
        Go Back to Dashboard
      </Button>

    </div>
  );
};

export default Feedback;