"use client";

import React, {
  useEffect,
  useState,
} from "react";

import dynamic from "next/dynamic";

import {
  Briefcase,
  Star,
  Brain,
  MessageSquare,
  TrendingUp,
  Activity,
} from "lucide-react";

import { db } from "@/utils/db";

import {
  MockInterview,
  UserAnswer,
} from "@/utils/schema";

import { eq } from "drizzle-orm";

import { useUser } from "@clerk/nextjs";

// =======================
// RECHARTS
// =======================

const ResponsiveContainer =
  dynamic(
    () =>
      import("recharts")
        .then(
          (mod) =>
            mod.ResponsiveContainer
        ),
    { ssr: false }
  );

const LineChart =
  dynamic(
    () =>
      import("recharts")
        .then(
          (mod) =>
            mod.LineChart
        ),
    { ssr: false }
  );

const Line =
  dynamic(
    () =>
      import("recharts")
        .then(
          (mod) =>
            mod.Line
        ),
    { ssr: false }
  );

const AreaChart =
  dynamic(
    () =>
      import("recharts")
        .then(
          (mod) =>
            mod.AreaChart
        ),
    { ssr: false }
  );

const Area =
  dynamic(
    () =>
      import("recharts")
        .then(
          (mod) =>
            mod.Area
        ),
    { ssr: false }
  );

const XAxis =
  dynamic(
    () =>
      import("recharts")
        .then(
          (mod) =>
            mod.XAxis
        ),
    { ssr: false }
  );

const Tooltip =
  dynamic(
    () =>
      import("recharts")
        .then(
          (mod) =>
            mod.Tooltip
        ),
    { ssr: false }
  );

