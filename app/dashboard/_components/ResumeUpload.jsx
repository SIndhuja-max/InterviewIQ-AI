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

import OpenRouterModel
from "@/utils/OpenRouterAiModel";

import { useRouter }
from "next/navigation";

import { db }
from "@/utils/db";

import { MockInterview }
from "@/utils/schema";

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
            "PDF RESPONSE:",
            data
          );

          if (
            !data.success
          ) {

            throw new Error(
              "PDF parsing failed"
            );
          }

          const resumeText =
            data.text || "";

          console.log(
            "RESUME TEXT:",
            resumeText
          );

          if (!resumeText) {

            alert(
              "Resume text extraction failed"
            );

            setLoading(false);

            return;
          }

          // STORE LOCALLY
          localStorage.setItem(
            "resumeText",
            resumeText
          );

          // ANALYSIS PROMPT
          const prompt = `

You are an AI resume analyzer.

Analyze this resume carefully.

Return ONLY valid JSON.

NO markdown.
NO explanation.
NO extra text.

Resume:
${resumeText}

Required JSON format:

{
  "jobRole":"string",
  "skills":["skill1","skill2"],
  "experience":"string",
  "strengths":["strength1","strength2"],
  "summary":"string"
}
`;

          let aiResponse =
            await OpenRouterModel(
              prompt
            );

          console.log(
            "RAW ANALYSIS:",
            aiResponse
          );

          if (!aiResponse) {

            throw new Error(
              "Empty AI response"
            );
          }

          aiResponse =
            aiResponse
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
            aiResponse.indexOf("{");

          const jsonEnd =
            aiResponse.lastIndexOf("}");

          if (
            jsonStart === -1 ||
            jsonEnd === -1
          ) {

            throw new Error(
              "Invalid AI analysis JSON"
            );
          }

          const cleanJson =
            aiResponse.slice(
              jsonStart,
              jsonEnd + 1
            );

          console.log(
            "CLEAN ANALYSIS JSON:",
            cleanJson
          );

          let parsedData;

          try {

            parsedData =
              JSON.parse(
                cleanJson
              );

          } catch (parseError) {

            console.log(
              "ANALYSIS PARSE ERROR:",
              parseError
            );

            parsedData = {

              jobRole:
                "Software Developer",

              skills: [],

              experience:
                "1 Year",

              strengths: [],

              summary:
                "Resume analyzed successfully.",
            };
          }

          console.log(
            "PARSED ANALYSIS:",
            parsedData
          );

          setResumeAnalysis(
            parsedData
          );

        } catch (error) {

          console.log(
            "RESUME ERROR:",
            error
          );

          alert(
            "Failed to analyze resume"
          );
        }

        setLoading(false);

      },
      []
    );

  // =========================
  // START RESUME INTERVIEW
  // =========================
  const StartResumeInterview =
    async () => {

      try {

        setLoadingInterview(
          true
        );

        const interviewPrompt = `

You are an AI interview generator.

Generate personalized interview questions.

Candidate Details:

Role:
${resumeAnalysis?.jobRole}

Skills:
${resumeAnalysis?.skills?.join(", ")}

Experience:
${resumeAnalysis?.experience}

Summary:
${resumeAnalysis?.summary}

IMPORTANT:
- Ask resume-based questions
- Ask project-based questions
- Ask technical questions from skills
- Ask HR questions from experience

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

        let aiResp = "";

        try {

          aiResp =
            await OpenRouterModel(
              interviewPrompt
            );

        } catch (error) {

          console.log(
            "OPENROUTER CALL ERROR:",
            error
          );
        }

        console.log(
          "RAW INTERVIEW RESPONSE:",
          aiResp
        );

        // =========================
        // FALLBACK QUESTIONS
        // =========================
        if (
          !aiResp ||
          aiResp.trim() === ""
        ) {

          aiResp =
            JSON.stringify({

              technical_interview_questions: [

                {
                  question:
                    `Explain your experience with ${resumeAnalysis?.skills?.[0] || "React"}.`,

                  answer:
                    "Explain implementation details and projects.",
                },

                {
                  question:
                    "Describe your most challenging technical project.",

                  answer:
                    "Discuss architecture and debugging.",
                },

                {
                  question:
                    "How do you optimize application performance?",

                  answer:
                    "Explain optimization techniques.",
                },

                {
                  question:
                    "Explain a difficult bug you solved recently.",

                  answer:
                    "Describe debugging process.",
                },

                {
                  question:
                    "Which technology stack do you prefer and why?",

                  answer:
                    "Discuss preferred tools.",
                },
              ],

              hr_interview_questions: [

                {
                  question:
                    "Tell me about yourself.",

                  answer:
                    "Introduce yourself professionally.",
                },

                {
                  question:
                    "Why should we hire you?",

                  answer:
                    "Explain your strengths.",
                },

                {
                  question:
                    "What are your future goals?",

                  answer:
                    "Discuss future plans.",
                },
              ],
            });
        }

        aiResp = aiResp
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

        // =========================
        // SAFE JSON PARSE
        // =========================
        let parsedJson;

        try {

          const jsonStart =
            aiResp.indexOf("{");

          const jsonEnd =
            aiResp.lastIndexOf("}");

          if (
            jsonStart === -1 ||
            jsonEnd === -1
          ) {

            throw new Error(
              "Invalid JSON structure"
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

          parsedJson =
            JSON.parse(
              cleanJson
            );

        } catch (parseError) {

          console.log(
            "JSON PARSE FAILED:",
            parseError
          );

          parsedJson = {

            technical_interview_questions: [

              {
                question:
                  `Explain your experience with ${resumeAnalysis?.skills?.[0] || "React"}.`,

                answer:
                  "Explain implementation details and projects.",
              },

              {
                question:
                  "Describe your most challenging technical project.",

                answer:
                  "Discuss architecture and debugging.",
              },

              {
                question:
                  "How do you optimize performance?",

                answer:
                  "Explain optimization techniques.",
              },

              {
                question:
                  "Explain a bug you solved recently.",

                answer:
                  "Describe debugging process.",
              },

              {
                question:
                  "Which technology stack do you prefer and why?",

                answer:
                  "Discuss preferred tools.",
              },
            ],

            hr_interview_questions: [

              {
                question:
                  "Tell me about yourself.",

                answer:
                  "Introduce yourself professionally.",
              },

              {
                question:
                  "Why should we hire you?",

                answer:
                  "Explain your strengths.",
              },

              {
                question:
                  "What are your future goals?",

                answer:
                  "Discuss future plans.",
              },
            ],
          };
        }

        console.log(
          "FINAL PARSED JSON:",
          parsedJson
        );

        // =========================
        // DATABASE INSERT
        // =========================
        await db
  .insert(MockInterview)
  .values({

    jsonMockResp:
      JSON.stringify(
        parsedJson
      ),

    jobPosition:
      resumeAnalysis?.jobRole ||
      "Software Developer",

    jobDesc:
      resumeAnalysis?.summary ||
      "Resume Based Interview",

    jobExperience:
      String(
        resumeAnalysis?.experience || "1"
      ),

    createdBy:
      user
        ?.primaryEmailAddress
        ?.emailAddress || "",
  });

console.log(
  "Interview inserted successfully"
);

// GET LATEST INSERTED INTERVIEW
const latestInterview =
  await db
    .select()
    .from(MockInterview);

const lastInterview =
  latestInterview[
    latestInterview.length - 1
  ];

console.log(
  "LAST INTERVIEW:",
  lastInterview
);

if (!lastInterview?.id) {

  alert(
    "Interview ID not found"
  );

  return;
}

// REDIRECT
router.push(
  `/dashboard/interview/${lastInterview.id}/start`
);

      } catch (error) {

  console.log(
    "FULL INTERVIEW ERROR:",
    error
  );

  console.log(
    "ERROR MESSAGE:",
    error?.message
  );

  console.log(
    "ERROR STACK:",
    error?.stack
  );

  alert(
    error?.message ||
    "Failed to generate interview"
  );
}

      setLoadingInterview(
        false
      );
    };

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

            AI-powered resume analysis and interview preparation

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

      {/* FILE INFO */}
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

            <div>

              <p className="
                text-white
                font-medium
              ">

                {fileName}

              </p>

              <p className="
                text-sm
                text-gray-400
              ">

                Resume uploaded successfully

              </p>

            </div>

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
              mb-5
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

            <div className="
              space-y-5
            ">

              <div>

                <h3 className="
                  text-gray-400
                  text-sm
                ">

                  Suggested Job Role

                </h3>

                <p className="
                  text-white
                  text-lg
                  font-semibold
                  mt-1
                ">

                  {
                    resumeAnalysis.jobRole
                  }

                </p>

              </div>

              <div>

                <h3 className="
                  text-gray-400
                  text-sm
                ">

                  Estimated Experience

                </h3>

                <p className="
                  text-white
                  text-lg
                  font-semibold
                  mt-1
                ">

                  {
                    resumeAnalysis.experience
                  }

                </p>

              </div>

              <div>

                <h3 className="
                  text-gray-400
                  text-sm
                  mb-2
                ">

                  Skills

                </h3>

                <div className="
                  flex
                  flex-wrap
                  gap-3
                ">

                  {
                    resumeAnalysis.skills?.map(
                      (
                        skill,
                        index
                      ) => (

                        <span
                          key={index}
                          className="
                            bg-blue-500/20
                            text-blue-300
                            px-4
                            py-2
                            rounded-full
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

              <div>

                <h3 className="
                  text-gray-400
                  text-sm
                ">

                  AI Summary

                </h3>

                <p className="
                  text-gray-300
                  leading-7
                  mt-2
                ">

                  {
                    resumeAnalysis.summary
                  }

                </p>

              </div>

              {/* START INTERVIEW BUTTON */}
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
                  transition-all
                "
              >

                {
                  loadingInterview
                    ? "Generating Interview..."
                    : "Start Resume Interview"
                }

              </button>

            </div>

          </div>
        )
      }

    </div>
  );
};

export default ResumeUpload;