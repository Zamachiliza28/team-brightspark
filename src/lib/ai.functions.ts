import { createServerFn } from "@tanstack/react-start";
import { generateInputSchema } from "./ai-features";
import { runFeatureGeneration } from "./ai.server";
import { describeGatewayError } from "./ai-gateway.server";

export const generateFeatureOutput = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => generateInputSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const text = await runFeatureGeneration(data);
      return { text, demo: false as boolean, notice: null as string | null };
    } catch (error) {
      console.error("[ai] feature generation failed", error);
      return { text: null, demo: true as boolean, notice: describeGatewayError(error) };
    }
  });
