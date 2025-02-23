import { useParams } from 'react-router-dom';
import NoteListTemplate from '../features/note/NoteListTemplate';
import { useEffect, useState } from 'react';

const NoteList = () => {
	const { noteState } = useParams();
	const [noteList, setNoteList] = useState(null);

  useEffect(() => {
    setNoteList(
			[
				{id: 1, title: "회의록1", deleted:false, checked: false},
				{id: 2, title: "회의록2", deleted:false, checked: false},
				{id: 3, title: "회의록3", deleted:false, checked: false},
				{id: 4, title: "회의록4", deleted:false, checked: false},
			]
		);
  }, []);
	if (!noteList) return "로딩중";
	return (
		<section>
			<NoteListTemplate list={noteList}></NoteListTemplate>
		</section>
	);
}

export default NoteList;