"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  Briefcase,
  Star,
  Brain,
  MessageSquare,
  TrendingUp,
  Activity,
} from "lucide-react";

import {
  useUser,
} from "@clerk/nextjs";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const Analytics = () => {

  const { user } =
    useUser();

  const [
    loading,
    setLoading,
  ] = useState(true);

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

  // =======================
  // FETCH ANALYTICS
  // =======================

  useEffect(() => {

    if (
      user?.primaryEmailAddress
        ?.emailAddress
    ) {

      GetAnalytics();
    }

  }, [user]);

  const GetAnalytics =
    async () => {

      try {

        setLoading(true);

        const email =
          user
            ?.primaryEmailAddress
            ?.emailAddress
            ?.trim()
            ?.toLowerCase();

        console.log(
          "FETCH ANALYTICS EMAIL:",
          email
        );

        if (!email) {

          setLoading(false);

          return;
        }

        const response =
          await fetch(

            `/api/analytics?email=${encodeURIComponent(email)}`,

            {
              cache: "no-store",
            }
          );

        if (!response.ok) {

          throw new Error(
            "Failed to fetch analytics"
          );
        }

        const data =
          await response.json();

        console.log(
          "ANALYTICS DATA:",
          data
        );

        if (!data.success) {

          throw new Error(

            data?.message ||

            "Analytics fetch failed"
          );
        }

        // =======================
        // STATS
        // =======================

        setStats({

          totalInterviews:
            data?.stats
              ?.totalInterviews || 0,

          totalQuestions:
            data?.stats
              ?.totalQuestions || 0,

          averageRating:
            data?.stats
              ?.averageRating || 0,

          confidence:
            data?.stats
              ?.confidence || 0,
        });

        // =======================
        // PERFORMANCE GRAPH
        // =======================

        setPerformanceData(

          Array.isArray(
            data?.performanceData
          )

            ? data.performanceData

            : []
        );

        // =======================
        // ACTIVITY GRAPH
        // =======================

        setActivityData(

          Array.isArray(
            data?.activityData
          )

            ? data.activityData

            : []
        );

      } catch (error) {

        console.log(
          "ANALYTICS FETCH ERROR:",
          error
        );

        // RESET SAFE FALLBACK

        setStats({

          totalInterviews: 0,

          totalQuestions: 0,

          averageRating: 0,

          confidence: 0,
        });

        setPerformanceData([]);

        setActivityData([]);

      } finally {

        setLoading(false);
      }
    };

  // =======================
  // CARDS
  // =======================

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

  // =======================
  // LOADING UI
  // =======================

  if (loading) {

    return (

      <div
        className="
          text-white
          mt-10
          text-lg
        "
      >

        Loading analytics...

      </div>
    );
  }

  // =======================
  // MAIN UI
  // =======================

  return (

    <div>

      {/* TOP CARDS */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >

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

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <div>

                      <p
                        className="
                          text-gray-400
                          text-sm
                        "
                      >

                        {card.title}

                      </p>

                      <h2
                        className="
                          text-4xl
                          font-bold
                          text-white
                          mt-3
                        "
                      >

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

      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
          mt-8
        "
      >

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

          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >

            <TrendingUp
              className="
                text-blue-400
              "
            />

            <h2
              className="
                text-2xl
                font-bold
                text-white
              "
            >

              Performance Analytics

            </h2>

          </div>

          <div
            className="
              h-[320px]
            "
          >

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

          <div
            className="
              flex
              items-center
              gap-3
              mb-6
            "
          >

            <Activity
              className="
                text-green-400
              "
            />

            <h2
              className="
                text-2xl
                font-bold
                text-white
              "
            >

              Interview Activity

            </h2>

          </div>

          <div
            className="
              h-[320px]
            "
          >

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