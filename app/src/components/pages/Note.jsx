import { useParams } from "react-router-dom";
import NoteDetail from "../features/note/NoteDetail";

const Note = () => {
	const { noteId } = useParams();

	return (
		<section>
			<NoteDetail noteId={noteId} />
		</section>
	);
}

export default Note;