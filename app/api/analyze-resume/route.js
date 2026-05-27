import { NextResponse }
from "next/server";

const pdf =
  require(
    "pdf-parse/lib/pdf-parse"
  );

import OpenRouterModel
from "@/utils/OpenRouterAiModel";

export async function POST(req) {

  try {

    // =====================
    // GET FILE
    // =====================

    const formData =
      await req.formData();

    const file =
      formData.get(
        "resume"
      );

    if (!file) {

      return NextResponse.json(

        {
          success: false,

          error:
            "No file uploaded",
        },

        {
          status: 400,
        }
      );
    }

    // =====================
    // EXTRACT PDF TEXT
    // =====================

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const data =
      await pdf(buffer);

    const resumeText =
      data.text;

    console.log(
      "EXTRACTED PDF TEXT:",
      resumeText
    );

    // =====================
    // AI PROMPT
    // =====================

    const prompt = `

Analyze this resume professionally.

Return ONLY valid JSON.

Resume:
${resumeText}

Format:
{
  "score": 85,

  "jobRole": "Full Stack Developer",

  "skills": [
    "React",
    "Node.js",
    "AWS"
  ],

  "experience": "Fresher",

  "strengths": [
    "strength 1"
  ],

  "weaknesses": [
    "weakness 1"
  ],

  "suggestions": [
    "suggestion 1"
  ]
}
`;

    // =====================
    // AI RESPONSE
    // =====================

    let aiResponse =
      await OpenRouterModel(
        prompt
      );

    console.log(
      "RAW AI RESPONSE:",
      aiResponse
    );

    // =====================
    // CLEAN RESPONSE
    // =====================

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
        .trim();

    const jsonStart =
      aiResponse.indexOf(
        "{"
      );

    const jsonEnd =
      aiResponse.lastIndexOf(
        "}"
      );

    if (
      jsonStart === -1 ||
      jsonEnd === -1
    ) {

      throw new Error(
        "Invalid AI response"
      );
    }

    const cleanJson =
      aiResponse.slice(
        jsonStart,
        jsonEnd + 1
      );

    console.log(
      "CLEAN JSON:",
      cleanJson
    );

    // =====================
    // PARSE JSON
    // =====================

    const parsedData =
      JSON.parse(
        cleanJson
      );

    console.log(
      "PARSED DATA:",
      parsedData
    );

    // =====================
    // SUCCESS RESPONSE
    // =====================

    return NextResponse.json({

  success: true,

  text: resumeText,

  analysis:
    parsedData,
});

  } catch (error) {

    console.log(
      "RESUME ANALYSIS ERROR:",
      error
    );

    return NextResponse.json(

      {
        success: false,

        error:
          String(error),
      },

      {
        status: 500,
      }
    );
  }
}