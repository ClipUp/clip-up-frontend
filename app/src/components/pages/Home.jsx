import NoteListTemplate from '../features/note/NoteListTemplate';
import { useNoteList } from '../../hooks/useNote';
import RecordCard from '../features/audio/RecordCard';
import Button from '../ui/button/Button';
import NoticeCard from '../features/note/NoticeCard';
import DocumentImage from "../../assets/img/document.png"
import { useNavigate } from 'react-router-dom';
import "./home.scss";

const Home = () => {
	const navigate = useNavigate();

	return (
		<section className="home-section">
			<RecordCard />
			<section>
				<NoteListTemplate title="최근 회의록" height={480} maxPages={1} useNoteList={useNoteList} empty={
					<NoticeCard
						imageUrl={DocumentImage}
						title="녹음된 회의록이 없습니다"
						contents="회의 녹음을 시작해보세요"
					>
						<Button title="녹음 시작" variant="primary-light" onClick={() => {navigate("/note/new")}}>녹음 시작</Button>
					</NoticeCard>
				}></NoteListTemplate>
			</section>
		</section>
	);
}

export default Home;