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

const YAxis =
  dynamic(
    () =>
      import("recharts")
        .then(
          (mod) =>
            mod.YAxis
        ),
    { ssr: false }
  );

const CartesianGrid =
  dynamic(
    () =>
      import("recharts")
        .then(
          (mod) =>
            mod.CartesianGrid
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

        const totalQuestions =
          answers.length;

        const ratings =
          answers
            .map((item) =>
              parseFloat(
                item.rating
              )
            )
            .filter(
              (rating) =>
                !isNaN(rating)
            );

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

        const confidence =
          averageRating * 10;

        setStats({

          totalInterviews:
            interviews.length,

          totalQuestions,

          averageRating,

          confidence,
        });

        const performance =
          ratings.length > 0
            ? ratings.map(
                (
                  rating,
                  index
                ) => ({

                  name:
                    `Q${index + 1}`,

                  rating,
                })
              )
            : [
                {
                  name: "Q1",
                  rating: 0,
                },
              ];

        setPerformanceData(
          performance
        );

        const weeklyData = {
          "Week 1": 0,
          "Week 2": 0,
          "Week 3": 0,
          "Week 4": 0,
        };

interviews.forEach((interview) => {

  const date =
    new Date(interview.createdAt);

  const day =
    date.getDate();

  if (day <= 7) {

    weeklyData["Week 1"]++;

  } else if (day <= 14) {

    weeklyData["Week 2"]++;

  } else if (day <= 21) {

    weeklyData["Week 3"]++;

  } else {

    weeklyData["Week 4"]++;
  }
});

const activity = Object.keys(
  weeklyData
).map((week) => ({

  week,

  interviews:
    weeklyData[week],
}));

 


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

      {/* TOP CARDS */}

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

      {/* CHARTS */}

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
              text-white
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

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                />

                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                />

                <YAxis
                  stroke="#9ca3af"
                  domain={[0, 10]}
                />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{ r: 5 }}
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
              text-white
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

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                />

                <XAxis
                  dataKey="week"
                  stroke="#9ca3af"
                />

                <YAxis
                  stroke="#9ca3af"
                />

                <Tooltip />

                <Area
                  type="linear"
                  dataKey="interviews"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.08}
                  strokeWidth={3}
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