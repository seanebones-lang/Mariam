import { SquareClient, SquareEnvironment } from "square";
import { getServerEnv } from "./env";

export function getSquareClient(): SquareClient | null {
  const env = getServerEnv();
  if (
    !env.SQUARE_ACCESS_TOKEN ||
    env.SQUARE_ACCESS_TOKEN === "placeholder"
  ) {
    return null;
  }
  const sandbox =
    env.SQUARE_ACCESS_TOKEN.startsWith("EAAA") ||
    env.SQUARE_ACCESS_TOKEN.includes("sandbox");
  return new SquareClient({
    token: env.SQUARE_ACCESS_TOKEN,
    environment: sandbox
      ? SquareEnvironment.Sandbox
      : SquareEnvironment.Production,
  });
}
