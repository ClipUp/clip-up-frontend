import { useInfiniteQuery } from "@tanstack/react-query";
import { noteAPI } from "../api/noteApi";

const useInfiniteNoteList = () => {
  return useInfiniteQuery({
    queryKey: ["notes"],
    queryFn: (data) => noteAPI.fetchNoteList(data),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNext ? allPages.length + 1 : undefined;
    },
  });
};

export default useInfiniteNoteList;
