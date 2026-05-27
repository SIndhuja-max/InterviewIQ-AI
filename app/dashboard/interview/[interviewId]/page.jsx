"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Link
from "next/link";

import Webcam
from "react-webcam";

import {
  Lightbulb,
  WebcamIcon,
} from "lucide-react";

import { Button }
from "@/components/ui/button";

import {
  useUser,
} from "@clerk/nextjs";

function Interview({
  params,
}) {

  const { user } =
    useUser();

  const [
    interviewData,
    setInterviewData,
  ] = useState(null);

  const [
    webCamEnabled,
    setWebCamEnabled,
  ] = useState(false);

  // =========================
  // FETCH INTERVIEW
  // =========================

  useEffect(() => {

    if (
      params?.interviewId &&
      user
    ) {

      GetInterviewDetails();
    }

  }, [
    params?.interviewId,
    user,
  ]);

  const GetInterviewDetails =
    async () => {

      try {

        const response =
          await fetch(

            `/api/interview-details?id=${params.interviewId}&email=${user?.primaryEmailAddress?.emailAddress}`

          );

        const data =
          await response.json();

        console.log(
          "Interview Details:",
          data
        );

        if (!data.success) {

          console.log(
            "Unauthorized Access"
          );

          return;
        }

        setInterviewData(
          data.interview
        );

      } catch (error) {

        console.log(
          "Fetch Error:",
          error
        );
      }
    };

  // =========================
  // UI
  // =========================

  return (

    <div className="
      my-10
      px-6
      text-white
    ">

      <h2 className="
        font-bold
        text-3xl
        mb-8
      ">

        Let’s Get Started 🚀

      </h2>

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-10
      ">

        {/* LEFT */}

        <div className="
          flex
          flex-col
          gap-6
        ">

          {/* DETAILS */}

          <div className="
            flex
            flex-col
            p-6
            rounded-2xl
            border
            border-gray-800
            bg-[#111827]
            gap-5
          ">

            <h2 className="text-lg">

              <strong>

                Job Role / Position:

              </strong>{" "}

              {
                interviewData?.jobPosition
              }

            </h2>

            <h2 className="text-lg">

              <strong>

                Tech Stack:

              </strong>{" "}

              {
                interviewData?.jobDesc
              }

            </h2>

            <h2 className="text-lg">

              <strong>

                Years of Experience:

              </strong>{" "}

              {
                interviewData?.jobExperience
              }

            </h2>

          </div>

          {/* INFO BOX */}

          <div className="
            p-6
            rounded-2xl
            border
            border-yellow-400
            bg-yellow-500/10
          ">

            <h2 className="
              flex
              gap-2
              items-center
              text-yellow-400
              font-semibold
              text-lg
            ">

              <Lightbulb />

              Interview Instructions

            </h2>

            <p className="
              mt-4
              text-yellow-200
              leading-7
            ">

              Make sure your webcam and microphone are enabled before starting the interview.

              Answer confidently,
              maintain eye contact,
              and speak clearly.

              Your AI feedback will be based on your response quality and confidence.

            </p>

          </div>

        </div>

        {/* RIGHT */}

        <div>

          {
            webCamEnabled ? (

              <div className="
                flex
                flex-col
                items-center
                gap-4
              ">

                <Webcam
                  mirrored={true}
                  onUserMedia={() =>
                    setWebCamEnabled(
                      true
                    )
                  }
                  onUserMediaError={() =>
                    setWebCamEnabled(
                      false
                    )
                  }
                  style={{

                    height: 350,

                    width: "100%",

                    borderRadius: "20px",
                  }}
                />

                <Button
                  variant="outline"
                  className="
                    w-full
                  "
                  onClick={() =>
                    setWebCamEnabled(
                      false
                    )
                  }
                >

                  Disable Webcam

                </Button>

              </div>

            ) : (

              <div className="
                flex
                flex-col
                gap-5
              ">

                <div className="
                  border
                  border-gray-800
                  rounded-2xl
                  bg-[#111827]
                  p-10
                  flex
                  items-center
                  justify-center
                ">

                  <WebcamIcon
                    className="
                      h-40
                      w-40
                      text-gray-500
                    "
                  />

                </div>

                <Button
                  className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                  "
                  onClick={() =>
                    setWebCamEnabled(
                      true
                    )
                  }
                >

                  Enable Webcam and Microphone

                </Button>

              </div>
            )
          }

        </div>

      </div>

      {/* START BUTTON */}

      <div className="
        flex
        justify-end
        mt-10
      ">

        <Link
          href={`/dashboard/interview/${params.interviewId}/start`}
        >

          <Button
            className="
              bg-blue-600
              hover:bg-blue-700
              px-8
              py-6
              text-base
              rounded-2xl
            "
          >

            Start Interview

          </Button>

        </Link>

      </div>

    </div>
  );
}

export default Interview;