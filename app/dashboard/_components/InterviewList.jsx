"use client";

import React, {
  useEffect,
  useState,
} from "react";

import InterviewCard
from "./InterviewCard";

import {
  useUser,
} from "@clerk/nextjs";

const InterviewList = () => {

  const { user } =
    useUser();

  const [
    interviewList,
    setInterviewList,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  // =========================
  // FETCH INTERVIEWS
  // =========================

  useEffect(() => {

    if (user) {

      GetInterviewList();
    }

  }, [user]);

  const GetInterviewList =
  async () => {

    try {

      setLoading(true);

      const email =
        user
          ?.primaryEmailAddress
          ?.emailAddress
          ?.trim()
          ?.toLowerCase();

      if (!email) {

        setInterviewList([]);

        return;
      }

      const response =
        await fetch(

          `/api/dashboard-data?email=${encodeURIComponent(email)}`,

          {
            cache: "no-store",
          }
        );

      if (!response.ok) {

        throw new Error(
          "Failed to fetch interviews"
        );
      }

      const result =
        await response.json();

      console.log(
        "FETCHED INTERVIEWS:",
        result
      );

      if (!result.success) {

        throw new Error(

          result?.message ||

          "Interview fetch failed"
        );
      }

      setInterviewList(

        Array.isArray(
          result?.interviews
        )

          ? result.interviews

          : []
      );

    } catch (error) {

      console.log(
        "FETCH ERROR:",
        error
      );

      setInterviewList([]);

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <p className="
        text-gray-400
        mt-10
      ">

        Loading interviews...

      </p>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div className="mt-10">

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div>

          <h2
            className="
              text-3xl
              font-bold
              text-white
            "
          >

            Previous Interviews

          </h2>

          <p
            className="
              text-gray-400
              mt-1
            "
          >

            Track and continue your AI mock interviews

          </p>

        </div>

      </div>

      {/* GRID */}

      {
        interviewList?.length > 0 ? (

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-6
            "
          >

            {
              interviewList.map(
                (
                  interview,
                  index
                ) => (

                  <InterviewCard
                    key={
                      interview?.id ||
                      index
                    }
                    interview={
                      interview
                    }
                  />
                )
              )
            }

          </div>

        ) : (

          <div
            className="
              bg-[#111827]
              border
              border-gray-800
              rounded-3xl
              p-10
              text-center
            "
          >

            <h2
              className="
                text-2xl
                font-bold
                text-white
              "
            >

              No Interviews Yet

            </h2>

            <p
              className="
                text-gray-400
                mt-3
              "
            >

              Create your first AI interview to begin practicing.

            </p>

          </div>
        )
      }

    </div>
  );
};

export default InterviewList;