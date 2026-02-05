import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Event } from "@shared/schema";
import { z } from "zod";

type InsertEvent = z.infer<typeof api.events.create.input>;
type UpdateEvent = z.infer<typeof api.events.update.input>;

export function useEvents(mode?: string, date?: string) {
  return useQuery({
    queryKey: [api.events.list.path, { mode, date }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mode) params.append("mode", mode);
      if (date) params.append("date", date);
      
      const res = await fetch(`${api.events.list.path}?${params.toString()}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.events.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: InsertEvent) => {
      const res = await fetch(api.events.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) throw new Error("Validation failed");
        throw new Error("Failed to create event");
      }
      return api.events.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateEvent) => {
      const url = buildUrl(api.events.update.path, { id });
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update event");
      return api.events.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.events.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete event");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.events.list.path] });
    },
  });
}
