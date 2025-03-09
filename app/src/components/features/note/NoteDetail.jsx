import MDEditor from "@uiw/react-md-editor";
import { useEditNote, useNote } from "../../../hooks/useNote";
import AudioController from "../audio/AudioController";
import Calendar from "../../../assets/icon/calendar.svg";
import {getFormatDate, formatTime} from "../../../utils/dateUtil"
import "./noteDetail.scss"
import { useToastStore } from "../../../store/modalStore";
import { useRef, useState } from "react";
import { ChatButton, ChatRoom } from "../chatbot/ChatRoom";

const NoteDetail = ({ noteId }) => {
	const [isChatOpen, setIsChatOpen] = useState(false);
  const { data, isLoading, error } = useNote(noteId);
	const addToast = useToastStore((state) => state.addToast);
	const editMutation = useEditNote();

	const MeetingNotes = ({ text }) => {
		const markdownRef = useRef(null);

		return (
			<div ref={markdownRef}>
				{text && <MDEditor.Markdown className="markdown-viewr" source={text} />}
			</div>
		);
	};

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div id="note-detail-page">
			<div className="title-group">
				<h3 className={`title-text-${data.id}`} onClick={() => { handleEdit(data.id) }}>{data.title}</h3>
				<span>
					<img src={Calendar} />
					<span>{getFormatDate(data.createTime)}</span>
				</span>
			</div>
			<section className="note-group">
				<article className="script">
					<h5>스크립트</h5>
					<div className="note-scroll">
						<div>
							{data.script?.map((line, index)=> (
								<p key={index}>
									<span className="note-speaker-group">
										<span className="speaker">화자{line.speaker}</span>
										<span className="start-time">{formatTime(line.startTime)}</span>
									</span>
									<span className="word">
										{line.text}
									</span>
								</p>
							))}
						</div>
					</div>
					<AudioController audioUrl={data.audioFileUrl}></AudioController>
				</article>
				<article className="summary">
					<span className="summary-title">
						<h5 className={isChatOpen ? "disabled" : ""} onClick={() => setIsChatOpen(false)}>자동 요약</h5>
						<ChatButton isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
					</span>
					{
					!isChatOpen ? (
							<div className="note-scroll">
								<div>
									<MeetingNotes text={data.minutes} />
								</div>
							</div>
						) : (
							<ChatRoom noteId={noteId}></ChatRoom>
						)
					}
				</article>
			</section>
    </div>
  );
};

export default NoteDetail;