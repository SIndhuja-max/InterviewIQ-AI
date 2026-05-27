import { NextResponse }
from "next/server";

export async function POST(req) {

  try {

    const body =
      await req.json();

    const { prompt } =
      body;

    // =========================
    // VALIDATION
    // =========================

    if (!prompt) {

      return NextResponse.json(
        {

          success: false,

          message:
            "Prompt is required",
        },
        {
          status: 400,
        }
      );
    }

    // =========================
    // OPENROUTER API CALL
    // =========================

    const response =
      await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {

          method: "POST",

          headers: {

            Authorization:
              `Bearer ${process.env.OPENROUTER_API_KEY}`,

            "Content-Type":
              "application/json",

            "HTTP-Referer":
              process.env.NEXT_PUBLIC_APP_URL ||

              "http://localhost:3000",

            "X-Title":
              "InterviewIQ AI",
          },

          body: JSON.stringify({

            // WORKING FREE MODEL

            model:
  "openrouter/auto",

            messages: [

              {
                role: "system",

                content:
                  "You are a strict JSON API. Return ONLY valid JSON. No markdown. No explanations. No extra text.",
              },

              {
                role: "user",

                content: prompt,
              },
            ],

            // LOWER = MORE STABLE

            temperature: 0.2,

            // KEEP LOW FOR FREE MODELS

            max_tokens: 1400,
          }),
        }
      );

    // =========================
    // HANDLE OPENROUTER ERRORS
    // =========================

    if (!response.ok) {

      const errorText =
        await response.text();

      console.log(
        "OPENROUTER ERROR:",
        errorText
      );

      return NextResponse.json(
        {

          success: false,

          message:
            errorText,
        },
        {
          status:
            response.status,
        }
      );
    }

    // =========================
    // PARSE RESPONSE
    // =========================

    const data =
      await response.json();

    console.log(
      "OPENROUTER RESPONSE:",
      JSON.stringify(data)
    );

    const content =
      data?.choices?.[0]
        ?.message?.content;

    // =========================
    // VALIDATE CONTENT
    // =========================

    if (!content) {

      return NextResponse.json(
        {

          success: false,

          message:
            "No AI content returned",
        },
        {
          status: 500,
        }
      );
    }

    // =========================
    // CLEAN RESPONSE
    // =========================

    const cleanedContent =
      content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    // =========================
    // SUCCESS
    // =========================

    return NextResponse.json(
      {

        success: true,

        content:
          cleanedContent,
      },
      {
        status: 200,
      }
    );

  } catch (error) {

    console.log(
      "GENERATE INTERVIEW ERROR:",
      error
    );

    return NextResponse.json(
      {

        success: false,

        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}