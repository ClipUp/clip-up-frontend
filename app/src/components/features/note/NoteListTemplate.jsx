import { useInfiniteQuery } from "@tanstack/react-query";
import { noteAPI } from "../../../api/noteApi";
import NoteItem from "./NoteItem";
import { useCallback, useEffect, useRef, useState } from "react";
import "./noteList.scss";

const NoteListTemplate = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["notes"],
    queryFn: noteAPI.fetchNoteList,
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
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const handleResize = () => {
    setWindowHeight(window.innerHeight);
  };

  useEffect(() => {
    const element = document.querySelector('.note-list');
    if (element) {
      element.style.height = `${windowHeight}px`;
    }


    window.addEventListener('resize', handleResize);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener('resize', handleResize);
    };
  }, [windowHeight]);

  useEffect(() => {
    const element = document.querySelector('.note-list');
    if (element) {
      element.style.height = `${windowHeight}px`;
    }
  }, [windowHeight]);

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