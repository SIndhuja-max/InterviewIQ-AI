
import { NextResponse } from "next/server";

export async function POST(req) {

  try {

    const { prompt } =
      await req.json();

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
          },

          body: JSON.stringify({
            model:
              "openrouter/auto",

            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );

    const data =
      await response.json();

      console.log(
  "OPENROUTER SERVER RESPONSE:",
  JSON.stringify(data)
);

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}

