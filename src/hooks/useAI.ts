import { useState } from "react";

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const callOpenAI = async (prompt: string, apiKey: string): Promise<string> => {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "OpenAI Error");
    }

    return result.choices?.[0]?.message?.content || "No response from OpenAI";
  };

  const callGemini = async (prompt: string, apiKey: string): Promise<string> => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Gemini Error");
    }

    return result.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini";
  };

  const callClaude = async (prompt: string, apiKey: string): Promise<string> => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Claude Error");
    }

    return result.content?.[0]?.text || "No response from Claude";
  };

  const callLLaMA = async (prompt: string, apiUrl: string): Promise<string> => {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: prompt,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "LLaMA Error");
    }

    return result.response || "No response from LLaMA";
  };

  const callGrok = async (prompt: string, apiKey: string): Promise<string> => {
    const response = await fetch("https://grok.securemanager.dev/api/grok", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error?.message || "Grok Error");
    }

    return result.response || "No response from Grok";
  };

  return {
    loading,
    setLoading,
    callOpenAI,
    callGemini,
    callClaude,
    callLLaMA,
    callGrok,
  };
};
