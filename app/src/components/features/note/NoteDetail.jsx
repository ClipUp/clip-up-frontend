import { useNote } from "../../../hooks/useNote";
import AudioController from "../audio/AudioController";
import Calendar from "../../../assets/icon/calendar.svg";
import {getFormatDate, formatTime} from "../../../utils/dateUtil"
import "./noteDetail.scss"

const NoteDetail = ({ noteId }) => {
  const { data, isLoading, error } = useNote(noteId);
	const formatText = (text) => {
		return text.replace(/(🔹|✅)/g, '\n$1');
	};
	const MeetingNotes = ({ text }) => {
		const formattedText = formatText(text)
			.split("\n")
			.map((line, index) => (
				<p key={`text${index}`}>
					{line}
				</p>
			));

		return <div>{formattedText}</div>;
	};

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="note-detail">
			<div className="title-group">
				<h3>{data.title}</h3>
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
							{data.script.map((line, index)=> (
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
				</article>
				<article className="summary">
					<h5>자동 요약</h5>
					<div className="note-scroll">
						<div>
							<MeetingNotes text={data.minutes} />
						</div>
					</div>
				</article>
			</section>
      <AudioController audioUrl={data.audioFileUrl}></AudioController>
    </div>
  );
};

export default NoteDetail;