import { useMemo } from "react";
import { FakeFsServer } from "./fakeFsServer";

export function useCreateServer() {
  return useMemo(
    () =>
      new FakeFsServer({
        delayMs: 1000,
        errorRate: 0,
        seed: Math.floor(Math.random() * 1_000_000_000),
        folderRatio: 0.7,
        minItems: 3,
        maxItems: 8,
      }),
    []
  );
}
