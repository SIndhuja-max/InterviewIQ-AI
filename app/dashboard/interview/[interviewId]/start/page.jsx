"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Link
from "next/link";

import { Button }
from "@/components/ui/button";

import QuestionsSection
from "./_components/QuestionsSection";

import RecordAnswerSection
from "./_components/RecordAnswerSection";

import {
  useUser,
} from "@clerk/nextjs";

const StartInterview = ({
  params,
}) => {

  const { user } =
    useUser();

  const [
    interViewData,
    setInterviewData,
  ] = useState(null);

  const [
    mockInterviewQuestion,
    setMockInterviewQuestion,
  ] = useState([]);

  const [
    activeQuestionIndex,
    setActiveQuestionIndex,
  ] = useState(0);

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
          "INTERVIEW API:",
          data
        );

        if (!data.success) {

          console.log(
            "Unauthorized interview access"
          );

          return;
        }

        const interview =
          data.interview;

        setInterviewData(
          interview
        );

        console.log(
          "RAW JSON:",
          interview?.jsonMockResp
        );

        if (
          !interview?.jsonMockResp
        ) {

          console.log(
            "jsonMockResp missing"
          );

          return;
        }

        let parsedData;

        try {

          parsedData =
            JSON.parse(
              interview.jsonMockResp
            );

        } catch (
          parseError
        ) {

          console.log(
            "JSON PARSE ERROR:",
            parseError
          );

          return;
        }

        console.log(
          "PARSED DATA:",
          parsedData
        );

        let questions = [];

        // CASE 1

        if (
          Array.isArray(
            parsedData
          )
        ) {

          questions =
            parsedData;
        }

        // CASE 2

        else if (

          parsedData?.technical_interview_questions ||

          parsedData?.hr_interview_questions

        ) {

          questions = [

            ...(
              parsedData
                .technical_interview_questions || []
            ),

            ...(
              parsedData
                .hr_interview_questions || []
            ),
          ];
        }

        // CASE 3

        else if (
          parsedData?.questions
        ) {

          questions =
            parsedData.questions;
        }

        // CASE 4

        else {

          questions =
            Object.values(
              parsedData
            );
        }

        console.log(
          "FINAL QUESTIONS:",
          questions
        );

        setMockInterviewQuestion(
          questions
        );

      } catch (error) {

        console.log(
          "FETCH ERROR:",
          error
        );
      }
    };

  // =========================
  // UI
  // =========================

  return (

    <div className="p-6">

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-10
      ">

        {/* QUESTIONS */}

        <QuestionsSection
          mockInterviewQuestion={
            mockInterviewQuestion
          }
          activeQuestionIndex={
            activeQuestionIndex
          }
          setActiveQuestionIndex={
            setActiveQuestionIndex
          }
        />

        {/* RECORD */}

        <RecordAnswerSection
          mockInterviewQuestion={
            mockInterviewQuestion
          }
          activeQuestionIndex={
            activeQuestionIndex
          }
          interviewData={
            interViewData
          }
        />

      </div>

      {/* NAVIGATION */}

      <div className="
        flex
        justify-end
        gap-6
        mt-8
      ">

        {
          activeQuestionIndex > 0 && (

            <Button
              onClick={() =>
                setActiveQuestionIndex(
                  activeQuestionIndex - 1
                )
              }
            >

              Previous Question

            </Button>
          )
        }

        {
          activeQuestionIndex <
          mockInterviewQuestion.length - 1 && (

            <Button
              onClick={() =>
                setActiveQuestionIndex(
                  activeQuestionIndex + 1
                )
              }
            >

              Next Question

            </Button>
          )
        }

        {
          activeQuestionIndex ===
            mockInterviewQuestion.length - 1 &&

          mockInterviewQuestion.length > 0 && (

            <Link
              href={`/dashboard/interview/${interViewData?.id}/feedback`}
            >

              <Button>

                End Interview

              </Button>

            </Link>
          )
        }

      </div>

    </div>
  );
};

export default StartInterview;