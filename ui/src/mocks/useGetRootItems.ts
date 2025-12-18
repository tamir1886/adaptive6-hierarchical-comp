import { useEffect, useState } from "react";
import type { FsItem } from "./types";
import type { FakeFsServer } from "./fakeFsServer";

export function useGetRootItems(server: FakeFsServer) {
  const [data, setData] = useState<FsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await server.fetchChildren("root");
        if (!cancelled) setData(items);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load root");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [server]);

  return { data, loading, error };
}
