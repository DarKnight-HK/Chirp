import Groq from "groq-sdk";
declare global {
  var groq: Groq | undefined;
}

const groq =
  globalThis.groq ||
  new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });
if (process.env.NODE_ENV !== "production") {
  globalThis.groq = groq;
}
const getGroqChatCompletion = async (content: string) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content:
          content +
          " Format in markdown, if I ask for code you should mention the language so that it is readable by this regex `const match = /language-(w+)/.exec(className || '');` and match[1] should give the language. And if you give write text other than code, make sure to format it beautifully in markdown",
      },
    ],
    model: "llama3-8b-8192",
  });
};

export const GetAiResults = async (content: string) => {
  const chatCompletion = await getGroqChatCompletion(content);
  return chatCompletion.choices[0]?.message?.content || "";
};
