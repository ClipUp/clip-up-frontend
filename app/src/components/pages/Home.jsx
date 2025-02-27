import Button from '../ui/button/Button';
import { useRef, useState } from 'react';
import NoteListTemplate from '../features/note/NoteListTemplate';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/userStore';
import { useNoteList } from '../../hooks/useNote';

const Home = () => {
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
		<section>
			<section>
				<Button title="녹음" onClick={handleRecordBtn}>녹음</Button>
				<Button title="파일업로드" onClick={handleButtonClick}>파일업로드</Button>
				<input
					id="audioFile"
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					accept="*/*" // "audio/mpeg" MP3 파일 형식만 허용
					style={{ display: 'none' }} // input 요소 숨기기
				/>
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
			</section>
			<section>
				<NoteListTemplate maxPages={1} useNoteList={useNoteList}></NoteListTemplate>
			</section>
		</section>
	);
}

export default Home;