import NoteListTemplate from '../features/note/NoteListTemplate';
import { useNoteList } from '../../hooks/useNote';

const NoteList = () => {
	return (
		<section>
			<NoteListTemplate title="전체 회의록" useNoteList={useNoteList} />
		</section>
	);
}

export default NoteList;