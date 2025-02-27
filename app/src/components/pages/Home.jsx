import NoteListTemplate from '../features/note/NoteListTemplate';
import { useNoteList } from '../../hooks/useNote';
import RecordCard from '../features/audio/RecordCard';

const Home = () => {

	return (
		<section>
			<RecordCard />
			<section>
				<NoteListTemplate title="최근 회의록" maxPages={1} useNoteList={useNoteList}></NoteListTemplate>
			</section>
		</section>
	);
}

export default Home;