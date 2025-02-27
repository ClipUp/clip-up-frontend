import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { noteAPI } from "../api/noteApi";
import { useAuthStore } from "../store/userStore";

const useNoteList = (maxPages) => {
  return useInfiniteQuery({
    queryKey: ["notes"],
    queryFn: (data) => noteAPI.fetchNoteList({...data, status: "all"}),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 || allPages.length >= maxPages) return null;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

const useDeletedNoteList = (maxPages) => {
  return useInfiniteQuery({
    queryKey: ["notes"],
    queryFn: (data) => noteAPI.fetchNoteList({...data, status: "deleted"}),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 || allPages.length >= maxPages) return null;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

const useCreateNote = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useMutation({
    mutationFn: (data) => noteAPI.createNote({data, accessToken})
  });
};

const useNote = (meetingId) => {
  return useQuery({
    queryKey: ['note', meetingId],
    queryFn: () => noteAPI.getNote({ meetingId }),
    enabled: !!meetingId,
    select: (response) => response.data,
  });
};

const useEditNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ meetingIds, title }) => {
      queryClient.setQueryData(['note', meetingIds], (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, title };
      });
      return await noteAPI.editNote({ meetingIds, title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
    },
  });
};

export {useNoteList, useCreateNote, useDeletedNoteList, useNote, useEditNote};
