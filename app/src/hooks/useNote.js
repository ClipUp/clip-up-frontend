import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { noteAPI } from "../api/noteApi";
import { useAuthStore } from "../store/userStore";

const useRecentNoteList = ({ pageLimit = 1}) => {
  return useInfiniteQuery({
    queryKey: ["notes", "recent"],
    queryFn: async ({ pageParam = null }) => {
      const response = await noteAPI.fetchNoteList({
        lastMeetingId: pageParam,
        status: 'all',
        limit: 10,
      });
      return response;
    },
    getNextPageParam: (lastPage, allPages) => (allPages.length >= pageLimit || !lastPage.length ? undefined : lastPage[lastPage.length - 1].id),
  });
};

const useNoteList = (pageLimit) => {
  return useInfiniteQuery({
    queryKey: ["notes", "all"],
    queryFn: async ({ pageParam = null }) => {
      const response = await noteAPI.fetchNoteList({
        lastMeetingId: pageParam,
        status: 'all',
        limit: 10,
      });
      return response;
    },
    getNextPageParam: (lastPage) => (!lastPage.length ? undefined : lastPage[lastPage.length - 1].id),
  });
};

const useDeletedNoteList = (pageLimit) => {
  return useInfiniteQuery({
    queryKey: ["notes", "deleted"],
    queryFn: async ({ pageParam = null }) => {
      const response = await noteAPI.fetchNoteList({
        lastMeetingId: pageParam,
        status: 'deleted',
        limit: 10,
      });
      return response;
    },
    getNextPageParam: (lastPage) => (!lastPage.length ? undefined : lastPage[lastPage.length - 1].id),
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

export {useRecentNoteList, useNoteList, useDeletedNoteList, useCreateNote, useNote, useEditNote};
