import AudioRecorder from "../features/audio/AudioRecorder";
import NoticeCard from "../features/note/NoticeCard";
import VolumeImage from "../../assets/img/volume.webp"
import "./record.scss"

const Record = () => {
	return (
		<section>
			<div className="record-section">
				<NoticeCard
					imageUrl={VolumeImage}
					title="녹음이 진행되고 있어요"
					contents="녹음이 완료되면 스크립트와 회의록이 생성됩니다"
				>
					<AudioRecorder />
				</NoticeCard>
			</div>
		</section>
	);
}

export default Record;