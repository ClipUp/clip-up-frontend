import { useNavigate } from 'react-router-dom';
import Microphone from "../../../assets/icon/microphone.svg";
import More from "../../../assets/icon/more.svg";
import Pen from "../../../assets/icon/pen.svg";
import Trash from "../../../assets/icon/trash-active.svg";
import Rotate from "../../../assets/icon/rotate-left.svg"

import { useCancleDeleteNote, useDeleteNote, useEditNote } from '../../../hooks/useNote';
import { ContextMenuButton, ContextMenuItem } from '../../ui/modal/ContextMenu';
import { getFormatDate } from "../../../utils/dateUtil";
import { useConfirmStore, useToastStore } from '../../../store/modalStore';

const NoteItem = ({ ref, note, onClick, menuIdList = [] }) => {
  // const {id, title, checked} = note;
	const { showConfirm } = useConfirmStore();
	const addToast = useToastStore((state) => state.addToast);
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
				$title.removeEventListener("click", handleClick);

				if ($title.innerHTML === originTitle) return;
				if ($title.innerHTML.length < 2 || $title.innerHTML.length > 40) {
					$title.innerHTML = originTitle;
					addToast("제목은 2-40자까지 입력할 수 있습니다.");
					return;
				}
				const res = await editMutation.mutateAsync({meetingId: id, title: $title.innerHTML});

				if (res.status !== "OK") {
					$title.innerHTML = originTitle;
					if (res.status === "BAD_REQUEST") {
						addToast("제목은 2-40자까지 입력할 수 있습니다.");
					} else {
						addToast("일시적인 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.");
					}
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
		if (await showConfirm({
			title: "회의록을 삭제 하시겠습니까?",
			children: <p>삭제된 회의록은 휴지통으로 이동합니다.</p>,
			confirmText: "삭제하기",
			cancelText: "취소",
			variant: "important"
		})) {
			const list = [];
			list.push(meetingIds);
			await deleteMutation.mutateAsync({meetingIds: list});
			addToast("회의록이 휴지통으로 이동되었습니다.");
		}
	}
	const handleCancleDelete = async (meetingIds) => {
		const list = [];
		list.push(meetingIds);
		await cancleDeleteMutation.mutateAsync({meetingIds: list});
		addToast("회의록 복원이 완료되었습니다.");
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