import NoteListTemplate from '../features/note/NoteListTemplate';
import { useDeletedNoteList } from '../../hooks/useNote';

const DeletedNoteList = () => {

	return (
		<section>
			<NoteListTemplate useNoteList={useDeletedNoteList}/>
		</section>
	);
}

export default DeletedNoteList;