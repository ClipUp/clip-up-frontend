import { useCallback, useRef } from "react";
import NoteItem from "./NoteItem";
import "./noteList.scss";

const NoteListTemplate = ({title, height, pageLimit, useNoteList, empty, menuIdList}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useNoteList({pageLimit});
  const observer = useRef();
  const lastMeetingRef = useCallback(
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
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // if (status === 'loading') return <p>Loading...</p>;
  // if (status === 'error') return <p>Error loading meetings.</p>;

  return (
    <div className="note-list-card">
      <h5>{title}</h5>
      <ul className="note-list" style={{ height: height }}>
      {
        (status === 'error' || !data?.pages || data?.pages?.flat().length === 0) ? (
          empty
        ) : (
          data?.pages?.map((page, pageIndex) => (
            page?.map((note, index) => (
              <NoteItem
                note={note}
                key={note.id}
                menuIdList={menuIdList}
                ref={index === page.length - 1 ? lastMeetingRef : null}
              />
            ))
          ))
        )
      }
      {/* {pageLimit > 0 && isFetchingNextPage && <p>더보기</p>} */}
      </ul>
    </div>
  );
};

export default NoteListTemplate;
