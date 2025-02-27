import { useNote } from "../../../hooks/useNote";
import AudioController from "../audio/AudioController";
import "./noteDetail.scss"

const NoteDetail = ({ noteId }) => {
  const { data, isLoading, error } = useNote(noteId);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="note-detail">
			<h1>{data.title}</h1>
			<section className="note-group">
				<article>
					{data.script.map((line, index)=> (
						<p key={index}>{`화자${line.speaker} ${line.startTime} : ${line.text}`}</p>
					))}
				</article>
				<article>{data.minutes}</article>
			</section>
      <AudioController audioUrl={data.audioFileUrl}></AudioController>
    </div>
  );
};

export default NoteDetail;