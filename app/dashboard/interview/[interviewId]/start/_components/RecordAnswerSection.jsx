"use client";

import React, {
  useEffect,
  useState,
  useRef,
} from "react";

import { Button }
from "@/components/ui/button";

import Image
from "next/image";

import Webcam
from "react-webcam";

import useSpeechToText
from "react-hook-speech-to-text";

import {
  Mic,
  StopCircle,
} from "lucide-react";

import { toast }
from "sonner";

import {
  useUser,
} from "@clerk/nextjs";

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

  const recognitionLock =
    useRef(false);

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
  });

  // =========================
  // LIVE TRANSCRIPT
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
  // START / STOP RECORDING
  // =========================

  const StartStopRecording =
    async () => {

      try {

        // =====================
        // STOP RECORDING
        // =====================

        if (isRecording) {

  stopSpeechToText();

  recognitionLock.current =
    false;

  console.log(
    "FINAL TRANSCRIPT:",
    userAnswer
  );

  if (
    !userAnswer ||
    userAnswer.trim().length < 10
  ) {

    toast(
      "Please record a longer answer"
    );

    return;
  }

  await GenerateFeedback(
    userAnswer
  );
}

        
        // =====================
        // START RECORDING
        // =====================

        else {

          // PREVENT DOUBLE START

          if (
            recognitionLock.current
          ) {

            return;
          }

          recognitionLock.current =
            true;

          setUserAnswer("");

          setResults([]);

          await startSpeechToText();
        }

      } catch (error) {

        recognitionLock.current =
          false;

        console.log(
          "MIC ERROR:",
          error
        );

        toast(
          "Microphone error"
        );
      }
    };

  // =========================
  // GENERATE FEEDBACK
  // =========================
  const GenerateFeedback =
  async (finalAnswer) => {

    console.log(
    "GenerateFeedback CALLED",
    finalAnswer
  );

    try {

      setLoading(true);

      const currentQuestion =
        mockInterviewQuestion?.[
          activeQuestionIndex
        ];

      if (!currentQuestion) {

        toast(
          "Question not found"
        );

        return;
      }

      // =====================
      // SAFE QUESTION EXTRACTION
      // =====================

      const questionText =

        currentQuestion?.question ||

        currentQuestion?.Question ||

        currentQuestion?.q ||

        currentQuestion?.text ||

        currentQuestion?.query ||

        currentQuestion?.ask ||

        currentQuestion?.title ||

        currentQuestion?.problem ||

        currentQuestion?.description ||

        (
          typeof currentQuestion ===
          "string"
            ? currentQuestion
            : ""
        );

      const answerText =

        currentQuestion?.answer ||

        currentQuestion?.Answer ||

        "";

      console.log(
        "QUESTION TEXT:",
        questionText
      );

      if (!questionText) {

        toast(
          "Invalid question"
        );

        return;
      }

      // =====================
      // AI PROMPT
      // =====================

      const feedbackPrompt = `

You are an AI interview evaluator.

Interview Question:
${questionText}

Candidate Answer:
${finalAnswer}

Evaluate the answer professionally.

Return ONLY valid JSON.

Format:
{
  "rating":"8",
  "feedback":"Short professional feedback",
  "improvement":"Specific improvement suggestion"
}
`;

      console.log(
        "GENERATING AI FEEDBACK..."
      );

      // =====================
      // OPENROUTER CALL
      // =====================

      const response =
  await fetch(
    "/api/generate-feedback",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        prompt:
          feedbackPrompt,
      }),
    }
  );

const result =
  await response.json();

let aiFeedback =
  result?.data
    ?.choices?.[0]
    ?.message?.content;

      console.log(
        "OPENROUTER RESPONSE RECEIVED"
      );

      console.log(
        "RAW AI RESPONSE:",
        aiFeedback
      );

      // =====================
      // EMPTY RESPONSE
      // =====================

      if (
        !aiFeedback ||
        aiFeedback.trim() === ""
      ) {

        console.log(
          "EMPTY AI RESPONSE"
        );

        toast(
          "AI response failed"
        );

        return;
      }

      // =====================
      // CLEAN RESPONSE
      // =====================

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
          .replace(
            /<think>[\s\S]*?<\/think>/g,
            ""
          )
          .trim();

      console.log(
        "CLEANED AI RESPONSE:",
        aiFeedback
      );

      // =====================
      // FIND JSON
      // =====================

      const jsonStart =
        aiFeedback.indexOf("{");

      const jsonEnd =
        aiFeedback.lastIndexOf("}");

      if (
        jsonStart === -1 ||
        jsonEnd === -1
      ) {

        console.log(
          "INVALID AI JSON:",
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

      // =====================
      // SAFE JSON PARSE
      // =====================

      let parsedFeedback;

      try {

        parsedFeedback =
          JSON.parse(
            cleanJson
          );

        console.log(
          "PARSED FEEDBACK:",
          parsedFeedback
        );

      } catch (parseError) {

        console.log(
          "JSON PARSE ERROR:",
          parseError
        );

        console.log(
          "BROKEN JSON:",
          cleanJson
        );

        toast(
          "AI returned invalid JSON"
        );

        return;
      }

      // =====================
      // INSERT DATA
      // =====================

      const insertData = {

        mockIdRef:
          String(
            interviewData?.id
          ),

        question:
          questionText,

        correctAns:
          answerText,

        userAns:
          finalAnswer,

        feedback:
          parsedFeedback?.feedback || "",

        rating:
          String(
            parsedFeedback?.rating || "0"
          ),

        userEmail:
  user
    ?.primaryEmailAddress
    ?.emailAddress
    ?.trim()
    ?.toLowerCase() || "",
      };

      console.log(
        "INSERT DATA:",
        insertData
      );

      // =====================
      // SAVE TO DATABASE
      // =====================

      const saveResponse  =
        await fetch(
          "/api/save-feedback",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              insertData
            ),
          }
        );

     const data =
  await saveResponse.json();

      console.log(
        "SAVE API RESPONSE:",
        data
      );

      // =====================
      // SAVE FAILED
      // =====================

      if (!data.success) {

        console.log(
          "DATABASE SAVE FAILED:",
          data
        );

        toast(
          "Database save failed"
        );

        return;
      }

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
  // UNSUPPORTED
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