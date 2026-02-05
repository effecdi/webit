import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

type InsertPhoto = z.infer<typeof api.photos.create.input>;

export function usePhotos(mode?: string) {
  return useQuery({
    queryKey: [api.photos.list.path, { mode }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (mode) params.append("mode", mode);
      
      const res = await fetch(`${api.photos.list.path}?${params.toString()}`, { 
        credentials: "include" 
      });
      if (!res.ok) throw new Error("Failed to fetch photos");
      return api.photos.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (photo: InsertPhoto) => {
      const res = await fetch(api.photos.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photo),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to upload photo");
      return api.photos.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.photos.list.path] });
    },
  });
}
