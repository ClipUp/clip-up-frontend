import Button from '../ui/button/Button';
import { useEffect, useState } from 'react';
import NoteListTemplate from '../features/note/NoteListTemplate';
import { useNavigate } from 'react-router-dom';

const Home = () => {
	const [noteList, setNoteList] = useState(null);
	const navigate = useNavigate();
	const handleRecordBtn = () => {
		navigate("/note/new");
	}
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
			<section>
				<Button title="녹음" onClick={handleRecordBtn}>녹음</Button>
				<Button title="파일업로드">파일업로드</Button>
			</section>
			<section>
				<NoteListTemplate list={noteList}></NoteListTemplate>
			</section>
		</section>
	);
}

export default Home;