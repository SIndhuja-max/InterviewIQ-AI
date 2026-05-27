"use client";

import React, {
  useCallback,
  useState,
} from "react";

import {
  useDropzone,
} from "react-dropzone";

import {
  UploadCloud,
  FileText,
  Loader2,
  Brain,
} from "lucide-react";


import { useRouter }
from "next/navigation";

import { useUser }
from "@clerk/nextjs";

const ResumeUpload = () => {

  const router =
    useRouter();

  const { user } =
    useUser();

  const [
    fileName,
    setFileName,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    loadingInterview,
    setLoadingInterview,
  ] = useState(false);

  const [
    resumeAnalysis,
    setResumeAnalysis,
  ] = useState(null);

  // =========================
  // RESUME UPLOAD
  // =========================

  const onDrop =
    useCallback(
      async (
        acceptedFiles
      ) => {

        const file =
          acceptedFiles[0];

        if (!file) return;

        setFileName(
          file.name
        );

        try {

          setLoading(true);

          const formData =
            new FormData();

          formData.append(
            "resume",
            file
          );

          const response =
            await fetch(
              "/api/analyze-resume",
              {
                method: "POST",
                body: formData,
              }
            );

          const data =
            await response.json();

          console.log(
            "RESUME API RESPONSE:",
            data
          );

          if (
            !data.success
          ) {

            throw new Error(
              data.error ||
              "Resume analysis failed"
            );
          }

          if (
            !data.analysis
          ) {

            throw new Error(
              "No analysis returned"
            );
          }

          setResumeAnalysis(
            data.analysis
          );

        } catch (error) {

          console.log(
            "RESUME ERROR:",
            error
          );

          alert(
            "Resume analysis failed"
          );

        } finally {

          setLoading(false);
        }
      },
      []
    );

  // =========================
  // START INTERVIEW
  // =========================

  const StartResumeInterview =
    async () => {

      try {

        setLoadingInterview(
          true
        );

        const interviewPrompt = `

You are an AI interview generator.

Generate personalized interview questions based on the candidate's resume analysis.

Candidate Analysis:

Suggested Role:
${resumeAnalysis?.jobRole}

Tech Stack:
${resumeAnalysis?.skills?.join(", ")}

Experience:
${resumeAnalysis?.experience}

Resume Score:
${resumeAnalysis?.score}

Strengths:
${resumeAnalysis?.strengths?.join(", ")}

Weaknesses:
${resumeAnalysis?.weaknesses?.join(", ")}

Suggestions:
${resumeAnalysis?.suggestions?.join(", ")}

Generate:
5 Technical Questions
3 HR Questions

Return ONLY valid JSON.

{
  "technical_interview_questions":[
    {
      "question":"Question",
      "answer":"Answer"
    }
  ],

  "hr_interview_questions":[
    {
      "question":"Question",
      "answer":"Answer"
    }
  ]
}
`;

        const aiResponse =
  await fetch(
    "/api/generate-interview",
    {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        prompt:
          interviewPrompt,
      }),
    }
  );

const aiData =
  await aiResponse.json();

console.log(
  "AI API RESPONSE:",
  aiData
);

if (

  !aiResponse.ok ||

  !aiData.success
) {

  throw new Error(

    aiData?.message ||

    "AI generation failed"
  );
}

let aiResp =
  aiData.content;

console.log(
  "RAW INTERVIEW RESPONSE:",
  aiResp
);

aiResp =
  aiResp
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
     

        const jsonStart =
          aiResp.indexOf("{");

        const jsonEnd =
          aiResp.lastIndexOf("}");

        if (
          jsonStart === -1 ||
          jsonEnd === -1
        ) {

          throw new Error(
            "Invalid AI response"
          );
        }

        const cleanJson =
          aiResp.slice(
            jsonStart,
            jsonEnd + 1
          );

        console.log(
          "CLEAN JSON:",
          cleanJson
        );

        let parsedJson;

        try {

          parsedJson =
            JSON.parse(
              cleanJson
            );

        } catch (parseError) {

          console.log(
            "JSON PARSE ERROR:",
            parseError
          );

          console.log(
            "FAILED JSON:",
            cleanJson
          );

          alert(
            "AI returned invalid interview JSON"
          );

          return;
        }

        console.log(
          "FINAL PARSED JSON:",
          parsedJson
        );

        // =========================
        // SAVE INTERVIEW
        // =========================

        const saveResponse =
          await fetch(
            "/api/create-interview",
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                jsonMockResp:
                  JSON.stringify(
                    parsedJson
                  ),

                jobPosition:
                  resumeAnalysis?.jobRole ||

                  "Software Developer",

                jobDesc:
                  resumeAnalysis
                    ?.skills
                    ?.join(", ") ||

                  "React, Node.js",

                jobExperience:
                  String(
                    resumeAnalysis?.experience ||
                    "Fresher"
                  ),

                createdBy:
                  user
                    ?.primaryEmailAddress
                    ?.emailAddress
                    ?.trim()
                    ?.toLowerCase() || "",
              }),
            }
          );

        const savedData =
          await saveResponse.json();

        console.log(
          "CREATE INTERVIEW RESPONSE:",
          savedData
        );

        if (
          !savedData.success
        ) {

          throw new Error(
            "Interview creation failed"
          );
        }

        router.push(

          `/dashboard/interview/${savedData.interviewId}`

        );

      } catch (error) {

        console.log(
          "FULL INTERVIEW ERROR:",
          error
        );

        alert(
          "Failed to generate interview"
        );

      } finally {

        setLoadingInterview(
          false
        );
      }
    };

  // =========================
  // DROPZONE
  // =========================

  const {

    getRootProps,

    getInputProps,

    isDragActive,

  } = useDropzone({

    onDrop,

    accept: {
      "application/pdf":
        [".pdf"],
    },

    multiple: false,
  });

  return (

    <div className="
      bg-[#111827]
      border
      border-gray-800
      rounded-3xl
      p-8
      mt-10
    ">

      {/* HEADER */}

      <div className="
        flex
        items-center
        gap-3
        mb-6
      ">

        <div className="
          bg-blue-500/20
          p-3
          rounded-2xl
        ">

          <UploadCloud
            className="
              text-blue-400
            "
          />

        </div>

        <div>

          <h2 className="
            text-2xl
            font-bold
            text-white
          ">

            Upload Resume

          </h2>

          <p className="
            text-gray-400
          ">

            AI-powered resume interview generation

          </p>

        </div>

      </div>

      {/* DROPZONE */}

      <div
        {...getRootProps()}
        className={`
          border-2
          border-dashed
          rounded-3xl
          p-12
          text-center
          cursor-pointer
          transition-all

          ${
            isDragActive
              ? "border-blue-500 bg-blue-500/10"
              : "border-gray-700 hover:border-blue-500"
          }
        `}
      >

        <input {...getInputProps()} />

        {
          loading ? (

            <Loader2
              className="
                mx-auto
                animate-spin
                text-blue-400
                mb-4
              "
              size={50}
            />

          ) : (

            <UploadCloud
              className="
                mx-auto
                text-gray-400
                mb-4
              "
              size={50}
            />
          )
        }

        <p className="
          text-lg
          text-gray-300
        ">

          {
            loading
              ? "Analyzing Resume..."
              : "Drag & drop your resume PDF here"
          }

        </p>

      </div>

      {/* FILE */}

      {
        fileName && (

          <div className="
            mt-6
            bg-black/30
            border
            border-gray-800
            rounded-2xl
            p-4
            flex
            items-center
            gap-3
          ">

            <FileText
              className="
                text-green-400
              "
            />

            <p className="
              text-white
              font-medium
            ">

              {fileName}

            </p>

          </div>
        )
      }

      {/* ANALYSIS */}

      {
        resumeAnalysis && (

          <div className="
            mt-8
            bg-black/30
            border
            border-gray-800
            rounded-3xl
            p-6
          ">

            <div className="
              flex
              items-center
              gap-3
              mb-6
            ">

              <Brain
                className="
                  text-blue-400
                "
              />

              <h2 className="
                text-2xl
                font-bold
                text-white
              ">

                AI Resume Analysis

              </h2>

            </div>

            {/* SCORE */}

            <div className="mb-6">

              <h3 className="
                text-blue-400
                font-semibold
                mb-2
              ">

                Resume Score

              </h3>

              <p className="
                text-4xl
                font-bold
                text-white
              ">

                {resumeAnalysis?.score}/100

              </p>

            </div>

            {/* ROLE */}

            <div className="mb-6">

              <h3 className="
                text-cyan-400
                font-semibold
                mb-2
              ">

                Suggested Role

              </h3>

              <p className="
                text-gray-300
              ">

                {
                  resumeAnalysis?.jobRole ||
                  "Software Developer"
                }

              </p>

            </div>

            {/* TECH STACK */}

            <div className="mb-6">

              <h3 className="
                text-cyan-400
                font-semibold
                mb-2
              ">

                Tech Stack

              </h3>

              <div className="
                flex
                flex-wrap
                gap-2
              ">

                {
                  resumeAnalysis
                    ?.skills
                    ?.map(
                      (
                        skill,
                        index
                      ) => (

                        <span
                          key={index}
                          className="
                            bg-cyan-500/20
                            text-cyan-300
                            px-3
                            py-1
                            rounded-xl
                            text-sm
                          "
                        >

                          {skill}

                        </span>
                      )
                    )
                }

              </div>

            </div>

            {/* EXPERIENCE */}

            <div className="mb-6">

              <h3 className="
                text-cyan-400
                font-semibold
                mb-2
              ">

                Experience

              </h3>

              <p className="
                text-gray-300
              ">

                {
                  resumeAnalysis?.experience ||
                  "Fresher"
                }

              </p>

            </div>

            {/* STRENGTHS */}

            <div className="mb-6">

              <h3 className="
                text-green-400
                font-semibold
                mb-3
              ">

                Strengths

              </h3>

              <ul className="
                list-disc
                ml-5
                text-gray-300
                space-y-2
              ">

                {
                  resumeAnalysis
                    ?.strengths
                    ?.map(
                      (
                        item,
                        index
                      ) => (

                        <li key={index}>
                          {item}
                        </li>
                      )
                    )
                }

              </ul>

            </div>

            {/* WEAKNESSES */}

            <div className="mb-6">

              <h3 className="
                text-red-400
                font-semibold
                mb-3
              ">

                Weaknesses

              </h3>

              <ul className="
                list-disc
                ml-5
                text-gray-300
                space-y-2
              ">

                {
                  resumeAnalysis
                    ?.weaknesses
                    ?.map(
                      (
                        item,
                        index
                      ) => (

                        <li key={index}>
                          {item}
                        </li>
                      )
                    )
                }

              </ul>

            </div>

            {/* SUGGESTIONS */}

            <div className="mb-6">

              <h3 className="
                text-yellow-400
                font-semibold
                mb-3
              ">

                Suggestions

              </h3>

              <ul className="
                list-disc
                ml-5
                text-gray-300
                space-y-2
              ">

                {
                  resumeAnalysis
                    ?.suggestions
                    ?.map(
                      (
                        item,
                        index
                      ) => (

                        <li key={index}>
                          {item}
                        </li>
                      )
                    )
                }

              </ul>

            </div>

            {/* BUTTON */}

            <button
              onClick={
                StartResumeInterview
              }
              disabled={
                loadingInterview
              }
              className="
                mt-6
                bg-blue-600
                hover:bg-blue-700
                px-6
                py-3
                rounded-2xl
                text-white
                font-semibold
              "
            >

              {
                loadingInterview
                  ? "Generating Interview..."
                  : "Start Resume Interview"
              }

            </button>

          </div>
        )
      }

    </div>
  );
};

export default ResumeUpload;