"use client";

import React, {
  useState,
} from "react";

import {
  useUser,
} from "@clerk/nextjs";

import OpenRouterModel
from "@/utils/OpenRouterAiModel";

import { db }
from "@/utils/db";

import {
  MockInterview,
  UserSettings,
} from "@/utils/schema";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Brain,
  Briefcase,
  Sparkles,
} from "lucide-react";

import { eq }
from "drizzle-orm";

const CreateInterviewModal = () => {

  const { user } =
    useUser();

  const [open, setOpen] =
    useState(false);

  const [
    jobPosition,
    setJobPosition,
  ] = useState("");

  const [
    jobDesc,
    setJobDesc,
  ] = useState("");

  const [
    jobExperience,
    setJobExperience,
  ] = useState("");

  const [
    companyName,
    setCompanyName,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const onSubmit = async (e) => {

    e.preventDefault();

    if (!user) {

      alert(
        "Please login first"
      );

      return;
    }

    setLoading(true);

    try {

      // FETCH USER SETTINGS
      const settings =
        await db
          .select()
          .from(UserSettings)
          .where(
            eq(
              UserSettings.userEmail,
              user?.primaryEmailAddress
                ?.emailAddress
            )
          );

      const difficulty =
        settings[0]?.difficulty ||
        "Intermediate";

      const resumeText =
      localStorage.getItem(
      "resumeText"
      ) || "";

      // AI PROMPT
      const InputPrompt = `

Job Position:
${jobPosition}

Company Name:
${companyName}

Years of Experience:
${jobExperience}

Tech Stack:
${jobDesc}

Interview Difficulty:
${difficulty}

Resume Content:
${resumeText}

Generate:

15 Technical Interview Questions
10 HR Interview Questions

IMPORTANT:
If difficulty is Beginner:
- ask basic questions
- focus on fundamentals
- easy concepts

If difficulty is Intermediate:
- ask practical industry questions
- include real-world scenarios

If difficulty is Advanced:
- ask difficult optimization,
architecture,
system design,
performance,
and deep technical questions

Generate interview questions based on:
- resume projects
- resume skills
- technologies used
- work experience
- achievements

Prioritize personalized resume-based questions.

Return response ONLY in valid JSON format like this:

{
  "technical_interview_questions": [
    {
      "question": "Question here",
      "answer": "Answer here"
    }
  ],
  "hr_interview_questions": [
    {
      "question": "Question here",
      "answer": "Answer here"
    }
  ]
}
`;

      // GENERATE AI RESPONSE
      let text =
        await OpenRouterModel(
          InputPrompt
        );

      console.log(
        "RAW AI RESPONSE:",
        text
      );

      // CLEAN MARKDOWN
      text = text
        .replace(
          /```json/g,
          ""
        )
        .replace(
          /```/g,
          ""
        )
        .trim();

      // EXTRACT VALID JSON ONLY
      const jsonStart =
        text.indexOf("{");

      const jsonEnd =
        text.lastIndexOf("}");

      if (
        jsonStart === -1 ||
        jsonEnd === -1
      ) {

        throw new Error(
          "Invalid AI response format"
        );
      }

      const cleanJson =
        text.slice(
          jsonStart,
          jsonEnd + 1
        );

      console.log(
        "CLEAN JSON:",
        cleanJson
      );

      // VALIDATE JSON
      const parsedJson =
        JSON.parse(cleanJson);

      console.log(
        "PARSED JSON:",
        parsedJson
      );

      // SAVE TO DATABASE
      const dbResult =
        await db
          .insert(MockInterview)
          .values({

            jsonMockResp:
              JSON.stringify(
                parsedJson
              ),

            jobPosition:
              jobPosition,

            jobDesc:
              `${companyName} | ${jobDesc}`,

            jobExperience:
              jobExperience,

            createdBy:
              user
                ?.primaryEmailAddress
                ?.emailAddress ||
              "unknown",
          });

      console.log(
        "DB SAVED:",
        dbResult
      );

      alert(
        "Interview Created Successfully 🚀"
      );
      localStorage.removeItem(
        "resumeText"
      );

      // RESET FORM
      setOpen(false);

      setJobPosition("");

      setJobDesc("");

      setJobExperience("");

      setCompanyName("");

    } catch (error) {

      console.error(
        "FULL ERROR:",
        error
      );

      alert(
        error?.message ||
        "Something went wrong while generating interview"
      );
    }

    setLoading(false);
  };

  return (

    <Dialog
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>

        <button
          className="
            bg-blue-600
            hover:bg-blue-700
            transition-all
            px-6
            py-3
            rounded-2xl
            font-medium
          "
        >

          + New Interview

        </button>

      </DialogTrigger>

      <DialogContent
        className="
          bg-[#111827]
          border
          border-gray-800
          text-white
          rounded-3xl
          max-w-2xl
        "
      >

        <DialogHeader>

          <DialogTitle
            className="
              text-3xl
              font-bold
              flex
              items-center
              gap-3
            "
          >

            <Brain
              className="
                text-blue-400
              "
            />

            Create AI Interview

          </DialogTitle>

        </DialogHeader>

        <form onSubmit={onSubmit}>

          <div
            className="
              space-y-6
              mt-6
            "
          >

            {/* JOB ROLE */}
            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                "
              >

                Job Role

              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  mt-2
                  bg-black/30
                  border
                  border-gray-700
                  rounded-2xl
                  px-4
                  py-3
                "
              >

                <Briefcase
                  className="
                    text-blue-400
                  "
                />

                <input
                  type="text"
                  placeholder="Frontend Developer"
                  value={jobPosition}
                  onChange={(e) =>
                    setJobPosition(
                      e.target.value
                    )
                  }
                  className="
                    bg-transparent
                    outline-none
                    w-full
                  "
                  required
                />

              </div>

            </div>

            {/* COMPANY */}
            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                "
              >

                Company Name

              </label>

              <input
                type="text"
                placeholder="Google"
                value={companyName}
                onChange={(e) =>
                  setCompanyName(
                    e.target.value
                  )
                }
                className="
                  w-full
                  mt-2
                  bg-black/30
                  border
                  border-gray-700
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:border-blue-500
                "
                required
              />

            </div>

            {/* EXPERIENCE */}
            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                "
              >

                Years of Experience

              </label>

              <input
                type="number"
                placeholder="2"
                value={jobExperience}
                onChange={(e) =>
                  setJobExperience(
                    e.target.value
                  )
                }
                className="
                  w-full
                  mt-2
                  bg-black/30
                  border
                  border-gray-700
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:border-blue-500
                "
                required
              />

            </div>

            {/* TECH STACK */}
            <div>

              <label
                className="
                  text-sm
                  text-gray-400
                "
              >

                Tech Stack

              </label>

              <textarea
                rows={4}
                placeholder="React, Next.js, Node.js, MongoDB..."
                value={jobDesc}
                onChange={(e) =>
                  setJobDesc(
                    e.target.value
                  )
                }
                className="
                  w-full
                  mt-2
                  bg-black/30
                  border
                  border-gray-700
                  rounded-2xl
                  px-4
                  py-3
                  outline-none
                  focus:border-blue-500
                "
                required
              />

            </div>

            {/* BUTTONS */}
            <div
              className="
                flex
                gap-4
                pt-4
              "
            >

              <button
                type="button"
                className="
                  flex-1
                  border
                  border-gray-700
                  hover:border-gray-500
                  py-3
                  rounded-2xl
                "
                onClick={() =>
                  setOpen(false)
                }
              >

                Cancel

              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  flex-1
                  bg-blue-600
                  hover:bg-blue-700
                  py-3
                  rounded-2xl
                  font-semibold
                  flex
                  items-center
                  justify-center
                  gap-2
                  disabled:opacity-50
                "
              >

                <Sparkles
                  size={18}
                />

                {
                  loading
                    ? "Generating..."
                    : "Generate Interview"
                }

              </button>

            </div>

          </div>

        </form>

      </DialogContent>

    </Dialog>
  );
};

export default CreateInterviewModal;