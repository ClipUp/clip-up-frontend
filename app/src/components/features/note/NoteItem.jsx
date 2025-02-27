import { useNavigate } from 'react-router-dom';
import Microphone from "../../../assets/icon/microphone.svg"
import More from "../../../assets/icon/more.svg"
import IconButton from '../../ui/button/IconButton';

const NoteItem = ({ref, note, onToggle, onClick, onChangeState}) => {
  const {id, title, checked} = note;
	const navigate = useNavigate();
	const handleClickNote = async () => {
		if (onClick) await onClick();
		navigate(`/note/${note.id}`);
	}

  return (
		<li ref={ref}>
			<img src={Microphone} />
			<span onClick={handleClickNote}>
				{note.title}
			</span>
			<span>
				<span>
					{note.audioFileDuration}
				</span>
				<IconButton title="더보기" onClick={onChangeState}>
					<img src={More} />
				</IconButton>
				<span>
					{note.creatTime}
				</span>
			</span>
		</li>
  );
};

export default NoteItem;