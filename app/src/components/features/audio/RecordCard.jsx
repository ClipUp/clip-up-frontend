import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/userStore';
import RecordBtnImg from "../../../assets/img/record_button.png"
import Button from "../../ui/button/Button"
import "./recordCard.scss"

const RecordCard = () => {
	const navigate = useNavigate();
	const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
	const accessToken = useAuthStore((state) => state.accessToken);

	const handleButtonClick = () => {
    fileInputRef.current.click();
  };
	const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append('audioFile', selectedFile);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://server.clip-up.kr/api/v1/meetings', true);
			xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      // 프로그레스 이벤트 리스너
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };
      xhr.onload = () => {
        if (xhr.status === 201) {
          console.log('파일 업로드 성공:', xhr.response);
          setUploadProgress(0);
        } else {
          console.error('파일 업로드 실패:', xhr.statusText);
        }
      };
      xhr.onerror = () => {
        console.error('파일 업로드 중 오류 발생');
      };
      xhr.send(formData);
    }
  };
	const handleRecordBtn = () => {
		navigate("/note/new");
	}
	return (
		<>
		<section className="record-section">
			<div className="record-button" style={{ backgroundImage: `url(${RecordBtnImg})` }}>
				<span>
					<h4>클립업과 함께 회의를 시작해보세요</h4>
					<p>녹음만 하면, 회의록이 완성됩니다</p>
				</span>
				<Button title="녹음 시작하기" onClick={handleRecordBtn} variant="primary">녹음 시작하기</Button>
			</div>
			<div className="upload-button">
				<span>
					<h4>파일을 업로드하면 AI가 회의록을 정리해줘요</h4>
					<p>MP3, WAV, M4A 파일 지원</p>
				</span>
				<Button title="파일 업로드" onClick={handleButtonClick}>파일 업로드</Button>
			</div>
			<input
				id="audioFile"
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="*/*" // "audio/mpeg" MP3 파일 형식만 허용
				style={{ display: 'none' }} // input 요소 숨기기
			/>
		</section>
		{uploadProgress > 0 && (
			<div style={{ marginTop: '10px', width: '100%', background: '#f3f3f3', borderRadius: '5px' }}>
				<div
					style={{
						width: `${uploadProgress}%`,
						height: '20px',
						background: '#4caf50',
						borderRadius: '5px',
					}}
				/>
			</div>
		)}
		</>
	);
}

export default RecordCard;