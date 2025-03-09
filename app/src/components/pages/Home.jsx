import NoteListTemplate from '../features/note/NoteListTemplate';
import { useRecentNoteList } from '../../hooks/useNote';
import RecordCard from '../features/audio/RecordCard';
import Button from '../ui/button/Button';
import EmptyNoticeList from '../features/note/EmptyNoticeList';
import DocumentImage from "../../assets/img/document.webp";
import Microphone from "../../assets/icon/microphone.svg";
import { useNavigate } from 'react-router-dom';
import "./home.scss";

const Home = () => {
	const navigate = useNavigate();

	return (
		<section id="home-page">
			<RecordCard />
			<NoteListTemplate
				title="최근 회의록"
				height={576}
				pageLimit={1}
				useNoteList={useRecentNoteList}
				empty={
					<EmptyNoticeList
						imageUrl={DocumentImage}
						title="녹음된 회의록이 없습니다"
						contents="회의 녹음을 시작해보세요"
					>
						<Button title="녹음 시작" variant="primary-light" onClick={() => {navigate("/note/new")}}>
							<img src={Microphone} />
							<span>녹음 시작</span>
						</Button>
					</EmptyNoticeList>
				}
			/>
		</section>
	);
}

export default Home;