import { useNavigate } from 'react-router-dom';
import Microphone from "../../../assets/icon/microphone.svg";
import More from "../../../assets/icon/more.svg";
import Pen from "../../../assets/icon/pen.svg";
import Trash from "../../../assets/icon/trash-active.svg";
import Rotate from "../../../assets/icon/rotate-left.svg"

import { useCancleDeleteNote, useDeleteNote, useEditNote } from '../../../hooks/useNote';
import { ContextMenuButton, ContextMenuItem } from '../../ui/modal/ContextMenu';
import { getFormatDate } from "../../../utils/dateUtil";

const NoteItem = ({ ref, note, onClick, menuIdList = [] }) => {
  // const {id, title, checked} = note;
	const deleteMutation = useDeleteNote();
	const cancleDeleteMutation = useCancleDeleteNote();
	const editMutation = useEditNote();
	const navigate = useNavigate();
	const handleClickNote = async () => {
		if (onClick) await onClick();
		navigate(`/note/${note.id}`);
	}
	const handleEdit = (id) => {
		const $title = document.querySelector(`.title-text-${id}`);
		const originTitle = $title.innerHTML;

		if ($title) {
			$title.contentEditable = "true";
			$title.focus();
			const handleClick = (event) => {
				event.stopPropagation();
			}
			const handleOutsideClick = (event) => {
				if (!$title.contains(event.target)) {
					saveChanges();
				}
			};
			const handleKeyDown = (event) => {
				if (event.key === "Enter") {
					event.preventDefault(); // 줄바꿈 방지
					saveChanges();
				}
			};
			const saveChanges = async () => {
				$title.contentEditable = "false";
				document.removeEventListener("click", handleOutsideClick);
				$title.removeEventListener("keydown", handleKeyDown);
				$title.removeEventListener("keydown", handleClick);

				if ($title.innerHTML === originTitle) return;
				const res = await editMutation.mutateAsync({meetingId: id, title: $title.innerHTML});

				if (res.status !== "OK") {
					$title.innerHTML = originTitle;
				}
			};

			setTimeout(() => {
				document.addEventListener("click", handleOutsideClick);
				$title.addEventListener("keydown", handleKeyDown);
				$title.addEventListener("click", handleClick);
			}, 0);
		}
	};
	const handleDelete = async (meetingIds) => {
		if (await confirm("삭제하시겠습니까?")) {
			const list = [];
			list.push(meetingIds);
			await deleteMutation.mutateAsync({meetingIds: list});
		}
	}
	const handleCancleDelete = async (meetingIds) => {
		if (await confirm("복원하시겠습니까?")) {
			const list = [];
			list.push(meetingIds);
			await cancleDeleteMutation.mutateAsync({meetingIds: list});
		}
	}
	const menuList = (id) => {
    const list = [];
    const allList = {
      edit: <ContextMenuItem key={`edit_${id}`} title="수정하기" imageUrl={Pen} onClick={() => handleEdit(id)} />,
      delete: <ContextMenuItem key={`delete_${id}`} title="삭제하기" imageUrl={Trash} onClick={() => handleDelete(id)} />,
      cancle_delete: <ContextMenuItem key={`cancleDelete_${id}`} title="복원하기" imageUrl={Rotate} onClick={() => handleCancleDelete(id)} />,
    };

    menuIdList.map((menu) => {
      list.push(allList[menu]);
    });
    return list;
  }

  return (
		<li ref={ref} onClick={handleClickNote}>
			<span className="list-title">
				<span className="list-icon">
					<img src={Microphone} />
				</span>
				<span className={`title-text-${note.id}`}>
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
				{(menuIdList.length > 0) && (
					<ContextMenuButton id={note.id} imageUrl={More} menuList={menuList(note.id)}></ContextMenuButton>
				)}
			</span>
		</li>
  );
};

export default NoteItem;