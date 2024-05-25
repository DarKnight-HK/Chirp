import Groq from "groq-sdk";
declare global {
  var groq: Groq | undefined;
}

const groq =
  globalThis.groq ||
  new Groq({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
  });
if (process.env.NODE_ENV !== "production") {
  globalThis.groq = groq;
}
const getGroqChatCompletion = async (content: string) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: content,
      },
    ],
    model: "llama3-8b-8192",
  });
};

export const GetAiResults = async (content: string) => {
  const chatCompletion = await getGroqChatCompletion(content);
  return chatCompletion.choices[0]?.message?.content || "";
};
