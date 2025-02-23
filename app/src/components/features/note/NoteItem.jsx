import { useNavigate } from 'react-router-dom';

const NoteItem = ({ref, note, onToggle, onClick, onChangeState}) => {
  const {id, title, checked} = note;
	const navigate = useNavigate();
	const handleClickNote = async () => {
		if (onClick) await onClick();
		navigate(`/note/${note.id}`);
	}

  return (
	<li ref={ref}>
		<span>
			<input type="checkbox" onClick={onToggle} />
		</span>
		<span onClick={handleClickNote}>
			{note.title}
		</span>
		<span>
			<button onClick={onChangeState}>
				설정
			</button>
		</span>
	</li>
  );
};

export default NoteItem;