const Analytics = () => {

  const { user } =
    useUser();

  const [
    stats,
    setStats,
  ] = useState({

    totalInterviews: 0,

    totalQuestions: 0,

    averageRating: 0,

    confidence: 0,
  });

  const [
    performanceData,
    setPerformanceData,
  ] = useState([]);

  const [
    activityData,
    setActivityData,
  ] = useState([]);

  useEffect(() => {

    if (user) {

      GetAnalytics();
    }

  }, [user]);

  const GetAnalytics =
    async () => {

      try {

        // =======================
        // INTERVIEWS
        // =======================

        const interviews =
          await db
            .select()
            .from(MockInterview)
            .where(
              eq(
                MockInterview.createdBy,
                user
                  ?.primaryEmailAddress
                  ?.emailAddress
              )
            );

        // =======================
        // ANSWERS
        // =======================

        const answers =
          await db
            .select()
            .from(UserAnswer)
            .where(
              eq(
                UserAnswer.userEmail,
                user
                  ?.primaryEmailAddress
                  ?.emailAddress
              )
            );

        // =======================
        // TOTAL QUESTIONS
        // =======================

        const totalQuestions =
          answers.length;

        // =======================
        // RATINGS
        // =======================

        const ratings =
          answers
            .map((item) =>
              parseFloat(
                item.rating
              )
            )
            .filter(
              (rating) =>
                !isNaN(
                  rating
                )
            );

        // =======================
        // AVERAGE
        // =======================

        const averageRating =
          ratings.length > 0
            ? (
                ratings.reduce(
                  (a, b) =>
                    a + b,
                  0
                ) /
                ratings.length
              ).toFixed(1)
            : 0;

        // =======================
        // CONFIDENCE
        // =======================

        const confidence =
          averageRating * 10;

        setStats({

          totalInterviews:
            interviews.length,

          totalQuestions,

          averageRating,

          confidence,
        });

        // =======================
        // PERFORMANCE GRAPH
        // =======================

        const performance =
          ratings.map(
            (
              rating,
              index
            ) => ({

              name:
                `Q${index + 1}`,

              rating,
            })
          );

        setPerformanceData(
          performance
        );

        // =======================
        // ACTIVITY GRAPH
        // =======================

        const activity = [

          {
            week:
              "Week 1",

            interviews:
              Math.min(
                interviews.length,
                1
              ),
          },

          {
            week:
              "Week 2",

            interviews:
              Math.min(
                interviews.length,
                2
              ),
          },

          {
            week:
              "Week 3",

            interviews:
              Math.min(
                interviews.length,
                4
              ),
          },

          {
            week:
              "Week 4",

            interviews:
              interviews.length,
          },
        ];

        setActivityData(
          activity
        );

      } catch (error) {

        console.log(
          "Analytics Error:",
          error
        );
      }
    };

  const analyticsCards = [

    {
      title:
        "Total Interviews",

      value:
        stats.totalInterviews,

      icon:
        Briefcase,

      color:
        "text-blue-400",

      bg:
        "bg-blue-500/20",
    },

    {
      title:
        "Questions Answered",

      value:
        stats.totalQuestions,

      icon:
        MessageSquare,

      color:
        "text-purple-400",

      bg:
        "bg-purple-500/20",
    },

    {
      title:
        "Average Rating",

      value:
        `${stats.averageRating}/10`,

      icon:
        Star,

      color:
        "text-yellow-400",

      bg:
        "bg-yellow-500/20",
    },

    {
      title:
        "Confidence Score",

      value:
        `${stats.confidence}%`,

      icon:
        Brain,

      color:
        "text-green-400",

      bg:
        "bg-green-500/20",
    },
  ];

  return (

    <div>

      {/* ===================== */}
      {/* TOP CARDS */}
      {/* ===================== */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">

        {
          analyticsCards.map(
            (
              card,
              index
            ) => {

              const Icon =
                card.icon;

              return (

                <div
                  key={index}
                  className="
                    bg-[#111827]
                    border
                    border-gray-800
                    rounded-3xl
                    p-6
                    hover:border-blue-500
                    transition-all
                    duration-300
                  "
                >

                  <div className="
                    flex
                    items-center
                    justify-between
                  ">

                    <div>

                      <p className="
                        text-gray-400
                        text-sm
                      ">
                        {card.title}
                      </p>

                      <h2 className="
                        text-4xl
                        font-bold
                        text-white
                        mt-3
                      ">
                        {card.value}
                      </h2>

                    </div>

                    <div
                      className={`
                        ${card.bg}
                        p-4
                        rounded-2xl
                      `}
                    >

                      <Icon
                        className={
                          card.color
                        }
                        size={28}
                      />

                    </div>

                  </div>

                </div>
              );
            }
          )
        }

      </div>

      {/* ===================== */}
      {/* CHARTS */}
      {/* ===================== */}

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-6
        mt-8
      ">

        {/* PERFORMANCE */}
        <div
          className="
            bg-[#111827]
            border
            border-gray-800
            rounded-3xl
            p-6
          "
        >

          <div className="
            flex
            items-center
            gap-3
            mb-6
          ">

            <TrendingUp
              className="
                text-blue-400
              "
            />

            <h2 className="
              text-2xl
              font-bold
            ">

              Performance Analytics

            </h2>

          </div>

          <div className="
            h-[320px]
          ">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart
                data={
                  performanceData
                }
              >

                <XAxis
                  dataKey="name"
                  stroke="#666"
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* ACTIVITY */}
        <div
          className="
            bg-[#111827]
            border
            border-gray-800
            rounded-3xl
            p-6
          "
        >

          <div className="
            flex
            items-center
            gap-3
            mb-6
          ">

            <Activity
              className="
                text-green-400
              "
            />

            <h2 className="
              text-2xl
              font-bold
            ">

              Interview Activity

            </h2>

          </div>

          <div className="
            h-[320px]
          ">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={
                  activityData
                }
              >

                <XAxis
                  dataKey="week"
                  stroke="#666"
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="interviews"
                  stroke="#22c55e"
                  fill="#22c55e"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Analytics;