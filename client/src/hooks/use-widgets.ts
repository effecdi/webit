import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useWidgets() {
  return useQuery({
    queryKey: [api.widgets.list.path],
    queryFn: async () => {
      const res = await fetch(api.widgets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch widgets");
      return api.widgets.list.responses[200].parse(await res.json());
    },
  });
}
