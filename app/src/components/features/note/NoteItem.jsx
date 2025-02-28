import { useNavigate } from 'react-router-dom';
import Microphone from "../../../assets/icon/microphone.svg"
import More from "../../../assets/icon/more.svg"
import IconButton from '../../ui/button/IconButton';
import {getFormatDate} from "../../../utils/dateUtil"

const NoteItem = ({ref, note, onToggle, onClick, onChangeState}) => {
  // const {id, title, checked} = note;
	const navigate = useNavigate();
	const handleClickNote = async () => {
		if (onClick) await onClick();
		navigate(`/note/${note.id}`);
	}

  return (
		<li ref={ref} onClick={handleClickNote}>
			<span className="list-title">
				<span className="list-icon">
					<img src={Microphone} />
				</span>
				<span >
					{note.title}
				</span>
			</span>
			<span className="list-info">
				<span>
					{note.audioFileDuration}분
				</span>
				<span className="list-date">
					{getFormatDate(note.creatTime)}
				</span>
				<IconButton title="더보기" onClick={onChangeState}>
					<img src={More} />
				</IconButton>
			</span>
		</li>
  );
};

export default NoteItem;