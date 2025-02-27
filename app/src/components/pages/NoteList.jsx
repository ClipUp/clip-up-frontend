import NoteListTemplate from '../features/note/NoteListTemplate';
import { useNoteList } from '../../hooks/useNote';

const NoteList = () => {
	return (
		<section>
			<NoteListTemplate useNoteList={useNoteList} />
		</section>
	);
}

export default NoteList;