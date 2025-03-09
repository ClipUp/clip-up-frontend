import { useCallback, useRef } from "react";
import NoteItem from "./NoteItem";
import "./noteListTemplate.scss";

const NoteListTemplate = ({title, pageLimit, useNoteList, empty, menuIdList}) => {
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
    <section className="note-list-card section-board">
      <h5>{title}</h5>
      <ul className="note-list">
        {
          (status === 'error' || !data?.pages || data?.pages?.flat().length === 0) ? (
            empty
          ) : (
            data?.pages?.map((page) => (
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
      </ul>
    </section>
  );
};

export default NoteListTemplate;
