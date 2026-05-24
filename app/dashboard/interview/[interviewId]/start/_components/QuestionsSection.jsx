"use client";

import React from "react";

import {
  Lightbulb,
  Volume2,
} from "lucide-react";

const QuestionsSection = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex,
}) => {

  // GET QUESTION TEXT SAFELY
  const GetQuestionText = (
    questionObj
  ) => {

    if (!questionObj) {
      return "Question not available";
    }

    // IF DIRECT STRING
    if (
      typeof questionObj === "string"
    ) {
      return questionObj;
    }

    // POSSIBLE AI JSON KEYS
    return (

      questionObj.question ||

      questionObj.Question ||

      questionObj.questions ||

      questionObj.q ||

      questionObj.text ||

      questionObj.interview_question ||

      questionObj.ask ||

      questionObj.query ||

      questionObj.title ||

      questionObj.name ||

      questionObj.problem ||

      questionObj.description ||

      "Question not available"
    );
  };

  // TEXT TO SPEECH
  const textToSpeech = (
    text
  ) => {

    if (
      "speechSynthesis" in window
    ) {

      const speech =
        new SpeechSynthesisUtterance(
          text
        );

      window
        .speechSynthesis
        .speak(speech);

    } else {

      alert(
        "Browser does not support speech"
      );
    }
  };

  // LOADING STATE
  if (
    !mockInterviewQuestion ||
    mockInterviewQuestion.length === 0
  ) {

    return (

      <div className="
        p-6
        border
        border-gray-800
        rounded-2xl
        bg-[#111827]
        text-white
      ">

        Loading interview questions...

      </div>
    );
  }

  const currentQuestion =
    GetQuestionText(
      mockInterviewQuestion[
        activeQuestionIndex
      ]
    );

  return (

    <div className="
      p-6
      border
      border-gray-800
      rounded-2xl
      bg-[#111827]
      text-white
      my-10
    ">

      {/* QUESTION BUTTONS */}
      <div className="
        grid
        grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
        gap-4
      ">

        {
          mockInterviewQuestion.map(
            (
              question,
              index
            ) => (

              <button
                key={index}
                onClick={() =>
                  setActiveQuestionIndex(
                    index
                  )
                }
                className={`
                  p-3
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all

                  ${
                    activeQuestionIndex === index
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }
                `}
              >

                Question #{index + 1}

              </button>
            )
          )
        }

      </div>

      {/* CURRENT QUESTION */}
      <div className="mt-8">

        <h2 className="
          text-lg
          leading-8
          font-medium
        ">

          {currentQuestion}

        </h2>

        {/* SPEAKER */}
        <button
          onClick={() =>
            textToSpeech(
              currentQuestion
            )
          }
          className="mt-4"
        >

          <Volume2
            className="
              cursor-pointer
              text-blue-400
              hover:text-blue-300
            "
          />

        </button>

      </div>

      {/* NOTE */}
      <div className="
        border
        border-yellow-400
        rounded-2xl
        p-5
        bg-yellow-500/10
        mt-10
      ">

        <h2 className="
          flex
          gap-2
          items-center
          text-yellow-300
          font-semibold
        ">

          <Lightbulb />

          Important Note

        </h2>

        <p className="
          text-sm
          text-yellow-200
          mt-3
          leading-7
        ">

          Read each question carefully before answering.
          Speak clearly and confidently.
          Your response quality, confidence,
          and communication will be used
          for feedback analysis after the interview.

        </p>

      </div>

    </div>
  );
};

export default QuestionsSection;