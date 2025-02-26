import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { noteAPI } from "../api/noteApi";

const useNoteList = (maxPages) => {
  return useInfiniteQuery({
    queryKey: ["notes"],
    queryFn: (data) => noteAPI.fetchNoteList(data),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0 || allPages.length >= maxPages) return null;
      return lastPage[lastPage.length - 1].id;
    },
  });
};

const useCreateNote = () => {
  return useMutation({
    mutationFn: (data) => noteAPI.createNote(data)
  });
};

export {useNoteList, useCreateNote};
