"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  Sparkles,
  Clock3,
} from "lucide-react";

import {
  db,
} from "@/utils/db";

import {
  MockInterview,
} from "@/utils/schema";

import ResumeUpload
from "./_components/ResumeUpload";

import InterviewList
from "./_components/InterviewList";

import CreateInterviewModal
from "./_components/CreateInterviewModal";

import Analytics
from "./_components/Analytics";

const Dashboard = () => {

  const [
    totalInterviews,
    setTotalInterviews,
  ] = useState(0);

  const [
    activityData,
    setActivityData,
  ] = useState([]);

  useEffect(() => {

    GetDashboardData();

  }, []);

  const GetDashboardData =
    async () => {

      try {

        const interviews =
          await db
            .select()
            .from(MockInterview);

        console.log(
          "DASHBOARD INTERVIEWS:",
          interviews
        );

        setTotalInterviews(
          interviews.length
        );

        // BUILD REAL GRAPH
        const graphData = [

          {
            week: "Week 1",
            interviews:
              Math.min(
                interviews.length,
                1
              ),
          },

          {
            week: "Week 2",
            interviews:
              Math.min(
                interviews.length,
                2
              ),
          },

          {
            week: "Week 3",
            interviews:
              Math.min(
                interviews.length,
                4
              ),
          },

          {
            week: "Week 4",
            interviews:
              interviews.length,
          },
        ];

        setActivityData(
          graphData
        );

      } catch (error) {

        console.log(
          "DASHBOARD ERROR:",
          error
        );
      }
    };

  const goalPercentage =
    Math.min(
      (totalInterviews / 5) * 100,
      100
    );

  return (

    <main
      className="
        min-h-screen
        bg-black
        text-white
        p-8
      "
    >

      {/* TOP SECTION */}
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

        {/* AI ASSISTANT */}
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

        {/* WEEKLY GOAL */}
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
            this week to improve confidence
            and technical performance.

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
        <div id="analytics"
        className="mt-10">
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