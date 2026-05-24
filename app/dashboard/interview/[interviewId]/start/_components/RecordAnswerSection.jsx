"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  Button,
} from "@/components/ui/button";

import Image from "next/image";

import Webcam from "react-webcam";

import useSpeechToText
from "react-hook-speech-to-text";

import {
  Mic,
  StopCircle,
} from "lucide-react";

import { toast }
from "sonner";

import OpenRouterModel
from "@/utils/OpenRouterAiModel";

import { useUser }
from "@clerk/nextjs";

import { db }
from "@/utils/db";

import { UserAnswer }
from "@/utils/schema";

const RecordAnswerSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {

  const { user } =
    useUser();

  const [
    userAnswer,
    setUserAnswer,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const {

    error,

    isRecording,

    results,

    startSpeechToText,

    stopSpeechToText,

    setResults,

  } = useSpeechToText({

    continuous: true,

    useLegacyResults: false,

    speechRecognitionProperties: {

      interimResults: true,
    },
  });

  // =========================
  // SPEECH TO TEXT
  // =========================

  useEffect(() => {

    if (results.length > 0) {

      const transcript =
        results
          .map(
            (result) =>
              result.transcript
          )
          .join(" ");

      setUserAnswer(
        transcript
      );
    }

  }, [results]);

  // =========================
  // AUTO RESTART RECORDING
  // =========================

  useEffect(() => {

    if (
      !isRecording &&
      loading === false &&
      userAnswer.length > 0
    ) {

      startSpeechToText();
    }

  }, [isRecording]);

  // =========================
  // START / STOP RECORDING
  // =========================

  const StartStopRecording =
    async () => {

      if (isRecording) {

        stopSpeechToText();

        if (
          userAnswer
            .trim()
            .length < 10
        ) {

          toast(
            "Please record a longer answer"
          );

          return;
        }

        await GenerateFeedback();

      } else {

        setUserAnswer("");

        setResults([]);

        startSpeechToText();
      }
    };

  // =========================
  // GENERATE FEEDBACK
  // =========================

  const GenerateFeedback =
    async () => {

      try {

        setLoading(true);

        // CURRENT QUESTION
        const currentQuestion =
          mockInterviewQuestion?.[
            activeQuestionIndex
          ];

        console.log(
          "CURRENT QUESTION:",
          currentQuestion
        );

        if (!currentQuestion) {

          toast(
            "Question not found"
          );

          return;
        }

        // SUPPORT MULTIPLE FORMATS
        const questionText =

          currentQuestion?.Question ||

          currentQuestion?.question ||

          "";

        const answerText =

          currentQuestion?.Answer ||

          currentQuestion?.answer ||

          "";

        console.log(
          "QUESTION TEXT:",
          questionText
        );

        console.log(
          "ANSWER TEXT:",
          answerText
        );

        if (!questionText) {

          toast(
            "Invalid interview question"
          );

          return;
        }

        // =========================
        // AI PROMPT
        // =========================

        const feedbackPrompt = `

You are an AI interview evaluator.

Interview Question:
${questionText}

Candidate Answer:
${userAnswer}

Evaluate the answer professionally.

Return ONLY valid JSON.

Format:
{
  "rating":"8",
  "feedback":"Short professional feedback",
  "improvement":"Specific improvement suggestion"
}

`;

        // =========================
        // OPENROUTER RESPONSE
        // =========================

        let aiFeedback =
          await OpenRouterModel(
            feedbackPrompt
          );

        console.log(
          "RAW AI RESPONSE:",
          aiFeedback
        );

        if (!aiFeedback) {

          toast(
            "AI feedback generation failed"
          );

          return;
        }

        // CLEAN RESPONSE

        aiFeedback =
          aiFeedback
            .replace(
              /```json/g,
              ""
            )
            .replace(
              /```/g,
              ""
            )
            .trim();

        const jsonStart =
          aiFeedback.indexOf("{");

        const jsonEnd =
          aiFeedback.lastIndexOf("}");

        if (
          jsonStart === -1 ||
          jsonEnd === -1
        ) {

          console.log(
            "INVALID JSON RESPONSE:",
            aiFeedback
          );

          toast(
            "Invalid AI response"
          );

          return;
        }

        const cleanJson =
          aiFeedback.slice(
            jsonStart,
            jsonEnd + 1
          );

        console.log(
          "CLEAN JSON:",
          cleanJson
        );

        const parsedFeedback =
          JSON.parse(
            cleanJson
          );

        console.log(
          "PARSED FEEDBACK:",
          parsedFeedback
        );

        // =========================
        // SAVE TO DATABASE
        // =========================

        await db
          .insert(UserAnswer)
          .values({

            mockIdRef:
              String(
                interviewData?.id
              ),

            question:
              questionText,

            correctAns:
              answerText,

            userAns:
              userAnswer,

            feedback:

              parsedFeedback
                ?.feedback ||

              parsedFeedback
                ?.improvement ||

              "",

            rating:
              parsedFeedback
                ?.rating || "0",

            userEmail:
              user
                ?.primaryEmailAddress
                ?.emailAddress || "",
          });

        console.log(
          "DATABASE INSERT SUCCESS"
        );

        toast(
          "Answer recorded successfully"
        );

        // RESET

        setUserAnswer("");

        setResults([]);

      } catch (error) {

        console.log(
          "FEEDBACK ERROR:",
          error
        );

        toast(
          "Failed to generate feedback"
        );
      }

      setLoading(false);
    };

  // =========================
  // BROWSER SUPPORT
  // =========================

  if (error) {

    return (

      <p className="
        text-red-400
        text-center
      ">

        Web Speech API is not available in this browser

      </p>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <div className="
      flex
      flex-col
      items-center
    ">

      {/* WEBCAM */}

      <div className="
        flex
        flex-col
        my-10
        justify-center
        items-center
        bg-[#111827]
        rounded-2xl
        p-6
        w-full
      ">

        <Image
          src="/webcam.png"
          width={200}
          height={200}
          className="
            absolute
            opacity-40
          "
          alt="webcam"
          priority
        />

        <Webcam
          mirrored={true}
          style={{

            height: 300,

            width: "100%",

            zIndex: 10,

            borderRadius: "20px",
          }}
        />

      </div>

      {/* RECORD BUTTON */}

      <Button
        disabled={loading}
        variant="outline"
        className="
          my-6
          w-full
        "
        onClick={
          StartStopRecording
        }
      >

        {
          isRecording ? (

            <h2 className="
              text-red-500
              flex
              gap-2
              items-center
              animate-pulse
            ">

              <StopCircle />

              Stop Recording

            </h2>

          ) : (

            <h2 className="
              flex
              gap-2
              items-center
            ">

              <Mic />

              Record Answer

            </h2>
          )
        }

      </Button>

      {/* ANSWER PREVIEW */}

      {
        userAnswer && (

          <div className="
            w-full
            mt-6
            p-4
            rounded-2xl
            bg-[#111827]
            border
            border-gray-700
          ">

            <h2 className="
              text-sm
              text-blue-400
              mb-2
            ">

              Your Answer

            </h2>

            <p className="
              text-white
              leading-7
            ">

              {userAnswer}

            </p>

          </div>
        )
      }

    </div>
  );
};

export default RecordAnswerSection;