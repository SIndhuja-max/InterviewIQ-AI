const OpenRouterModel = async (prompt) => {

  try {

    console.log(
  "OPENROUTER KEY:",
  process.env.OPENROUTER_API_KEY
);

    const response = await fetch(
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

          // MORE STABLE MODEL

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

          temperature: 0.2,

          // LOWER TOKENS = MORE STABLE

          max_tokens: 1400,
        }),
      }
    );

    console.log(
      "OPENROUTER STATUS:",
      response.status
    );

    // =========================
    // HANDLE API FAILURE
    // =========================

    if (!response.ok) {

      const errorText =
        await response.text();

      console.log(
        "OPENROUTER API ERROR:",
        errorText
      );

      return "";
    }

    // =========================
    // PARSE RESPONSE
    // =========================

    const data =
      await response.json();

    console.log(
      "FULL OPENROUTER RESPONSE:",
      JSON.stringify(data)
    );

    const content =
      data?.choices?.[0]
        ?.message?.content;

    if (!content) {

      console.log(
        "NO AI CONTENT RETURNED"
      );

      return "";
    }

    // =========================
    // CLEAN RESPONSE
    // =========================

    const cleanedContent =
      content
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    console.log(
      "CLEANED AI RESPONSE:",
      cleanedContent
    );

    return cleanedContent;

  } catch (error) {

    console.log(
      "OPENROUTER FETCH ERROR:",
      error
    );

    return "";
  }
};

export default OpenRouterModel;