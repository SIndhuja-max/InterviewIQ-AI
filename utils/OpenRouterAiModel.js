const OpenRouterModel = async (prompt) => {

  try {

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,

          "Content-Type": "application/json",

          "HTTP-Referer": "http://localhost:3000",

          "X-Title": "InterviewIQ AI",
        },

        body: JSON.stringify({

          model: "openrouter/free",

          messages: [
            {
              role: "system",
              content:
                "You are a strict JSON API. Always return ONLY valid JSON. Never include explanations, markdown, or extra text.",
            },

            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.3,

          max_tokens: 1000,
        }),
      }
    );

    const data = await response.json();

    console.log(
      "OpenRouter Full Response:",
      data
    );

    return (
      data?.choices?.[0]?.message?.content || ""
    );

  } catch (error) {

    console.log(
      "OPENROUTER ERROR:",
      error
    );

    return "";
  }
};

export default OpenRouterModel;