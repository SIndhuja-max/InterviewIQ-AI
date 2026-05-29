"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Link
from "next/link";

import {
  useParams,
} from "next/navigation";

import {
  Button,
} from "@/components/ui/button";

const Feedback = () => {

  const params =
    useParams();

  const interviewId =
    params?.interviewId;

  const [
    feedbackList,
    setFeedbackList,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // =========================
  // FETCH FEEDBACK
  // =========================

  useEffect(() => {

    if (interviewId) {

      GetFeedback();
    }

  }, [interviewId]);

  const GetFeedback =
    async () => {

      try {

        console.log(
          "FETCHING FEEDBACK FOR:",
          interviewId
        );

        const response =
          await fetch(

            `/api/get-feedback?mockIdRef=${interviewId}`,

            {
              cache: "no-store",
            }
          );

        const result =
          await response.json();

        console.log(
          "Feedback Result:",
          result
        );

        console.log(
  "FEEDBACK COUNT:",
  result?.feedback?.length
);

       setFeedbackList(
  Array.isArray(
    result?.feedback
  )
    ? result.feedback
    : []
);

      } catch (error) {

        console.log(
          "FEEDBACK FETCH ERROR:",
          error
        );
      }

      setLoading(false);
    };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <div className="
        min-h-screen
        bg-black
        text-white
        flex
        items-center
        justify-center
      ">

        Loading Feedback...

      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div className="
      min-h-screen
      bg-black
      text-white
      p-10
    ">

      <h1 className="
        text-5xl
        font-bold
        text-green-400
      ">

        Congratulations 🎉

      </h1>

      <h2 className="
        text-3xl
        font-semibold
        mt-4
      ">

        Here is your interview feedback

      </h2>

      {
        feedbackList.length === 0 ? (

          <div className="
            mt-16
          ">

            <h2 className="
              text-2xl
              text-yellow-400
            ">

              No interview feedback found

            </h2>

          </div>

        ) : (

          <div className="
            mt-10
            space-y-6
          ">

            {
              feedbackList.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}
                    className="
                      bg-[#111827]
                      border
                      border-gray-800
                      rounded-3xl
                      p-6
                    "
                  >

                    <h2 className="
                      text-xl
                      font-bold
                      text-blue-400
                    ">

                      Question

                    </h2>

                    <p className="
                      mt-2
                      text-gray-300
                      leading-7
                    ">

                      {item.question}

                    </p>

                    <div className="
                      mt-6
                    ">

                      <h2 className="
                        text-xl
                        font-bold
                        text-yellow-400
                      ">

                        Your Answer

                      </h2>

                      <p className="
                        mt-2
                        text-gray-300
                        leading-7
                      ">

                        {item.userAns}

                      </p>

                    </div>

                    <div className="
                      mt-6
                    ">

                      <h2 className="
                        text-xl
                        font-bold
                        text-green-400
                      ">

                        AI Feedback

                      </h2>

                      <p className="
                        mt-2
                        text-gray-300
                        leading-7
                      ">

                        {item.feedback}

                      </p>

                    </div>

                    <div className="
                      mt-6
                      flex
                      items-center
                      gap-3
                    ">

                      <h2 className="
                        text-xl
                        font-bold
                        text-pink-400
                      ">

                        Rating

                      </h2>

                      <span className="
                        bg-pink-500/20
                        text-pink-400
                        px-4
                        py-2
                        rounded-xl
                        font-semibold
                      ">

                        {item.rating}/10

                      </span>

                    </div>

                  </div>
                )
              )
            }

          </div>
        )
      }

      <div className="
        mt-10
      ">

        <Link
          href="/dashboard"
        >

          <Button
            className="
              bg-blue-600
              hover:bg-blue-700
              px-8
              py-6
              rounded-2xl
            "
          >

            Go Back to Dashboard

          </Button>

        </Link>

      </div>

    </div>
  );
};

export default Feedback;