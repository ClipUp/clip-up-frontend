import NoteListTemplate from '../features/note/NoteListTemplate';
import { useDeletedNoteList } from '../../hooks/useNote';

const DeletedNoteList = () => {

	return (
		<section>
			<NoteListTemplate title="휴지통" useNoteList={useDeletedNoteList}/>
		</section>
	);
}

export default DeletedNoteList;