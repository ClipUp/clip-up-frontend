import { useParams } from "react-router-dom";

const Note = () => {
	const { noteId } = useParams();

	return (
		<section>
			<section>
				<h1>회의록 {noteId}</h1>
			</section>
			<section>
				<article>스크립트</article>
				<article>요약</article>
			</section>
		</section>
	);
}

export default Note;