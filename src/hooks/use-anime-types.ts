import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";

// API function untuk create anime type
async function createAnimeType(
  url: string,
  { arg }: { arg: { name: string } }
) {
  const response = await fetch("/api/anime-types", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    throw new Error("Failed to create anime type");
  }

  return response.json();
}

// API function untuk delete anime type
async function deleteAnimeType(url: string, { arg }: { arg: string }) {
  const response = await fetch(`/api/anime-types/${arg}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete anime type");
  }

  return response.json();
}

// API function untuk update anime type
async function updateAnimeType(
  url: string,
  { arg }: { arg: { id: string; name: string } }
) {
  const response = await fetch(`/api/anime-types/${arg.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: arg.name }),
  });

  if (!response.ok) {
    throw new Error("Failed to update anime type");
  }

  return response.json();
}

// Hook untuk fetch anime types
export function useAnimeTypes() {
  const {
    data,
    error,
    isLoading,
    mutate: mutateFn,
  } = useSWR("/api/anime-types");

  return {
    animeTypes: data?.data || [],
    isLoading,
    isError: error,
    mutate: mutateFn,
  };
}

// Hook untuk create anime type
export function useCreateAnimeType() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/anime-types",
    createAnimeType
  );

  const createAnimeTypeMutation = async (data: { name: string }) => {
    try {
      // Optimistic update: langsung tambahkan ke cache sebelum API response
      const currentData = await mutate("/api/anime-types");
      const optimisticData = {
        ...currentData,
        data: [
          ...(currentData?.data || []),
          {
            id: `temp-${Date.now()}`,
            name: data.name,
            createdAt: new Date().toISOString(),
            _count: { animes: 0 },
          },
        ],
      };

      // Update cache optimistically
      mutate("/api/anime-types", optimisticData, false);

      // Trigger actual API call
      const result = await trigger(data);

      // Revalidate to get real data from server
      await mutate("/api/anime-types");

      return result;
    } catch (err) {
      // Revalidate on error to revert optimistic update
      await mutate("/api/anime-types");
      throw err;
    }
  };

  return {
    createAnimeType: createAnimeTypeMutation,
    isLoading: isMutating,
    error,
  };
}

// Hook untuk delete anime type
export function useDeleteAnimeType() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/anime-types",
    deleteAnimeType
  );

  const deleteAnimeTypeMutation = async (animeTypeId: string) => {
    try {
      // Optimistic update: langsung hapus dari cache sebelum API response
      const currentData = await mutate("/api/anime-types");
      const optimisticData = {
        ...currentData,
        data: (currentData?.data || []).filter(
          (item: any) => item.id !== animeTypeId
        ),
      };

      // Update cache optimistically
      mutate("/api/anime-types", optimisticData, false);

      // Trigger actual API call
      const result = await trigger(animeTypeId);

      // Revalidate to get real data from server
      await mutate("/api/anime-types");

      return result;
    } catch (err) {
      // Revalidate on error to revert optimistic update
      await mutate("/api/anime-types");
      throw err;
    }
  };

  return {
    deleteAnimeType: deleteAnimeTypeMutation,
    isLoading: isMutating,
    error,
  };
}

// Hook untuk fetch single anime type
export function useAnimeType(id: string) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/anime-types/${id}` : null
  );

  return {
    animeType: data?.data || null,
    isLoading,
    isError: error,
  };
}

// Hook untuk update anime type
export function useUpdateAnimeType() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/anime-types",
    updateAnimeType
  );

  const updateAnimeTypeMutation = async (data: {
    id: string;
    name: string;
  }) => {
    try {
      // Optimistic update: langsung update di cache sebelum API response
      const currentData = await mutate("/api/anime-types");
      const optimisticData = {
        ...currentData,
        data: (currentData?.data || []).map((item: any) =>
          item.id === data.id ? { ...item, name: data.name } : item
        ),
      };

      // Update cache optimistically
      mutate("/api/anime-types", optimisticData, false);

      // Trigger actual API call
      const result = await trigger(data);

      // Revalidate to get real data from server
      await mutate("/api/anime-types");

      // Also revalidate single anime type cache
      await mutate(`/api/anime-types/${data.id}`);

      return result;
    } catch (err) {
      // Revalidate on error to revert optimistic update
      await mutate("/api/anime-types");
      throw err;
    }
  };

  return {
    updateAnimeType: updateAnimeTypeMutation,
    isLoading: isMutating,
    error,
  };
}
