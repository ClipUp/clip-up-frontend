import { useParams } from 'react-router-dom';
import NoteListTemplate from '../features/note/NoteListTemplate';

const NoteList = () => {
	const { noteState } = useParams();

	return (
		<section>
			<NoteListTemplate />
		</section>
	);
}

export default NoteList;