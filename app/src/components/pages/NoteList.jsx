import NoteListTemplate from '../features/note/NoteListTemplate';
import { useNoteList } from '../../hooks/useNote';
import NoticeCard from '../features/note/NoticeCard';
import Button from '../ui/button/Button';
import DocumentImage from "../../assets/img/document.png"
import { useNavigate } from 'react-router-dom';

const NoteList = () => {
	const navigate = useNavigate();

	return (
		<section>
			<NoteListTemplate
				key="noteList"
				title="전체 회의록"
				height={window.innerHeight - 230}
				useNoteList={useNoteList}
				empty={
					<NoticeCard
						imageUrl={DocumentImage}
						title="녹음된 회의록이 없습니다"
						contents="회의 녹음을 시작해보세요"
					>
						<Button title="녹음 시작" variant="primary-light" onClick={() => {navigate("/note/new")}}>녹음 시작</Button>
					</NoticeCard>
			}/>
		</section>
	);
}

export default NoteList;