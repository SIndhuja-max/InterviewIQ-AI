"use client";

import React, {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  eq,
} from "drizzle-orm";

import {
  Button,
} from "@/components/ui/button";

import {
  db,
} from "@/utils/db";

import {
  MockInterview,
} from "@/utils/schema";

import QuestionsSection
from "./_components/QuestionsSection";

import RecordAnswerSection
from "./_components/RecordAnswerSection";

const StartInterview = ({
  params,
}) => {

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

  useEffect(() => {

    if (
      params?.interviewId
    ) {

      GetInterviewDetails();
    }

  }, [params?.interviewId]);

  const GetInterviewDetails =
    async () => {

      try {

        const result =
          await db
            .select()
            .from(
              MockInterview
            )
            .where(
              eq(
                MockInterview.id,
                Number(
                  params.interviewId
                )
              )
            );

        console.log(
          "DB RESULT:",
          result
        );

        if (
          !result ||
          result.length === 0
        ) {

          console.log(
            "Interview not found"
          );

          return;
        }

        const interview =
          result[0];

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

      } catch (
        error
      ) {

        console.log(
          "FETCH ERROR:",
          error
        );
      }
    };

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