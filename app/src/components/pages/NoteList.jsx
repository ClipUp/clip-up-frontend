import NoteListTemplate from '../features/note/NoteListTemplate';
import { useNoteList } from '../../hooks/useNote';
import EmptyNoticeList from '../features/note/EmptyNoticeList';
import Button from '../ui/button/Button';
import DocumentImage from "../../assets/img/document.webp"
import Microphone from "../../assets/icon/microphone.svg";
import { useNavigate } from 'react-router-dom';
import "./noteList.scss";

const NoteList = () => {
	const navigate = useNavigate();

	return (
		<section id="note-list-page">
			<NoteListTemplate
				key="noteList"
				title="전체 회의록"
				height={window.innerHeight - 230}
				useNoteList={useNoteList}
				menuIdList={["edit", "delete"]}
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
			}/>
		</section>
	);
}

export default NoteList;