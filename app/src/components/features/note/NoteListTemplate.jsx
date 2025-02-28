import NoteItem from "./NoteItem";
import { useEffect, useRef, useState } from "react";
import "./noteList.scss";

const NoteListTemplate = ({maxPages = Infinity, useNoteList, title, height}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useNoteList(maxPages);
  const observerRef = useRef(null);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    if (!observerRef.current || !hasNextPage || pageCount >= maxPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
          setPageCount((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, maxPages, pageCount]);

  return (
    <div className="note-list-card">
      <h5>{title}</h5>
      <ul className="note-list" style={{height: height}}>
        {data?.pages.flat().length === 0 ? (
          <div>데이터가 없습니다.</div>
        ) : (
          data?.pages.flat().map((note, index) => (
            <NoteItem
              note={note}
              key={note.id}
              ref={index === data?.pages.flat().length - 1 ? observerRef : null}
            />
          ))
        )}
      </ul>
      {isFetchingNextPage && <div>로딩 중...</div>}
    </div>
  );
};

export default NoteListTemplate;