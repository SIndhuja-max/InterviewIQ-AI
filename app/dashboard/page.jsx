"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Link
from "next/link";

import {
  Sparkles,
  Clock3,
} from "lucide-react";

import ResumeUpload
from "./_components/ResumeUpload";

import InterviewList
from "./_components/InterviewList";

import CreateInterviewModal
from "./_components/CreateInterviewModal";

import Analytics
from "./_components/Analytics";

import {
  useUser,
} from "@clerk/nextjs";

const Dashboard = () => {

  const { user } =
    useUser();

  const [
    totalInterviews,
    setTotalInterviews,
  ] = useState(0);

  const [
    activityData,
    setActivityData,
  ] = useState([]);

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  useEffect(() => {

    if (user) {

      GetDashboardData();
    }

  }, [user]);

  const GetDashboardData =
  async () => {

    try {

      const email =
        user
          ?.primaryEmailAddress
          ?.emailAddress
          ?.trim()
          ?.toLowerCase();

      if (!email) {
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
          "Failed to fetch dashboard data"
        );
      }

      const data =
        await response.json();

      console.log(
        "DASHBOARD DATA:",
        data
      );

      if (!data.success) {

        throw new Error(

          data?.message ||

          "Dashboard fetch failed"
        );
      }

      const interviews =
        Array.isArray(
          data?.interviews
        )

          ? data.interviews

          : [];

      setTotalInterviews(
        interviews.length
      );

      // =========================
      // BUILD WEEKLY GRAPH
      // =========================

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

      setActivityData([

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
      ]);

    } catch (error) {

      console.log(
        "DASHBOARD ERROR:",
        error
      );

      setTotalInterviews(0);

      setActivityData([]);
    }
  }; 

  // =========================
  // GOAL %
  // =========================

  const goalPercentage =
    Math.min(
      (totalInterviews / 5) * 100,
      100
    );

  // =========================
  // UI
  // =========================

  return (

    <main
      className="
        min-h-screen
        bg-black
        text-white
        p-8
      "
    >

      {/* TOP */}

      <div
        className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-6
          mb-10
        "
      >

        <div>

          <h1
            className="
              text-4xl
              font-bold
            "
          >

            Welcome Back 👋

          </h1>

          <p
            className="
              text-gray-400
              mt-2
              text-lg
            "
          >

            Track your AI interview preparation,
            resume analysis,
            and performance insights.

          </p>

        </div>

        <CreateInterviewModal />

      </div>

      {/* HERO */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-6
          mt-10
        "
      >

        {/* AI SECTION */}

        <div
          className="
            lg:col-span-2
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            rounded-3xl
            p-8
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
              mb-5
            "
          >

            <Sparkles
              className="
                text-yellow-300
              "
            />

            <h2
              className="
                text-3xl
                font-bold
              "
            >

              AI Interview Assistant

            </h2>

          </div>

          <p
            className="
              text-lg
              leading-8
              text-gray-200
              max-w-2xl
            "
          >

            Practice technical and HR interviews
            using AI-generated questions,
            speech analysis,
            webcam interaction,
            and intelligent performance feedback.

          </p>

          {/* BUTTONS */}

          <div
            className="
              flex
              gap-4
              mt-8
              flex-wrap
            "
          >

            <Link href="#interviews">

              <button
                className="
                  bg-white
                  text-black
                  px-6
                  py-3
                  rounded-2xl
                  font-semibold
                  hover:scale-105
                  transition-all
                "
              >

                Start Interview

              </button>

            </Link>

            <Link href="#resume">

              <button
                className="
                  border
                  border-white
                  px-6
                  py-3
                  rounded-2xl
                  hover:bg-white
                  hover:text-black
                  transition-all
                "
              >

                Resume Insights

              </button>

            </Link>

          </div>

        </div>

        {/* GOAL */}

        <div
          className="
            bg-[#111827]
            border
            border-gray-800
            rounded-3xl
            p-8
          "
        >

          <div
            className="
              bg-green-500/20
              w-fit
              p-3
              rounded-2xl
            "
          >

            <Clock3
              className="
                text-green-400
              "
            />

          </div>

          <h2
            className="
              text-2xl
              font-bold
              mt-6
            "
          >

            Weekly Goal

          </h2>

          <p
            className="
              text-gray-400
              mt-3
              leading-7
            "
          >

            Complete at least 5 AI mock interviews
            this week.

          </p>

          <div className="mt-6">

            <div
              className="
                w-full
                bg-gray-800
                rounded-full
                h-3
              "
            >

              <div
                className="
                  bg-green-500
                  h-3
                  rounded-full
                "
                style={{
                  width:
                    `${goalPercentage}%`,
                }}
              />

            </div>

            <p
              className="
                text-sm
                text-gray-400
                mt-3
              "
            >

              {
                totalInterviews
              } / 5 interviews completed

            </p>

          </div>

        </div>

      </div>

      {/* ANALYTICS */}

      <div
        id="analytics"
        className="mt-10"
      >

        <Analytics />

      </div>

      {/* RESUME */}

      <div
        id="resume"
        className="mt-10"
      >

        <ResumeUpload />

      </div>

      {/* INTERVIEWS */}

      <div
        id="interviews"
        className="mt-10"
      >

        <InterviewList />

      </div>

    </main>
  );
};

export default Dashboard;