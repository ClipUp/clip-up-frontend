import { useInfiniteQuery } from "@tanstack/react-query";
import { noteApi } from "../../../api/noteApi";
import NoteItem from "./NoteItem";
import { useCallback, useRef } from "react";
import "./noteList.scss";

const NoteListTemplate = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notes"],
    queryFn: noteApi.fetchNoteList,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  const noteList = data?.pages.flatMap(page => page.list) || [];

  const observer = useRef();
  const lastNoteRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage]
  );

  return (
    <div className="note-list">
      <ul>
        {noteList.length === 0 ? (
          <div>데이터가 없습니다.</div>
        ) : (
          noteList.map((note, index) => (
            <NoteItem
              note={note}
              key={note.id}
              ref={index === noteList.length - 1 ? lastNoteRef : null}
            />
          ))
        )}
      </ul>
      {isFetchingNextPage && <div>로딩 중...</div>}
    </div>
  );
};

export default NoteListTemplate;