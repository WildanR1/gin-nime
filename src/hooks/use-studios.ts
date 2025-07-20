import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { mutate } from "swr";

// API function untuk create studio
async function createStudio(url: string, { arg }: { arg: { name: string } }) {
  const response = await fetch("/api/studios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!response.ok) {
    throw new Error("Failed to create studio");
  }

  return response.json();
}

// API function untuk delete studio
async function deleteStudio(url: string, { arg }: { arg: string }) {
  const response = await fetch(`/api/studios/${arg}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete studio");
  }

  return response.json();
}

// API function untuk update studio
async function updateStudio(
  url: string,
  { arg }: { arg: { id: string; name: string } }
) {
  const response = await fetch(`/api/studios/${arg.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: arg.name }),
  });

  if (!response.ok) {
    throw new Error("Failed to update studio");
  }

  return response.json();
}

// Hook untuk fetch studios
export function useStudios() {
  const { data, error, isLoading, mutate: mutateFn } = useSWR("/api/studios");

  return {
    studios: data?.data || [],
    isLoading,
    isError: error,
    mutate: mutateFn,
  };
}

// Hook untuk create studio
export function useCreateStudio() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/studios",
    createStudio
  );

  const createStudioMutation = async (data: { name: string }) => {
    try {
      // Optimistic update: langsung tambahkan ke cache sebelum API response
      const currentData = await mutate("/api/studios");
      const optimisticData = {
        ...currentData,
        data: [
          ...(currentData?.data || []),
          {
            id: `temp-${Date.now()}`,
            name: data.name,
            _count: { animes: 0 },
          },
        ],
      };

      // Update cache optimistically
      mutate("/api/studios", optimisticData, false);

      // Trigger actual API call
      const result = await trigger(data);

      // Revalidate to get real data from server
      await mutate("/api/studios");

      return result;
    } catch (err) {
      // Revalidate on error to revert optimistic update
      await mutate("/api/studios");
      throw err;
    }
  };

  return {
    createStudio: createStudioMutation,
    isLoading: isMutating,
    error,
  };
}

// Hook untuk update studio
export function useUpdateStudio() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/studios",
    updateStudio
  );

  const updateStudioMutation = async (data: { id: string; name: string }) => {
    try {
      // Optimistic update: langsung update di cache sebelum API response
      const currentData = await mutate("/api/studios");
      const optimisticData = {
        ...currentData,
        data: (currentData?.data || []).map((item: any) =>
          item.id === data.id
            ? {
                ...item,
                name: data.name,
              }
            : item
        ),
      };

      // Update cache optimistically
      mutate("/api/studios", optimisticData, false);

      // Trigger actual API call
      const result = await trigger(data);

      // Revalidate to get real data from server
      mutate("/api/studios");

      return result;
    } catch (err) {
      // Revalidate on error to revert optimistic update
      mutate("/api/studios");
      throw err;
    }
  };

  return {
    updateStudio: updateStudioMutation,
    isLoading: isMutating,
    error,
  };
}

// Hook untuk delete studio
export function useDeleteStudio() {
  const { trigger, isMutating, error } = useSWRMutation(
    "/api/studios",
    deleteStudio
  );

  const deleteStudioMutation = async (studioId: string) => {
    try {
      // Optimistic update: langsung hapus dari cache sebelum API response
      const currentData = await mutate("/api/studios");
      const optimisticData = {
        ...currentData,
        data: (currentData?.data || []).filter(
          (item: any) => item.id !== studioId
        ),
      };

      // Update cache optimistically
      mutate("/api/studios", optimisticData, false);

      // Trigger actual API call
      const result = await trigger(studioId);

      // Hanya revalidate jika berhasil, dan tidak perlu await
      mutate("/api/studios");

      return result;
    } catch (err) {
      // Revalidate on error to revert optimistic update
      mutate("/api/studios");
      throw err;
    }
  };

  return {
    deleteStudio: deleteStudioMutation,
    isLoading: isMutating,
    error,
  };
}

// Hook untuk fetch single studio by ID
export function useStudio(id: string) {
  const {
    data,
    error,
    isLoading,
    mutate: mutateFn,
  } = useSWR(id ? `/api/studios/${id}` : null);

  return {
    studio: data?.data || null,
    isLoading,
    isError: error,
    mutate: mutateFn,
  };
}
