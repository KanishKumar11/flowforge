import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({})
const openai = createOpenAI({})
const anthropic = createAnthropic({})

export const execute = inngest.createFunction(
  {
    id: "execute-ai"
  }, {
  event: "execute/ai",
},
  async ({ event, step }) => {
    const { steps: geminiSteps } = await step.ai.wrap("gemini-generate-text", generateText, {
      system: "You are a helpful assistant",
      prompt: event.data.prompt,
      model: google("gemini-3-flash-preview"),
    })
    const { steps: openaiSteps } = await step.ai.wrap("openai-generate-text", generateText, {
      system: "You are a helpful assistant",
      prompt: event.data.prompt,
      model: openai("gpt-5-mini"),
    })
    const { steps: anthropicSteps } = await step.ai.wrap("anthropic-generate-text", generateText, {
      system: "You are a helpful assistant",
      prompt: event.data.prompt,
      model: anthropic("claude-haiku-4-5"),
    })
    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps
    }
  })