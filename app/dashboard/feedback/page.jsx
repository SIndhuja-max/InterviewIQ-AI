"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  useUser,
} from "@clerk/nextjs";

const FeedbackPage = () => {

  const { user } =
    useUser();

  const [
    feedbacks,
    setFeedbacks,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // =========================
  // FETCH FEEDBACKS
  // =========================

  useEffect(() => {

    if (user) {

      GetAllFeedback();
    }

  }, [user]);

  const GetAllFeedback =
    async () => {

      try {

        const response =
          await fetch(

            `/api/all-feedback?email=${user?.primaryEmailAddress?.emailAddress}`

          );

        const result =
          await response.json();

        console.log(
          "ALL FEEDBACKS:",
          result
        );

        setFeedbacks(
          result
        );

      } catch (error) {

        console.log(
          "Feedback Fetch Error:",
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
        p-10
        text-white
      ">

        Loading feedback...

      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div className="
      p-10
      text-white
    ">

      <h1 className="
        text-4xl
        font-bold
        mb-8
      ">

        AI Feedback History

      </h1>

      <div className="
        grid
        gap-6
      ">

        {
          feedbacks.length > 0 ? (

            feedbacks.map(
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
                    rounded-2xl
                    p-6
                  "
                >

                  {/* TOP */}

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-4
                  ">

                    <h2 className="
                      text-xl
                      font-semibold
                    ">

                      {item.question}

                    </h2>

                    <span className="
                      bg-blue-500/20
                      text-blue-400
                      px-4
                      py-2
                      rounded-xl
                    ">

                      {item.rating}/10

                    </span>

                  </div>

                  {/* CONTENT */}

                  <div className="
                    space-y-4
                  ">

                    {/* ANSWER */}

                    <div>

                      <h3 className="
                        text-yellow-400
                        font-medium
                        mb-1
                      ">

                        Your Answer

                      </h3>

                      <p className="
                        text-gray-300
                      ">

                        {item.userAns}

                      </p>

                    </div>

                    {/* FEEDBACK */}

                    <div>

                      <h3 className="
                        text-green-400
                        font-medium
                        mb-1
                      ">

                        AI Feedback

                      </h3>

                      <p className="
                        text-gray-300
                      ">

                        {item.feedback}

                      </p>

                    </div>

                  </div>

                </div>
              )
            )

          ) : (

            <div className="
              bg-[#111827]
              border
              border-gray-800
              rounded-2xl
              p-10
              text-center
            ">

              <h2 className="
                text-2xl
                font-bold
              ">

                No Feedback Found

              </h2>

              <p className="
                text-gray-400
                mt-3
              ">

                Complete interviews to see feedback history.

              </p>

            </div>
          )
        }

      </div>

    </div>
  );
};

export default FeedbackPage;